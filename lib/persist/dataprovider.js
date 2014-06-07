/**
 * DataProvider
 * 
 */
var SubjectProxy = require('../models/subjectproxy'),
	EventEmitter = require('events').EventEmitter,
	util = require('util'),
	uuid = require('node-uuid');

var DataProvider = module.exports = function(environment) {
	this.database = environment.getDatabase();
	this.uuid1 = uuid.v1();
	console.log('DataProvider '+this.database);
};

util.inherits(DataProvider, EventEmitter);
/**
 * Index this <code>proxy</code>
 * @param proxy
 * @param callback: signature (err,data)
 */
DataProvider.prototype.putNode = function putNode(proxy,callback) {
	var opts = "{\"_index\":\"proxies\",\"_type\":\"core\", \"_id\":\""+proxy.getLocator()+"\"}";
	var jopts = JSON.parse(opts);
	var self = this;
	this.database.index(jopts,proxy.toJSON(),function(err,data) {
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
	var opts = "{\"_index\":\"proxies\",\"_type\":\"core\", \"_id\":\""+locator+"\"}";
	var jopts = JSON.parse(opts);
	this.database.get(jopts,function(err,data) {
		var dx = null;
		var ex = err;
		if (data) {
			var jp = data._source;
			//was this node found?
			if (jp) {
				console.log('DataProvider.getNode '+JSON.stringify(jp));
				//check credentials
				_checkCredentials(jp, credentials, function(err) {
					if (!err)
						dx = new SubjectProxy(jp);
					else
						ex = err;
				});
			}
			
		}
		console.log('DataProvider.getNode-1 '+dx);
		callback(ex,dx);
	});
};

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
	var opts = "{\"_index\":\"proxies\",\"_type\":\"core\"}";
	var jopts = JSON.parse(opts);
	this.database.search(jopts,queryString,function(err,data) {
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