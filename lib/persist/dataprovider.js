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
	this.ESClient = db;
//	this.uuid1 = uuid.v1();
	this.queryDSL = new qdsl();
	console.log('DataProvider '+this.ESClient);
};

util.inherits(DataProvider, EventEmitter);
var _PREFIX = "{\"_index\":\""+constants.TOPIC_INDEX+"\",\"_type\":\""+constants.CORE_TYPE+"\"";
/**
 * Index this <code>proxy</code>
 * @param proxy
 * @param callback: signature (err,data)
 */
DataProvider.prototype.putNode = function putNode(proxy,callback) {
	console.log("DataProvider.putNode "+proxy.toJSON());
	var opts = _PREFIX+/*",\"_id\":\""+proxy.getLocator()+"\" */"}";
	var jopts = JSON.parse(opts);
	var self = this;
	this.ESClient.index(jopts,proxy.toJSON(),function(err,data) {
		//tell the world we have a new proxy
		//used by any merge agents or other listeners
		if (!err)
			self.emit('newproxy', proxy);
		callback(err,data);
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
	var opts = _PREFIX+"}";
	var query = this.queryDSL.findNodeByLocator(locator);
	var q = query; //JSON.stringify(query);
	console.log('FOO '+JSON.stringify(query));
	var jopts = JSON.parse(opts);
	this.ESClient.search(/*jopts,*/q,function(err,data) {
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
		console.log('DataProvider.getNode+ '+dx);
		callback(ex,dx);
	});
};

/* XXXXX what you get from getNode (it's not working here, but note the return structure)
{"took":2,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0
},"hits":{"total":4,"max_score":1,"hits":[{"_index":"topics","_type":"core","_id
":"YetAnotherProxy","_score":1,"_source":{"locator":"YetAnotherProxy","instanceO
f":"NotSoFancyNode","subOf":["MySuper"],"url":"http://google.com/"}},{"_index":"
topics","_type":"core","_id":"MyTestProxy","_score":1,"_source":{"locator":"MyTe
stProxy","instanceOf":"FancyNode","subOf":["MySuper"]}},{"_index":"topics","_typ
e":"core","_id":"MySecondTestProxy3","_score":1,"_source":{"locator":"MySecondTe
stProxy3","instanceOf":"FancyNode","subOf":["MySuper"]}},{"_index":"topics","_ty
pe":"core","_id":"MyTestProxy3","_score":1,"_source":{"locator":"MyTestProxy3","
instanceOf":"FancyNode","subOf":["MySuper"]}}]}}
 */

DataProvider.prototype.listNodesByLabel = function(label, language, start, count, credentials, callback) {
	var key = langutils.makeLanguageLabel(language);
	var query = this.queryDSL.listNodesByKey(key,label, start,count);
	__listNodesByQuery(this.ESClient, query, start,count, function(err,dx) {
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
	__listNodesByQuery(this.ESClient, query,start,count,function(err,dx) {
		callback(err,dx);
	});
};

DataProvider.prototype.listNodesByCreatorId = function(creatorId, start, count, credentials, callback) {
	var query = this.queryDSL.listNodesByKey(properties.CREATOR_ID,creatorId, start,count);
	__listNodesByQuery(this.ESClient, query,start,count,function(err,dx) {
		callback(err,dx);
	});
};

DataProvider.prototype.listInstanceNodes = function(typeLocator,start,count,credentials,callback) {
	var query = this.queryDSL.listNodesByType(typeLocator, start,count);
	__listNodesByQuery(this.ESClient, query,start,count,function(err,dx) {
		callback(err,dx);
	});
};

DataProvider.prototype.listSubclassNodes = function(superClassLocator, start, count, credentials, callback) {
	var query = this.queryDSL.listNodesByKey(properties.SUB_OF,superClassLocator, start,count);
	__listNodesByQuery(this.ESClient, query,start,count, function(err,dx) {
		callback(err,dx);
	});
};
///////////////////////////
// Internal utilities
///////////////////////////
/**
 * @param hits
 * @return [] can be empty
 */
var __hitsToProxyList = function(hits) {
//	console.log("DP_hits2ProxyList "+len);
	console.log("DP_hits2ProxyList "+hits);
	var result = [];
	if (hits) {
      var len = hits.length;
      var p;
      for (var i=0;i<len;i++) {
//		console.log("DP_hits2ProxyList "+JSON.stringify(hits[i]));
		p = new SubjectProxy(hits[i]._source);
		result.push(p);
      }
	}
	return result;
};

/**
 * @param client
 * @param query
 * @param start
 * @param count
 * @param callback signature (err, data) can return empty []
 */
var __listNodesByQuery = function(client,  query, start, count,callback) {
  //TODO deal with start/count
  client.search(query,function(err,data) {
    console.log("DataProvider.__listNodesByQuery "+err+" "+data);
    var hits;
    var result = [];
    if (data) {
      hits = data.hits.hits;
      var len = hits.length;
      console.log("DataProvider.__listNodesByQuery-1 "+JSON.stringify(query)+" "+len);
      if (len > 0) {
        result = __hitsToProxyList(hits);
      }
    }
    callback(err,result);
  });
};



DataProvider.prototype.getVirtualNodeIfExists = function(locator, credentials,callback) {
	//TODO
};
DataProvider.prototype.listAIRVersions = function(locator) {
	//TODO
};


/**
 * Returns a list of proxies based on <code>queryString</code>
 * @param queryString
 * @param credentials
 * @param callback:signature (err,data)
 */
DataProvider.prototype.search = function search(queryString, credentials, callback) {
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

DataProvider.prototype.uuid = function() {
	return uuid.v1();;
};

/**
 * Cannot use proxy <code>json</code> if it is <em>private</em> and not
 * available to <code>credentials</code> supplied
 * @param json
 * @param credentials
 * @param callback: signature (err)
 */
function _checkCredentials(json, credentials, callback) {
	//TODO massive work to do here
	//for now just return the proxy
	var err;
	callback(err);
};