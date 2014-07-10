/**
 * <p>TopicMapEnvironment is a container for all the features
 * required to craft and operate a topic map</p>
 */
var es = require('./persist/es')
  , dp = require('./persist/dataprovider')
  , tm = require('./models/topicmodel')
  , qd = require('./util/querydsl')
  , mg = require('./merge/mergeengine')
  , bs = require('./models/bootstrap')
  , fs = require('fs')
	//https://github.com/nomiddlename/log4js-node
  , lgr = require('log4js');

/**
 * @param callback: signature (err,environment)
 */
var TopicMapEnvironment = module.exports = function(callback) {
	console.log('TopicMapEnvironment starting');
	var logger;
	var configProperties;
	var ESClient;
	var DataProvider;
	var topicModel;
	var mergeEngine;
	var queryDSL;

	//We are forced to wait for ElasticSearch to boot
	//read the config file
	fs.readFile(__dirname+"/../config.json", function(err, configfile) {
		configProperties = JSON.parse(configfile);
		lgr.configure(__dirname+"/../logger.json");
		logger = lgr.getLogger("TopicMap");
		logger.setLevel('ERROR');
		var x = logger.setLevel('debug');
		console.log('TopicMapEnvironment starting-1 '+configfile+" "+logger+" "+x);
		//x = 4 then undefined ???
		//We need a mappings file for ESClient
		fs.readFile(__dirname+"/../mappings.json", function(err,mapfil) {
			ESClient = new es(JSON.parse(mapfil), configProperties, function(err,client) {
				console.log('TopicMapEnvironment-1 '+this.ESClient);
				DataProvider = new dp(this, ESClient);
				topicModel = new tm(this);
				queryDSL = new qd();
				// create an internal instance of MergeEngine
				// for now, it just responds to 'newproxy' events generated
				// by DataProvider
				mergeEngine = new mg(this, ESClient);
				// detect 'newproxy' events and send them to MergeEngine
				DataProvider.on('newproxy', mergeEngine.onNewProxy);
				console.log('Environment up '+ESClient+' '+queryDSL+' '+DataProvider+' '+topicModel);
				var self = this;
				/////////////////////////////
				// API
				/////////////////////////////
				self.hello = function() {
					return 'hello';
				},
        
				self.getDatabase = function() {
					return ESClient;
				},
        
				self.getDataProvider = function() {
					return DataProvider;
				},
        
				self.getTopicModel = function() {
					return topicModel;
				},
        
				self.getQueryDSL = function() {
					return queryDSL;
				},
        
				//NOTE: ESClient.close is disabled until we better understand how it works
				self.shutDown = function() {
					this.ESClient.close(function(err) {
						console.log('ESClient closed '+err);
					});
				},
				//////////////////////////////////////
				// logging utils
				//////////////////////////////////////
				self.logInfo = function(message) {
					console.log("LOGGINGinfo "+message);
					logger.info(message);
				},
				self.logDebug = function(message) {
					console.log("LOGGINGdebug "+message);
					logger.debug(message);
				},
				self.logError = function(message) {
					logger.error(message);
				};
				//now, bootstrap the map
				var x = new bs(DataProvider, topicModel);
				x.bootstrap();
         
				ESClient.hello();
				self.logInfo("Environment started");
				self.logDebug("Environment.started");
				console.log('TopicMapEnvironment+ ');
				callback(err,this);
			});
		});
	});
};
