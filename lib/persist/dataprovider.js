/**
 * DataProvider
 * 
 */
var SubjectProxy = require('../models/subjectproxy')
	, EventEmitter = require('events').EventEmitter
	, util = require('util')
	, uuid = require('node-uuid')
	, qdsl = require('../util/querydsl')
    , langutils = require('../util/propertylanguageutils')
	, properties = require('../properties')
	, constants = require('../constants');

var DataProvider = module.exports = function(environment, db) {
	this.env = environment;
	this.ESClient = db;
//	uuid1 = uuid.v1();
	this.queryDSL = new qdsl();
	console.log('DataProvider '+this.ESClient);
};

util.inherits(DataProvider, EventEmitter);

/**
 * Cannot use proxy <code>json</code> if it is <em>private</em> and not
 * available to <code>credentials</code> supplied
 * @param json
 * @param credentials, theoretically an array of values to compare
 * @param callback: signature (err)
 */
function _checkCredentials(json, credentials, callback) {
	//TODO massive work to do here
	//for now just return the proxy
	var err;
	callback(err);
}

/**
 * Index this <code>proxy</code>
 * @param proxy
 * @param callback: signature (err,data) 
 */
DataProvider.prototype.putNode = function putNode(proxy,callback) {
	console.log("DataProvider.putNode "+proxy.toJSON());
	var _jopts = {};
	_jopts._index = constants.TOPIC_INDEX;
	_jopts._type = constants.CORE_TYPE;
	_jopts._id = proxy.getLocator();
	var self = this;
	this.ESClient.index(_jopts,proxy.toJSON(),function(err,data) {
		//tell the world we have a new proxy
		//used by any merge agents or other listeners
		if (!err) {
			self.emit('newproxy', proxy);
		} else {
			this.env.logError("DP.putNode "+proxy+" "+err);
		}
		
		callback(err,data);
	});
};

/**
 * A dangerous putNode: gives instant index refreshing. Use only during bootstrapping.
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
			this.env.logError("DP.putNode "+proxy+" "+err);
		}
		
		callback(err,data);
	});
};

DataProvider.prototype.nodeExists = function(locator,callback) {
	this.ESClient.existsDocument(locator, function(err,data) {
		console.log("DataProvider.nodeExists "+locator+" "+err+" "+data);
		if (data) {console.log(JSON.stringify(data));}
		callback(err,data.exists);
	});
};
/**
 * Fetch the proxy identified by <code>locator</code>
 * @param locator: String
 * @param credentials: list of credentials, possibly empty or <code>null</code>
 * @param callback: signature (err,data): data: SubjectProxy can return <code>null</code>
 */
DataProvider.prototype.getNodeByLocator = function (locator,credentials,callback) {
	console.log('DataProvider.getNodeByLocator '+locator+" "+credentials);
	var self = this;
	this.ESClient.getDocument(locator, function(err,data) {
		var dx = null;
		var error = '';
		if (err) {
			error+=err;
			self.env.logError("DP.getNodeByLocator "+locator+" "+error);
		}
		if (data) {
			var jp = data._source;
			console.log('XXXXX '+JSON.stringify(jp));
			_checkCredentials(jp, credentials, function(err) {
				if (!err) {
					dx = new SubjectProxy(jp);
				} else {
					error+=err;
					self.env.logError("DP.getNodeByLocator "+locator+" "+error);
				}
			});
		}
		callback(error,dx);
	});
};

