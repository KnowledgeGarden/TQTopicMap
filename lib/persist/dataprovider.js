/**
 * DataProvider
 * 
 */
var SubjectProxy = require('../models/subjectproxy')
	, EventEmitter = require('events').EventEmitter
	, util = require('util')
	, uuid = require('node-uuid')
	, qdsl = require('../util/querydsl')
	, treenode = require('../util/treenodestruct')
    , langutils = require('../util/propertylanguageutils')
	, properties = require('../properties')
    , SimpleCache = require("simple-lru-cache")
	, constants = require('../constants');

var DataProvider = module.exports = function(environment, db) {
	this.env = environment;
	this.ESClient = db;
    this.cache =  new SimpleCache({"maxSize":2048});
//	uuid1 = uuid.v1();
	this.queryDSL = new qdsl();
	console.log('DataProvider '+this.ESClient);
};

util.inherits(DataProvider, EventEmitter);

/**
 * Cannot use proxy <code>json</code> if it is <em>private</em> and not
 * available to <code>credentials</code> supplied
 * @param self
 * @param json
 * @param credentials, theoretically an array of values to compare
 * @param callback: signature (err)
 */
function _checkCredentials(self, json, credentials, callback) {
	var err, //so long as err is undefined, the proxy is usable
		pvt = json.isPrv,
		isLive = json.isLiv;
	//see if it's private
    self.env.logDebug("DataProvider._checkCredentials "+json+" "+json.lox+" "+pvt);
	if (isLive && pvt === 'true') {
         self.env.logDebug("DataProvider._checkCredentials-1 "+credentials);
		//see if creator
		var creator = json.crtr;
		var where = credentials.indexOf(creator);
		console.log("DataProvider.checkCredentials-2 "+creator+" "+where);
		if (where < 0) {
			var len = credentials.length;
			if (len > 0) {
				//ok, check for Admin
				where = credentials.indexOf(constants.ADMIN_CREDENTIALS);
				console.log("DataProvider.checkCredentials-3 "+where);
				if (where < 0) {
					//now look at rstns
					var acls = json.rstns;
                    self.env.logDebug("DataProvider._checkCredentials-2 "+acls);
					if (acls) {
						//This is a complex situation.
						//An example is a group member; the proxy might be for the group
						// which means that its ACL includes the identities of all members
						// where member identity will be the first entry in credentials
						for(var i=0;i<len;i++) {
							var where = acls.indexOf(credentials[i]);
							console.log("SubjectProxy.)checkCredentials-4 "+where+" "+credentials[i]+" "+JSON.stringify(acls));
							if (where > -1) {
								console.log("SubjectProxy.)checkCredentials-5 "+credentials[i]);
								//found
								return callback(err);
							}
						}
						console.log("SubjectProxy.)checkCredentials-6 ");
						//if we get here, we're hosed
						err = "Insufficient credentials 1 for "+json.lox;
					} else {
						//exhausted tests and no ACLs to test
						err = "Insufficient credentials 2 for "+json.lox;
					}
				} else {
                    err = "Insufficient credentials 3 for "+json.lox;
                }
			} else {
				//no credentials -- this is a guest user
				err = "Insufficient credentials 4 for "+json.lox;
			}
		} // creator covers private node
	} else if (!isLive) {//pvt
		err = "Proxy is not live for "+json.lox;
	}
    self.env.logDebug("DataProvider._checkCredentials+ "+err);
	return callback(err);
}


/**
 * Index this <code>proxy</code>
 * @param proxy
 * @param callback: signature (err,data) 
 */
DataProvider.prototype.putNode = function putNode(proxy,callback) {
	console.log("DataProvider.putNode "+proxy.toJSON());
	var self = this;
	var _jopts = {};
	_jopts._index = constants.TOPIC_INDEX;
	_jopts._type = constants.CORE_TYPE;
	_jopts._id = proxy.getLocator();
	self.ESClient.index(_jopts,proxy.toJSON(),function(err,data) {
		//tell the world we have a new proxy
		//used by any merge agents or other listeners
		if (!err) {
			self.emit('newproxy', proxy);
		} else {
			self.env.logError("DP.putNode "+proxy+" "+err);
		}
        self.cache.set(proxy.getLocator(), proxy);
		return callback(err,data);
	});
};

