/**
 * ESClient
 * @see https://github.com/ncb000gt/node-es
 * @see https://github.com/ncb000gt/node-es/blob/master/test/functional/core.js
 *  to see how to configure field types
 */
var elasticsearch = require('es');
var config = {
  //TODO
  _indices : ['proxies'],
  _types : ['core'],
  server : {
    host : 'localhost',
    port : 9200
  }
};

/**
 * ESClient class
 */
var ESClient = module.exports = function() {
	this.client = elasticsearch(config);
	_initSchema(this.client);
	console.log('ESClient '+this.client);
};

/**
 * Initialize the proxy schema
 * @param client
 */
function _initSchema(client) {
	//TODO
}
ESClient.prototype.index = function(jopts,doc, callback) {
	this.client.index(jopts,doc,callback);
};

/**
 * Fetch an object, which, if available, is found in the <code>_source</code>
 * field of the JSON object <code>data</code>
 * @param jopts
 * @param callback: signature (err,data)
 */
ESClient.prototype.get = function(jopts,callback) {
	this.client.get(jopts,callback);
};

/**
 * Perform a search based on a JSON <code>query</code> string
 * @param jopts
 * @param query
 * @param callback: signature (err,data)
 */
ESClient.prototype.search = function(jopts,query,callback) {
	this.client.search(jopts.query,callback);
};

/**
 * Delete an object identified by <code>_id</code> in <code>jopts</code>
 * @param jopts
 * @param callback: signature (err,data)
 */
//note: Eclipse IDE does not like "delete" but the code runs
ESClient.prototype.remove = function(jopts,callback) {
	this.client.delete(jopts,callback);
};