var __getNodeByQuery = function(ESClient, query,credentials,callback) {
	console.log('DataProvider.__getNodeByQuery '+JSON.stringify(query));
	ESClient.search(query,function(err,data) {
		console.log("DataProvider.__getNodeByQuery-A "+err);
		var dx = null; //defaults to null
		var ex = err;
		if (data) {
			console.log('XXXXX '+JSON.stringify(data));
//XXXXX {"took":1,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0
//		},"hits":{"total":1,"max_score":1,"hits":[{"_index":"topics","_type":"core","_id
//			":"MyTestProxy","_score":1,"_source":{"locator":"MyTestProxy","instanceOf":"Fanc
//			yNode","subOf":["MySuper"]}}]}}
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
				_checkCredentials(jp, credentials, function(err) {
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
		callback(ex,dx);
	});
};


//TODO generalize to a __getNodeByQuery(query,credentials,callback)
DataProvider.prototype.getNodeByURL = function(url, credentials, callback) {
	var query = this.queryDSL.findNodeByURL(url);
	__getNodeByQuery(this.ESClient, query,credentials, function(err,data) {
		console.log("DataProvider.getNodeByURL "+err+" "+data);
		//TODO: this might return a list of hits if there are more than one proxy
		// with the url field set to this url;
		//That would only happen if some app writes code that doesn't check first
		if (err) {this.env.logError("DP.getNodeByURL "+url+" "+err);}
		callback(err,data);
	});
};
///////////////////////////
//Internal utilities
///////////////////////////
/**
* @param hit
* @return  proxy or undefined
*/
var __hitToProxy = function(hit, credentials) {
	console.log("DP_hit2Proxy "+JSON.stringify(hit));
	var result;
	if (hit) {
		var js = hit._source;
		_checkCredentials(js, credentials, function(err) {
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
  //TODO deal with start/count
    self.env.logDebug("DataProvider.__listNodesByQuery "+JSON.stringify(query));
  self.ESClient.search(query,function(err,data) {
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
      cardinality = hits.length;
      if (count > -1) {
        var lx = len - start;
        if (lx > 0) {
          //lx is number available
          if (lx > count) { len = count;}
          else { len = lx;}
          for (var i=start;i<len;i++) {
            filteredHits.push(hits[i]);
          }
        } else {
          len = 0;
        }
      } else {
        filteredHits = hits;
      }
      console.log("DataProvider.__listNodesByQuery-Y "+JSON.stringify(filteredHits));
     
     // console.log("DataProvider.__listNodesByQuery-2 "+JSON.stringify(query)+" "+len);
      if (len > 0) {
        for (var j=0;j<len;j++) {
          result.push(__hitToProxy(filteredHits[j], credentials));
        }
      }
    }
	if (err) {
		self.env.logError("DP.__listNodesByQuery "+JSON.stringify(query)+" | "+err);
	}
    callback(err,result, cardinality);
  });
};

DataProvider.prototype.listNodesByLabel = function(label, language, start, count, credentials, callback) {
	var key = langutils.makeLanguageLabel(language);
	var query = this.queryDSL.listByText(key,null, label,start,count);
	__listNodesByQuery(this, query, start,count, credentials, function(err,dx) {
		callback(err,dx);
	});
};

DataProvider.prototype.listNodesByTextSearch = function(queryString,language,start,count,credentials,callback) {
	var labelkey = langutils.makeLanguageLabel(language);
	var detailskey = langutils.makeLanguageDetails(language);
	var query = this.queryDSL.listByText(labelkey,detailskey, queryString,start,count);
	__listNodesByQuery(this, query, start,count, credentials, function(err,dx) {
		callback(err,dx);
	});
};

DataProvider.prototype.listNodesByLabelAndType = function(label,typeLocator,language,start,count,credentials,callback) {
	//TODO
};

DataProvider.prototype.listNodesByDetailsLike = function(detailsFragment, language, start, count, credentials,callback) {
	//TODO
};

DataProvider.prototype.listNodesByQuery = function(query, start, count, credentials,callback) {
	console.log("DataProvider.listNodesByQuery "+JSON.stringify(query));
	__listNodesByQuery(this, query,start,count, credentials, function(err,dx) {
		callback(err,dx);
	});
};

DataProvider.prototype.listNodesByCreatorId = function(creatorId, start, count, credentials, callback) {
	var query = this.queryDSL.listNodesByKey(properties.CREATOR_ID,creatorId, start,count);
	__listNodesByQuery(this, query,start,count,credentials, function(err,dx) {
		callback(err,dx);
	});
};

DataProvider.prototype.listInstanceNodes = function(typeLocator,start,count,credentials,callback) {
	var query = this.queryDSL.listNodesByType(typeLocator, start,count);
	__listNodesByQuery(this, query,start,count,credentials, function(err,dx) {
		callback(err,dx);
	});
};

DataProvider.prototype.listSubclassNodes = function(superClassLocator, start, count, credentials, callback) {
	var query = this.queryDSL.listNodesByKey(properties.SUB_OF,superClassLocator, start,count);
	__listNodesByQuery(this, query,start,count, credentials, function(err,dx) {
		callback(err,dx);
	});
};





DataProvider.prototype.getVirtualNodeIfExists = function(locator, credentials,callback) {
	//TODO
};
DataProvider.prototype.listAIRVersions = function(locator) {
	//TODO
};


/** replaced by listNodesByQuery
 * Returns a list of proxies based on <code>queryString</code>
 * @param queryString
 * @param credentials
 * @param callback:signature (err,data)
 * /
DataProvider.prototype.search = function(queryString, credentials, callback) {
	var opts = _PREFIX+"}";
	var jopts = JSON.parse(opts);
	this.ESClient.search(jopts,queryString,function(err,data) {
		var result = [];
		var ex = err;
		// results found in hits;
		if (data) {
			//console.log('DataProvider.search '+JSON.stringify(data));
			//"hits":{"total":2,"max_score":1,"hits":[ the proxies...
			var hits = data.hits.hits;
			if (hits) {
			//	console.log('DataProvider.search-1 '+JSON.stringify(hits));
				//[{"_index":"proxies","_type":"core","_id":"MySecondTestProxy","_score":1,"_source":{"locator":"MySecondTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}},
				// {"_index":"proxies","_type":"core","_id":"MyTestProxy","_score":1,"_source":{"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}}]
				var js, p, h;
				var len = hits.length;
				//console.log('XXXX '+len);
				for (var i=0;i<len;i++) {
					h = hits[i];
				//	console.log('DataProvider.search-2 '+JSON.stringify(h));
					js = h._source;
				//	console.log('DataProvider.search-3 '+JSON.stringify(js));
					_checkCredentials(js, credentials, function(err) {
						if (!err) {
							p = new SubjectProxy(js);
				//			console.log('DataProvider.search-4 '+p.toJSON());
							result.push(p);
						} else if (!ex)
							ex = err;
						else
							ex +='|'+err;
					});
				}
			}
		}
		callback(ex,result);
	});
};
*/
DataProvider.prototype.uuid = function() {
	return uuid.v1();
};