/**
 * Returns a list of nodes which are <em>parents</em> to the node identified by
 * <code>locator</code>. Recursive since it pages through returns in blocks of 100
 * @param self
 * @param locator
 * @param cursor (first call = 0)
 * @param credentials
 * @param callback signature (error, nodelist)
 * /
var __pageFetchSpecial = function(self, locator, cursor, credentials, callback) {
	var theList = [];
	var error = "";
	var query = self.queryDSL.listNodesByKey("cNL.locator", locator, cursor, 100);
	self.env.logDebug("DataProvider.__pageFetchSpecial "+locator+" | "+cursor+" | "+query);
	__listNodesByQuery(self,query,0,100,credentials, function(err, result, count) {
		if (err) {error+=err;}
		console.log("DataProvider.__pageFetchSpecial "+error+" | "+cursor+" | "+count+" | "+result);
		if (result) {
			console.log("DataProvider.__pageFetchSpecial-1 "+error+" | "+cursor+" | "+count+" | "+result);
			theList = result;
			if (count === 100) {
				//time to recurse
				__pageFetchSpecial(self, locator, (cursor+100),credentials, function(err,data) {
					if (err) {error+=err;}
					console.log("DataProvider.__pageFetchSpecial-2 "+error+" | "+cursor+" | "+count);
					if (count > 0) {
						console.log("DataProvider.__pageFetchSpecial-3");
						for (var i=0;i<count;i++) {
							theList.push(data[i]);
						}
					}
					console.log("DataProvider.__pageFetchSpecial-4 "+error+" | "+cursor+" | "+count);
					return callback(error,theList);
				});
			} 
		}
		return callback(error,theList);
	});
};

/**
 * Find all parents of node identified by <code>locator</code> and perform surgery on them
 * @param self
 * @param locator
 * @param oldLabel
 * @param newLabel
 * @param credentials
 * @param callback signature (err)
 * /
var __findAndChangeParents = function(self, locator, oldLabel, newLabel, credentials, callback) {
	var error = "";
	__pageFetchSpecial(self, locator, 0, credentials, function(err, nodelist) {
		self.env.logDebug("DataProvider._findAndChangeParents "+error+" | "+nodelist.length);
		if(err) {error+=err;}
		if (nodelist.length > 0) {
			var updatedProxies = [];
			var prox, childlist, len,isFound;
			//ripple through them and perform surgery
			for (var i=0;i<nodelist.length;i++) {
				prox = nodelist[i];
				isFound = false;
				childlist = prox.listChildNodes(); // get all of them
				if (childlist) {//sanity
					self.env.logDebug("DataProvider._findAndChangeParents-1 "+JSON.stringify(childlist));
					len = childlist.length;
					for (var j=0;j<len;j++) {
						if (childlist[j].subject === oldLabel) {
							isFound = true;
							childlist[j].subject = newLabel;
						}
					}
					if (isFound) {
						updatedProxies.push(prox);
					}
				}
			}
			//we now have a list of proxies: time to save them
			var cursor = 0;
			len = updatedProxies.length;
			function loop() {
				if (cursor >= len) {
					return callback(error);
				}
				prox = updatedProxies(cursor++);
				self.putNode(prox, function(err,data) {
					if(err) {error+=err;}
					loop(); // continue the loop
				});
			}
			loop(); // start the loop
		} else {
			return callback(error);
		}
	});
};
*/
var __repairAffectedLabelTreeNodes = function (self, nodeLocatorList, oldLabel, newLabel, credentials, callback) {
	self.env.logDebug("DataProvider.__repairAffectedLabelTreeNodes "+JSON.stringify(nodeLocatorList));
	if (nodeLocatorList.length == 0) {
		return callback();
	}
	var cursor = 0;
	var len = nodeLocatorList.length;
	var lox,len2, struct, theList, relns,prox;
	var error = "";
	var repairedNodes = [];
	var found = false;
	function loop() {
		//perform surgery on each node
		if (cursor >= len) {
			self.env.logDebug("DataProvider.__repairAffectedLabelTreeNodes-1 "+cursor+" "+len);
			//now, save the repaired nodes
			var cursor2 = 0;
			var len3 = repairedNodes.length;
			if (len3 == 0) {
				return callback(error);
			}
			function loop2() {
				//grab a proxy from the list and save it
				self.env.logDebug("DataProvider.__repairAffectedLabelTreeNodes-2 "+cursor2+" "+len3);
				if (cursor2 >= len3) {
					return callback(error);
				}
				prox = repairedNodes[cursor2++];
				prox.setLastEditDate(new Date());
			//	self.env.logDebug("DataProvider.__repairAffectedLabelTreeNodes-3 "+prox.getLocator());
				self.putNode(prox,function(err,data) {
					if (err) {error+=err;}
					loop2();
				});
			}
			loop2();
		} else {
			lox = nodeLocatorList[cursor++];
			self.env.logDebug("DataProvider.__repairAffectedLabelTreeNodes-4 "+cursor+" "+len+" "+lox);
			//get the node, then process it
			self.getNodeByLocator(lox,credentials, function(err,ndx) {
				if (err) {error+=err;}
				var n = ndx;
				self.env.logDebug("DataProvider.__repairAffectedLabelTreeNodes-4a "+err+" | "+n+" | "+lox);
			//	self.env.logDebug("DataProvider.__repairAffectedLabelTreeNodes-4b "+err+" | "+n.getLocator());
			//	self.env.logDebug("DataProvider.__repairAffectedLabelTreeNodes-4c "+err+" | "+n.toJSON());
				//node-wide variable: if true, something was found meaning this
				// node got surgery and must be saved.
				var found = false;
				//get the parents
				theList = n.listParentNodes();
				if (theList && theList.length > 0) {
					len2 = theList.length;
					for (var i=0;i<len2;i++) {
						struct = theList[i]; //childstruct.js
						if (struct.subject === oldLabel) {
			//				self.env.logDebug("DataProvider.__repairAffectedLabelTreeNodes-6 "+JSON.stringify(struct));
							//do the surgery and remember 
							struct.subject = newLabel;
							found = true;
						}
					}					
				}
				//then the children
				theList = n.listChildNodes();
				if (theList && theList.length > 0) {
					len2 = theList.length;
					for (var i=0;i<len2;i++) {
						struct = theList[i]; //childstruct.js
						if (struct.subject === oldLabel) {
			//				self.env.logDebug("DataProvider.__repairAffectedLabelTreeNodes-7 "+JSON.stringify(struct));
							//do the surgery and remember 
							struct.subject = newLabel;
							found = true;
						}
					}					
				}
				if (found) {
					repairedNodes.push(n);
				}

				loop();
			});
		}
	}
	loop();
};
var __repairAffectedLabelNodes = function (self, nodeLocatorList, oldLabel, newLabel, credentials, callback) {
	self.env.logDebug("DataProvider.__repairAffectedLabelNodes "+JSON.stringify(nodeLocatorList));
	if (nodeLocatorList.length == 0) {
		return callback();
	}
	var cursor = 0;
	var len = nodeLocatorList.length;
	var lox,len2, struct, theList, relns,prox;
	var error = "";
	var repairedNodes = [];
	var found = false;
	function loop() {
		//perform surgery on each node
		if (cursor >= len) {
			self.env.logDebug("DataProvider.__repairAffectedLabelNodes-1 "+cursor+" "+len);
			//now, save the repaired nodes
			var cursor2 = 0;
			var len3 = repairedNodes.length;
			if (len3 == 0) {
				return callback(error);
			}
			function loop2() {
				//grab a proxy from the list and save it
				self.env.logDebug("DataProvider.__repairAffectedLabelNodes-2 "+cursor2+" "+len3);
				if (cursor2 >= len3) {
					return callback(error);
				}
				prox = repairedNodes[cursor2++];
				prox.setLastEditDate(new Date());
			//	self.env.logDebug("DataProvider.__repairAffectedLabelNodes-3 "+prox.getLocator());
				self.putNode(prox,function(err,data) {
					if (err) {error+=err;}
					loop2();
				});
			}
			loop2();
		} else {
			lox = nodeLocatorList[cursor++];
			self.env.logDebug("DataProvider.__repairAffectedLabelNodes-4 "+cursor+" "+len+" "+lox);
			//get the node, then process it
			self.getNodeByLocator(lox,credentials, function(err,ndx) {
				if (err) {error+=err;}
				var n = ndx;
				self.env.logDebug("DataProvider.__repairAffectedLabelNodes-4a "+err+" | "+n+" | "+lox);
			//self.env.logDebug("DataProvider.__repairAffectedLabelNodes-4b "+err+" | "+n.getLocator());
			//	self.env.logDebug("DataProvider.__repairAffectedLabelNodes-4c "+err+" | "+n.toJSON());
				var found = false;
				//first, get the pivots
				theList = n.listPivotsByRelationType(); // get all of them
				if (!theList) {theList = [];}
				//the relations
				relns = n.__listAllRelations();
				if (relns && relns.length > 0) {
					len2 = relns.length;
					for (i=0;i<len;i++) {
						theList.push(relns[i]);
					}
				}
		//		self.env.logDebug("DataProvider.__repairAffectedLabelNodes-5 "+JSON.stringify(theList));
				if (theList) {
					len2 = theList.length;
					for (var i=0;i<len2;i++) {
						struct = theList[i]; //relnstruct.js
						if (struct.label === oldLabel) {
		//					self.env.logDebug("DataProvider.__repairAffectedLabelNodes-6 "+JSON.stringify(struct));
							//do the surgery and remember 
							struct.label = newLabel;
							found = true;
						}
					}
				} 
				if (found) {
					repairedNodes.push(n);
				}
				loop();
			});
		}
	}
	loop();
};
//////////////////////////////////////////////////////////
// On updating a node's label or subject line.
//  TQTopicMap uses a "compile-time" behavior of pre-compiling structures
//  into lists for child nodes and for all relation nodes.
//  For Relation nodes (tuples and Pivots), the fix is easy:
//		Accumulate a list of tuples and pivots
//      For each of those
//         Fetch the node
//         Perform surgery on it by changing the label/subject text
//         Save that
//  For Conversations, the situation is different
//   Each proxy lists its children and its parents.
//      list all parent structs + child structs
//      For each of those
//        Perform surgery on it by changing the label/subject on the affected child reference
//        Save that
///////////////////////////////////////////////////////////
/**
 * Update <code>proxy<code> which had its label or subject changed. This entails
 * patching every node that references <code>proxy</code> using its label or subject
 * @param proxy
 * @param oldLabel
 * @param newLabel
 * @param credentials
 * @callback signature (err,data)
 */
