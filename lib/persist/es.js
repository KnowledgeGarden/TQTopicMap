/**
 * ESClient
 * @see https://github.com/ncb000gt/node-es
 * @see https://github.com/ncb000gt/node-es/blob/master/test/functional/core.js
 *  to see how to configure field types
 */
var elasticsearch = require('es')
  , constants	= require('../constants')
  , StringBuilder = require('../util/stringbuilder');

var config = {
  // filled in later
  _indices : [],
  // filled in later
  _types : [],
  server : {
    host : 'localhost',
    port : 9200
  }
};

/**
 * Initialize the topics index mappings
 * @param client
 */
function _initMappings() {
	var buf = new StringBuilder();
	buf.append("{\"properties\": {");
	buf.append("\"locator\": {");
	buf.append("\"index\": \"not_analyzed\",");
	buf.append("\"type\": \"string\",");
	buf.append("\"store\": \"yes\"");
	buf.append("},\"instanceOf\": {");
	buf.append("\"index\": \"not_analyzed\",");
	buf.append("\"type\": \"string\",");
	buf.append("\"store\": \"yes\"");
	buf.append("},\"_version\": {");
	buf.append("\"index\": \"not_analyzed\",");
	buf.append("\"type\": \"string\",");
	buf.append("\"store\": \"yes\"");
	buf.append("},\"lists\": {");
	buf.append("\"properties\": {");
	buf.append("\"subOf\": {");
	buf.append("\"index\": \"not_analyzed\",");
	buf.append("\"type\": \"string\",");
	buf.append("\"store\": \"yes\"");
	//note: this is the english-only label
	//TODO add other languages
	buf.append("}, \"label\": {");
	buf.append("\"index\": \"not_analyzed\",");
	buf.append("\"type\": \"string\",");
	buf.append("\"store\": \"yes\"");
	//note: this is the english-only details
	//TODO add other languages
	buf.append("}, \"details\": {");
	buf.append("\"index\": \"not_analyzed\",");
	buf.append("\"type\": \"string\",");
	buf.append("\"store\": \"yes\"}}}}}");
//	console.log("ES.mappings: "+buf.toString());
	return JSON.parse(buf.toString());
};

/**
 * <p>ESClient class</p>
 * <p>ElasticSearch can take a long time to boot, so we
 * are forced to wait for its <code>callback</p>.</p>
 * @param callback: signature: (err)
 */
var ESClient = module.exports = function(callback) {
  config._indices.push(constants.TOPIC_INDEX);
  config._types.push(constants.CORE_TYPE);
  var data = {};
  data.mappings = _initMappings();
  //make the client
  this.client = elasticsearch.createClient(config);
  //initialize the indices
  this.client.indices.createIndex(config,data,function(err) {
      var ex;
      console.log('ESClient-2 '+err);
      //we are ignoring this error since there appears to be no convenient
      //way to check if the index exists: if it does, the error will be tossed
      //Error: {"error":"IndexAlreadyExistsException[[topics] already exists]","status":400}
      callback(ex);
    });
};

///////////////////////////////////////
// Core API
// Just the basics
//   Can add a few others
///////////////////////////////////////

/**
 * Index a proxy
 * @param jopts
 * @param doc
 */
ESClient.prototype.index = function(jopts,doc, callback) {
	this.client.index(jopts,doc,callback);
};

/**
 * Fetch an object, which, if available, is found in the <code>_source</code>
 * field of the JSON object <code>data</code>
 * @param jopts
 * @param callback: signature (err,data)
 */
//dropped in favor of using search
//ESClient.prototype.get = function(jopts,callback) {
//	this.client.get(jopts,callback);
//};

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

///////////////////////////////////////
// Diagnostic
///////////////////////////////////////
ESClient.prototype.hello = function() {
	console.log('ESClient hello '+this.client);
};