/**
 * DataProvider
 * 
 */
var SubjectProxy = require('../models/subjectproxy')
	, EventEmitter = require('events').EventEmitter
	, util = require('util')
	, uuid = require('node-uuid')
	, qdsl = require('../util/querydsl')
	,constants = require('../constants');

var DataProvider = module.exports = function(environment, db) {
	this.ESClient = db;
	this.uuid1 = uuid.v1();
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
	var opts = _PREFIX+",\"_id\":\""+proxy.getLocator()+"\"}";
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
 * @param callback: signature (err,data): data: SubjectProxy
 */
DataProvider.prototype.getNode = function getNode(locator,credentials,callback) {
	console.log('DataProvider.getNode '+locator);
	var opts = _PREFIX+"}";
	var query = this.queryDSL.findNodeByLocator(locator);
	var q = query; //JSON.stringify(query);
	console.log('FOO '+JSON.stringify(query));
	var jopts = JSON.parse(opts);
	this.ESClient.search(jopts,q,function(err,data) {
		var dx;
		var ex = err;
		if (data) {
			console.log('XXXXX '+JSON.stringify(data));
//XXXXX {"took":1,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0
//		},"hits":{"total":1,"max_score":1,"hits":[{"_index":"topics","_type":"core","_id
//			":"MyTestProxy","_score":1,"_source":{"locator":"MyTestProxy","instanceOf":"Fanc
//			yNode","subOf":["MySuper"]}}]}}
			var count = data.hits.total;
			console.log('DataProvider.getNode-2 '+count);
			if (count !== 0) {
			  var jp = data.hits.hits[0]._source;
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
	//TODO
};

DataProvider.prototype.listNodesByLabelAndType = function(label,typeLocator,language,start,count,credentials,callback) {
	//TODO
};

DataProvider.prototype.listNodesByDetailsLike = function(detailsFragment, language, start, count, credentials,callback) {
	//TODO
};

DataProvider.prototype.listNodesByCreatorId = function(creatorId, start, count, credentials, callback) {
	//TODO
};

DataProvider.prototype.listInstanceNodes = function(typeLocator,start,count,credentials,callback) {
	//TODO
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
	return this.uuid1;
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