DataProvider.prototype.updateNodeLabel = function(proxy, oldLabel, newLabel, credentials, callback) {
	var self = this;
	var error = "";
	//a list to aggregate affected nodes
	var affectedNodes= [];
	var struct;
	var len = 0, i;
	var theList = proxy.listParentNodes(); // all of them
	if (!theList) {theList=[];}
	var kids = proxy.listChildNodes(); // all of them
//	self.env.logDebug("DataProvider.updateNodeLabel kids "+proxy.getLocator()+" | "+kids);
	if (kids && kids.length > 0) {
		len = kids.length;
		for (i=0;i<len;i++) {
			theList.push(kids[i]);
		}
	}
	if (theList.length > 0) {
		len = theList.length;
		for (i=0;i<len;i++) {
			struct = theList[i]; //childstruct.js
			affectedNodes.push(struct.locator);
		}
	}
	__repairAffectedLabelTreeNodes(self, affectedNodes, oldLabel, newLabel, credentials, function(err) {
		if (err) {error+=err;}
		affectedNodes = [];
		//pivots
		var pivots = proxy.listPivotsByRelationType(); // get all of them
		if (pivots.length > 0) {
			len = pivots.length;
			for (i=0;i<len;i++) {
				theList.push(pivots[i]);
			}
		}
		//tuples
		var relns = proxy.__listAllRelations();
		if (relns.length > 0) {
			len = relns.length;
			for (i=0;i<len;i++) {
				theList.push(relns[i]);
			}
		}
		console.log("DataProvider.updateNodeLabel "+theList);
		if (theList.length > 0) {
			len = theList.length;
			for (i=0;i<len;i++) {
				struct = theList[i]; //relnstruct.js
				affectedNodes.push(struct.locator);
			}
			__repairAffectedLabelNodes(self, affectedNodes, oldLabel, newLabel, credentials, function(err) {
				if (err) {error+=err;}
				self.putNode(proxy, function(err,data) {
					if (err) {error+=err;}
					return callback(error,data);
				});
			});
		} else {
			//now, save it
			self.putNode(proxy, function(err,data) {
				if (err) {error+=err;}
				return callback(error,data);
			});
		}		
	})
};

