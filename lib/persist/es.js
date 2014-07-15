/**
 * ESClient
 * @see https://github.com/ncb000gt/node-es
 * @see https://github.com/ncb000gt/node-es/blob/master/test/functional/core.js
 *  to see how to configure field types
 *  <p>ESClient is now an instance of an EventEmitter. This means that it
 *   will emit an 'onReady' event.</p>
 *   <p>To use that event, one captures an instance of ESClient from TopicMapEnvironment,
 *   for instance:
 *   <pre>
 *   var begin = function() {
 *     ...program code goes here
 *     This, quite literally, is where an apps code goes.
 *     It's here because we cannot start building the app
 *     until we have a live ElasticSearch database
 *   };
 *   var TopicMapEnvironment = new env();
 *   var ESClient = TopicMapEnvironment.getDatabase();
 *   ESClient.on('onReady', begin);
 *   </pre></p>
 */
var elasticsearch = require('es')
  , constants	= require('../constants')
  , util = require('util');

var config = {
  // filled in later
  _indices : [],
  // filled in later
  _types : [],
  refresh : true,
  //TODO we will get these from a config object to be added 
  server : {
   // host : 'localhost',
   // port : 9200
  }
};

/**
 * <p>ESClient class</p>
 * <p>ElasticSearch can take a long time to boot, so we
 * are forced to wait for its <code>callback</p>.</p>
 * @param environment
 * @param mappings: a JSON object of field mappings
 * @param configMappings: a JSON object of configuration settings
 * @param callback; signature = (err,client)
 */
var ESClient = module.exports = function(environment, mappings, configProperties, callback) {
	this.env= environment;
  var clusters = configProperties.clusters;
  var len = clusters.length;
  var sip;
  config._indices.push(constants.TOPIC_INDEX);
  config._types.push(constants.CORE_TYPE);
  if (len > 1) {
    //code not tested yet
    var h = [];
    for (var i=0;i<len;i++) {
      sip = clusters[i];
      h.push(sip.host+":"+sip.port);
    }
    config.server.hosts = h;
  } else {
    sip = clusters[0];
    config.server.host = sip.host;
    config.server.port = sip.port;
  }
  var data = {};
  data.mappings = mappings;
  //make the client
  console.log("ESClient-- "+JSON.stringify(config));
  //ESClient-- {"_indices":["topics"],"_types":["core"],"refresh":true,"server":
  //{"host":"localhost","port":"9200"}}
  this.client = elasticsearch.createClient(config);
  console.log('ESClient- '+mappings+" "+this.client);
  //initialize the indices
  
  var self = this;
  self.client.indices.exists(config, function(err, data) {
    console.log("ESClient exists "+err+" "+data);
    if (data) {
      console.log(JSON.stringify(data));
    }
    //{"exists":false,"statusCode":404}
    //{"statusCode":200,"exists":true}
    if (data.exists === false) {
      self.client.indices.createIndex(config,data,function(err) {
        console.log('ESClient-1 '+err+" "+this.client);
        self.client.cluster.health({wait_for_status: 'yellow'}, function (err, result) {
          console.log('ESClient-2 shouldbeNull: '+err);
          return callback(err,self);
        });
      });
    } else {
      console.log('ESClient-3 '+err+" "+self);
      return callback(err,self);
    }
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
	this.env.logDebug("ES.index "+JSON.stringify(jopts));
	this.client.index(jopts,doc,callback);
};

ESClient.prototype.getDocument = function(locator, callback) {
	//sanity (it happens with bugs)
	if (!locator || locator === '') {
		this.env.logError("ES.getDocument missing locator");
		callback("ES.getDocument missing locator",null);
	}
	var _jopts = {};
	_jopts._index = constants.TOPIC_INDEX;
	_jopts._type = constants.CORE_TYPE;
	_jopts._id = locator;
	var self = this;
	this.env.logDebug("ES.getDocument "+JSON.stringify(_jopts));
	this.client.get(_jopts, function(err,data) {
		console.log("ESClient.getDocument-1 "+err+" "+data);
		if (err) {
			self.env.logError("ES.getDocument "+JSON.stringify(_jopts));
		}
		callback(err,data);
	});
};

ESClient.prototype.existsDocument = function(locator,callback) {
	var _jopts = {};
	_jopts._index = constants.TOPIC_INDEX;
	_jopts._type = constants.CORE_TYPE;
	_jopts._id = locator;
	this.client.exists(_jopts, function(err,data) {
		console.log("ESClient.existsDocument "+err+" "+data);
		callback(err,data);
	});
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
 * @param query: JSON or string (es.request stringifies it if needed)
 * @param callback: signature (err,data)
 */
ESClient.prototype.search = function(query,callback) {
	var _jopts = {};
	_jopts._index = constants.TOPIC_INDEX;
	_jopts._type = constants.CORE_TYPE;
	this.client.search(_jopts, query,callback);
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

/**
 * Close the client
 * @param callback: signature (err)
 */
ESClient.prototype.close = function(callback) {
    //Opening and Closing indices causes problems
  callback('not closing anymore');
/**
  config._indices.push(constants.TOPIC_INDEX);
  config._types.push(constants.CORE_TYPE);
  this.client.indices.closeIndex(config, function(err) {
	  callback(err);
  });
  */
};

///////////////////////////////////////
// Diagnostic
///////////////////////////////////////
ESClient.prototype.hello = function() {
	console.log('ESClient hello '+this.client);
};