/**
 * A dangerous putNode: gives instant index refreshing. Use only during bootstrapping.
 * Actually, never used
 */
DataProvider.prototype.putNodeImmediate = function putNode(proxy,callback) {
	console.log("DataProvider.putNodeImmediate "+proxy.toJSON());
	var _jopts = {};
	_jopts._index = constants.TOPIC_INDEX;
	_jopts._type = constants.CORE_TYPE;
	_jopts.refresh = true;
	var self = this;
	this.ESClient.index(_jopts,proxy.toJSON(),function(err,data) {
		//tell the world we have a new proxy
		//used by any merge agents or other listeners
		if (!err) {
			self.emit('newproxy', proxy);
		} else {
			self.env.logError("DP.putNode "+proxy+" "+err);
		}
		
		return callback(err,data);
	});
};

DataProvider.prototype.nodeExists = function(locator,callback) {
	var _jopts = {};
	_jopts._index = constants.TOPIC_INDEX;
	_jopts._type = constants.CORE_TYPE;
	this.ESClient.existsDocument(_jopts, locator, function(err,data) {
		console.log("DataProvider.nodeExists "+locator+" "+err+" "+data);
		var result = false;
		if (data) {
			console.log(JSON.stringify(data));
			result = data.exists;
		}
		return callback(err, result);
	});
};
////////////////////////////////
//These serve to populate the <code>treeNode</code> passed in, recursively
////////////////////////////////

/**
 * This takes a list of child nodes
 * For each, it builds a fully populated node and adds to the children list.
 * This is recursive, meaning it recurses down branches of a tree
 */
var __childLoop = function(self,childnodes, children, len, cursor, loopStopper,
		rootNodeLocator, maxDepth, start,count,credentials, callback) {
	self.env.logDebug("DataProvider.__childLoop "+len+" | "+cursor+" | "+JSON.stringify(childnodes));
	var error = '';
	function loop() {
		if (cursor >= len) {
			return callback(error);
		} else {
			var kid = childnodes[cursor++];
				var where = loopStopper.indexOf(kid.locator);
				self.env.logDebug("DataProvider.__childLoop-1 "+where+" "+JSON.stringify(kid));
				if (where === -1) {
					loopStopper.push(kid.locator);
					__fillTreeChildren(self,loopStopper, rootNodeLocator, kid.locator,
							maxDepth,start,count,credentials, function(err,snapper) {
						self.env.logDebug("DataProvider.__childLoop-2 "+snapper);
						if (err) {error+=err;}
						if (snapper) {
							self.env.logDebug("DataProvider.__childLoop-3 "+JSON.stringify(snapper));
							children.push(snapper);
						}
						loop();
					});
				} else {
					self.env.logDebug("DataProvider.__childLoop-4 "+JSON.stringify(children)+" "+cursor+" "+len);
					loop();
				}
		} //else
	} //loop
	loop(); // kickstart it
};

/**
 * This is supposed to return a single treenode which has been populated.
 */
var __fillTreeChildren = function(self, loopStopper,rootNodeLocator, locator, maxDepth, start, count, credentials, callback) {
	self.getNodeByLocator(locator, credentials, function(err,node) {
		self.env.logDebug("DataProvider.__fillTreeChildren "+locator+" | "+node);
		var error = "";
		var loopStopper = [];
		if (err) {error+=err;}
		var lox = node.getLocator();
		loopStopper.push(lox);
		var label = node.getLabel(constants.ENGLISH);
		if (!label) {
			label = node.getSubject(constants.ENGLISH).theText;
		}
		var image = node.getSmallImage();
		var typ = node.getNodeType();
		var theTreeNode = new treenode(lox,label, image, typ);
		var subs;
		var instances;
		//first list child nodes
		var childnodes = node.listChildNodes(rootNodeLocator);
		self.env.logDebug("DataProvider.__fillTreeChildren-2 "+locator+" | "+childnodes);
		if (childnodes) {
			var len = childnodes.length;
			if (len > 0) {
				self.env.logDebug("DataProvider.__fillTreeChildren-3 "+locator+" | "+len);
				var cursor = 0;
				var children = [];
				theTreeNode.children = children;
				__childLoop(self, childnodes, children,len,  cursor,loopStopper,rootNodeLocator, maxDepth, start,count,credentials, function(err) {
					if (err) {error+=err;}
	
					return callback(error, theTreeNode);
				}) ;
			} else {
				return callback(error, theTreeNode);
			}
			
		} else {
			return callback(error, theTreeNode);
		}
	});
};
var __fillTreeSubs = function(loopStopper,rootNodeLocator, locator, maxDepth, start, count, credentials, callback) {
	var theTree;
};
var __fillTreeInstances = function(loopStopper,rootNodeLocator, locator, maxDepth, start, count, credentials, callback) {
	var theTree;
};

/**
 * Get  a populated{@link treenodestruct} starting from <code>rootNodeLocator</code>
 * with all its child nodes (<em>subs</em> and <em>instances</em>)
 * to a depth defined by <code>maxDepth</code>
 * @param rootNodeLocator
 * @param maxDepth  -1 means no limit
 * @param start TODO
 * @param count TODO
 * @param credentials
 * @param callback  signature (err,node)
 */
DataProvider.prototype.getTree = function(rootNodeLocator, maxDepth, start, count, credentials, callback) {
	//TODO This must fetch children if no subs or instances
	//when painting a conversation tree, only show tree in context of that root node
	//First, fetch the root
	var self = this;
	this.getNodeByLocator(rootNodeLocator, credentials, function(err,node) {
		self.env.logDebug("DataProvider.getTree "+rootNodeLocator+" | "+err+" | "+node);
		var error = "";
		var loopStopper = [];
		if (err) {error+=err;}
		var lox = node.getLocator();
		loopStopper.push(lox);
		var label = node.getLabel(constants.ENGLISH);
		if (!label) {
			label = node.getSubject(constants.ENGLISH).theText;
		}
		var image = node.getSmallImage();
		var typ = node.getNodeType();
		var theTreeNode = new treenode(lox,label, image, typ);
		var subs;
		var instances;
		//first list child nodes
		var childnodes = node.listChildNodes(rootNodeLocator);
		self.env.logDebug("DataProvider.getTree-1 "+rootNodeLocator+" | "+childnodes);
		if (childnodes) {
			var len = childnodes.length;
			var cursor = 0;
			var children = [];
			//Childloop needs to have a callback in it to prevent this from exiting
			self.env.logDebug("DataProvider.getTree-2 "+rootNodeLocator+" | "+len);
			__childLoop(self,childnodes, children,len,  cursor,loopStopper,rootNodeLocator, maxDepth, start,count,credentials, function(err){
				self.env.logDebug("DataProvider.getTree-3 "+rootNodeLocator+" | "+JSON.stringify(children));
				theTreeNode.children = children;
				if (err) {error+=err;}
				return callback(error, theTreeNode); 
			}) ;
		} else {
			return callback(error, theTreeNode);
		}
		//next, list subs
		//self.listSubclassNodes(rootNodeLocator,start,count,credentials,function(err,subs) {
			
		//});
		
	});
};
/**
 * Fetch the proxy identified by <code>locator</code>
 * @param locator: String
 * @param credentials: list of credentials, possibly empty or <code>null</code>
 * @param callback: signature (err,data): data: SubjectProxy can return <code>undefined</code>
 */
DataProvider.prototype.getNodeByLocator = function (locator,credentials,callback) {
	console.log('DataProvider.getNodeByLocator '+locator+" "+credentials);
	if (!locator) {
		var empty;
		return callback("DataProvider.getNodeByLocator missing locator", empty);
	}
	var self = this;
	var _jopts = {};
	_jopts._index = constants.TOPIC_INDEX;
	_jopts._type = constants.CORE_TYPE;
	//this.env.logDebug("DataProvider.getData "+locator);
	var dx = self.cache.get(locator);
    console.log("DP-A "+dx);
    if (dx) {
        console.log("DP-B "+dx.toJSON());
        _checkCredentials(self, dx.getProperties(), credentials, function(err) {
            console.log("DP-1 "+err);
			if (!err) {
				return callback(err,dx);
			} else {
				self.env.logError("DP.getNodeByLocator-1 "+locator+" "+err);
				return callback(err,dx);
			}
		});
	} else {
		this.ESClient.getDocument(_jopts, locator, function(err, data) {
			console.log('DataProvider.getNodeByLocator-2 '+locator+" "+data);

			var error = '';
			if (err) {
				error+=err;
				self.env.logError("DataProvider.getNodeByLocator-3 "+locator+" "+error);
			}
			if (data) {
				var jp = data._source;
				self.env.logDebug("DataProvider.getNodeByLocator-4 "+JSON.stringify(jp));
 				_checkCredentials(self, jp, credentials, function(err) {
					console.log("DP-2 "+err);
					if (!err) {
						dx = new SubjectProxy(jp);
						self.env.logDebug("DataProvider.getNodeByLocator-5 "+error+" | "+locator+" | "+dx.toJSON());
						self.cache.set(locator,dx);
					} else {
						error+=err;
						self.env.logError("DP.getNodeByLocator-6 "+locator+" "+error);
					}
					return callback(error,dx);
				});
			} else {
				 return callback(error,dx);
			} 
		});
	}
};

/**
 * This can return undefined result if no credentials
 */
var __getNodeByQuery = function(ESClient, query,credentials,callback) {
	console.log('DataProvider.__getNodeByQuery '+JSON.stringify(query));
	var _jopts = {};
	_jopts._index = constants.TOPIC_INDEX;
	_jopts._type = constants.CORE_TYPE;
    var self = this;

	ESClient.search(_jopts, query,function(err,data) {
		console.log("DataProvider.__getNodeByQuery-A "+err);
		var dx = null; //defaults to null
		var ex = err;
		if (data) {
			console.log('XXXXX '+JSON.stringify(data));
			var hits = data.hits;
			//var maxScore = hits.max_score;
			var hits = data.hits.hits;
			var count = hits.length;
			console.log('DataProvider.getNode-2 '+count);
			if (count > 0) {
              var jp = hits[0]._source;
              console.log('DataProvider.getNode-3 '+JSON.stringify(jp));
              //was this node found?
              if (jp) {
				console.log('DataProvider.getNode-4 '+JSON.stringify(jp));
				//check credentials
				_checkCredentials(self, jp, credentials, function(err) {
					if (!err) {
						dx = new SubjectProxy(jp);
					} else {
						ex = err;
					}
				});
              }
			}
		}
		//ok to return undefined
		console.log('DataProvider.getNode+X '+dx);
		return callback(ex,dx);
	});
};

/**
 * This can return undefined data depending on credentials
 */
DataProvider.prototype.getNodeByURL = function(url, credentials, callback) {
	var query = this.queryDSL.findNodeByURL(url);
	var self = this;
	__getNodeByQuery(this.ESClient, query,credentials, function(err,data) {
		console.log("DataProvider.getNodeByURL "+err+" "+data);
		//TODO: this might return a list of hits if there are more than one proxy
		// with the url field set to this url;
		//That would only happen if some app writes code that doesn't check first
		if (err) {self.env.logError("DP.getNodeByURL "+url+" "+err);}
		return callback(err,data);
	});
};

///////////////////////////
//Internal utilities
///////////////////////////
/**
* @param hit
* @return  proxy or undefined
*/
var __hitToProxy = function(self, hit, credentials) {
	console.log("DP_hit2Proxy "+JSON.stringify(hit));
	var result;
	if (hit) {
		var js = hit._source;
		_checkCredentials(self, js, credentials, function(err) {
			if (!err) {
				result = new SubjectProxy(js);
				console.log("DP_hit2Proxy+ "+result.toJSON());
			}
		});
	}
	return result;
};

/**
 * @param self
 * @param client
 * @param query
 * @param start
 * @param count
 * @param callback signature (err, data, available) can return empty []
 */
var __listNodesByQuery = function(self,  query, start, count, credentials, callback) {
    // deal with start/count
	var mycount = count;
	if (mycount > -1) {
		if (query.size) {
			//already dealt with start/count
			mycount  = -1;
		}
	}
    self.env.logDebug("DataProvider.__listNodesByQuery "+JSON.stringify(query));
	var _jopts = {};
	_jopts._index = constants.TOPIC_INDEX;
	_jopts._type = constants.CORE_TYPE;

  self.ESClient.search(_jopts, query,function(err,data) {
    console.log("DataProvider.__listNodesByQuery "+err+" "+data);
    var hits;
    var result = [];
    var len = 0;
    var cardinality=0;
    if (data) {
        console.log("DataProvider.__listNodesByQuery-1 "+JSON.stringify(data));
      var filteredHits= [];
      hits = data.hits.hits;
      console.log("DataProvider.__listNodesByQuery-X "+JSON.stringify(hits));
      len = hits.length;
      cardinality = data.hits.total;
      if (mycount > -1) {
        var lx = len - start;
        if (lx > 0) {
          //lx is number available
          if (lx > count) { len = count;}
          else { len = lx;}
          for (var i=start;i<len;i++) {
            filteredHits.push(hits[i]);
          }
          //len = filteredHits.length;
          //not sure if that's needed
        } else {
          len = 0;
        }
      } else {
        filteredHits = hits;
      }
      console.log("DataProvider.__listNodesByQuery-Y "+JSON.stringify(filteredHits));
     
     // console.log("DataProvider.__listNodesByQuery-2 "+JSON.stringify(query)+" "+len);
      if (len > 0) {
          var p;
        for (var j=0;j<len;j++) {
            p = __hitToProxy(self, filteredHits[j], credentials);
            if (p) {
                result.push(p);
            }
        }
      }
    }
	if (err) {
		self.env.logError("DP.__listNodesByQuery "+JSON.stringify(query)+" | "+err);
	}
    return callback(err,result, cardinality);
  });
};
/**
 * 
 * @param label
 * @param language
 * @param start
 * @param count
 * @param credentials
 * @param callback signature (err,data,cardinality)
 */
DataProvider.prototype.listNodesByLabel = function(label, language, start, count, credentials, callback) {
	var key = langutils.makeLanguageLabel(language);
	var query = this.queryDSL.listByText(key,null, null, null, label,start,count);
	__listNodesByQuery(this, query, start,count, credentials, function(err,dx,card) {
		return callback(err,dx,card);
	});
};

/**
 * 
 * @param queryString
 * @param language
 * @param start
 * @param count
 * @param credentials
 * @param callback signature (err,data,cardinality)
 */
DataProvider.prototype.listNodesByTextSearch = function(queryString,language,start,count,credentials,callback) {
	var labelkey = langutils.makeLanguageLabel(language);
	var detailskey = langutils.makeLanguageDetails(language);
	var subjkey = langutils.makeLanguageSubject(language)+".theText";
	var bodykey = langutils.makeLanguageBody(language)+".theText";
	var query = this.queryDSL.listByText(labelkey,detailskey, subjkey,bodykey,queryString,start,count);
	__listNodesByQuery(this, query, start,count, credentials, function(err,dx,card) {
		return callback(err,dx,card);
	});
};

DataProvider.prototype.listNodesByLabelAndType = function(label,typeLocator,language,start,count,credentials,callback) {
	//TODO
};

DataProvider.prototype.listNodesByDetailsLike = function(detailsFragment, language, start, count, credentials,callback) {
	//TODO
};

/**
 * 
 * @param query
 * @param start
 * @param count
 * @param credentials
 * @param callback signature (err,data,cardinality)
 */
DataProvider.prototype.listNodesByQuery = function(query, start, count, credentials,callback) {
	console.log("DataProvider.listNodesByQuery "+JSON.stringify(query));
	__listNodesByQuery(this, query,start,count, credentials, function(err,dx,card) {
		return callback(err,dx,card);
	});
};


/**
 * 
 * @param creatorId
 * @param start
 * @param count
 * @param credentials
 * @param callback signature (err,data,cardinality)
 */
DataProvider.prototype.listNodesByCreatorId = function(creatorId, start, count, credentials, callback) {
	var query = this.queryDSL.listNodesByKey(properties.CREATOR_ID,creatorId, start,count);
	__listNodesByQuery(this, query,start,count,credentials, function(err,dx,card) {
		return callback(err,dx,card);
	});
};

/**
 * 
 * @param typeLocator
 * @param start
 * @param count
 * @param credentials
 * @param callback signature (err,data,cardinality)
 */
DataProvider.prototype.listInstanceNodes = function(typeLocator,start,count,credentials,callback) {
	var query = this.queryDSL.listNodesByType(typeLocator, start,count);
	__listNodesByQuery(this, query,start,count,credentials, function(err,dx,card) {
		return callback(err,dx,card);
	});
};


/**
 * 
 * @param superClassLocator
 * @param start
 * @param count
 * @param credentials
 * @param callback signature (err,data,cardinality)
 */
DataProvider.prototype.listSubclassNodes = function(superClassLocator, start, count, credentials, callback) {
	var query = this.queryDSL.listNodesByKey(properties.SUB_OF,superClassLocator, start,count);
	__listNodesByQuery(this, query,start,count, credentials, function(err,dx,card) {
		return callback(err,dx,card);
	});
};



//TODO
/**
 * See if a <code>node</code> is part of a merge ensemble.
 * If so, return the <em>VirtualProxy</em> which represents that ensemble.
 * Otherwise just return that node.
 * @param node
 * @param credentials
 * @param callback signature(err, virtualnode or undefined)
 */
DataProvider.prototype.getVirtualNodeIfExists = function(node, credentials, callback) {
	var error = "",
		result;
	//TODO
	return callback(error, result);
};

DataProvider.prototype.listAIRVersions = function(locator) {
	//TODO
};

/**
 * Simply return a big ugly UUID
 * @return
 */
DataProvider.prototype.uuid = function() {
	return uuid.v1();
};

/////////////////////////////////////////////////////////////
//Removing a node is messy.
// First, a node as pivots and other relations
// Second, a node might have parents or children
// Third, a node might be transcluded to some place, in which case, it cannot be removed,
//   but rather, the transclusion links are removed
// Fourth, a node might be transcluded elsewhere, in which case, those transclusions need to be muted
//   as well. Typical transclusions are in terms of parent-child relations
// Fifth, a node might be a member of a merged ensemble; its values must be
//   excised from the virtual node to which it is merged, and its merge relation removed
//   Which brings us to another issue: if it is unmerged, we need to leave it alone and
//    visible, and add an unmerge with reason link.
//   We should never get here from an unmerge
//////////////////////////////////////////////////////////////
/**
 * Remove a node and surgically modify any of its related or parent or child nodes
 * @param locator
 * @param credentials
 * @param callback signature (err);
 */
DataProvider.prototype.removeNode = function(locator, credentials, callback) {
	var error = "",
		myNode,
		self = this;
	this.getNodeByLocator(locator, credentials, function(err, nx) {
		if (err) {error += err;}
		//now finish the job
		this.removeNode(nx, credentials, function(err) {
			if (err) {error += err;}
			return callback(error);
		})		
	});
};

DataProvider.prototype.removeNode = function(node, credentials, callback) {
	var error = "";
	//first, kill this node
	node.setIsLive(false);
	this.putNode(node function(err, data) {
		if (err) {error += err;}
		//now deal with its network
		//TODO
		return callback(error);
	});
};
