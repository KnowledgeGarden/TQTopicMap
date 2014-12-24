/**
 * <p>TopicMapEnvironment is a container for all the features
 * required to craft and operate a topic map</p>
 */
var es = require('./persist/es')
  , dp = require('./persist/dataprovider')
  , tm = require('./models/topicmodel')
  , rm = require('./models/relationmodel')
  , qd = require('./util/querydsl')
  , mg = require('./merge/mergeengine')
  , Bs = require('./models/bootstrap')
  , fs = require('fs')
  //export/import may be given over to the Java platform
//  , exim = require('./models/exim')
  , tcp1 = require('./util/jsonsocketserver')
	//https://github.com/nomiddlename/log4js-node
  , lgr = require('log4js');

/**
 * @param callback: signature (err,environment)
 */
var TopicMapEnvironment = module.exports = function(callback) {
	console.log('TopicMapEnvironment starting');
	var logger,
		configProperties,
		ESClient,
		DataProvider,
		topicModel,
		relationModel,
		JSONSocketServer,
		mergeEngine,
		queryDSL;
//	var ExportImportModel;

	//We are forced to wait for ElasticSearch to boot
	//read the config file
	console.log("FOO "+fs.existsSync("../config/config.json"));
	var path = __dirname+"/../config/config.json",
		path1 = __dirname+"/../config/logger.json",
		path2 = __dirname+"/../config/mappings.json";

	fs.readFile(path, function(err, configfile) {
		configProperties = JSON.parse(configfile);
		lgr.configure(path1);
		logger = lgr.getLogger("TopicMap");
		logger.setLevel('ERROR');
		var x = logger.setLevel('debug');
		console.log('TopicMapEnvironment starting-1 '+configfile+" "+logger+" "+x);
		//x = 4 then undefined ???
		//We need a mappings file for ESClient
		var error = '';
		fs.readFile(path2, function(err,mapfil) {
			ESClient = new es(this, JSON.parse(mapfil), configProperties, function(err,client) {
				if (err) {error+=err;}
				console.log('TopicMapEnvironment-1 '+ESClient);
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
				
				self.getSocketServer = function() {
					return JSONSocketServer;
				}
        
				self.getTopicModel = function() {
					return topicModel;
				},
				
				self.getRelationModel = function() {
					return relationModel;
				},
				
				self.getQueryDSL = function() {
					return queryDSL;
				},
        
//				self.getExportImportModel = function() {
//					return ExportImportModel;
//				},
				//NOTE: ESClient.close is disabled until we better understand how it works
				self.shutDown = function() {
					this.ESClient.close(function(err) {
						console.log('ESClient closed '+err);
					});
				},
				//////////////////////////////////////
				// logging utils
				//////////////////////////////////////
				self.logError = function(message) {
					logger.error(message);
				},
				self.logInfo = function(message) {
					console.log("LOGGINGinfo "+message);
					logger.info(message);
				},
				self.logDebug = function(message) {
					console.log("LOGGINGdebug "+message);
					logger.debug(message);
				};
				
				DataProvider = new dp(this, ESClient);
				topicModel = new tm(this);
				relationModel = new rm(this);
				queryDSL = new qd();
//				ExportImportModel = new exim(this);
				var p = configProperties.tcpport; 
				p = parseInt(p);
				JSONSocketServer = new tcp1(p);
				// create an internal instance of MergeEngine
				// for now, it just responds to 'newproxy' events generated
				// by DataProvider
				mergeEngine = new mg(this, JSONSocketServer);
				// detect 'newproxy' events and send them to MergeEngine
				DataProvider.on('newproxy', mergeEngine.onNewProxy);
				console.log('Environment up '+ESClient+' '+queryDSL+' '+DataProvider+' '+topicModel);
				//now, bootstrap the map
				if (configProperties.shouldBootstrap) {
					logger.debug("Environment HERE A");
					var x = new Bs(this);
					x.bootstrap(function(err) {
						if (err) {error+=err;}
						console.log("Bootstrap Done "+err);
						ESClient.hello();
						logger.debug("Environment HERE AA");
						return callback(error, this);
					});
				} else {
					logger.debug("Environment HERE B");
					return callback(error, this);
				}
         
			});
		});
	});
};
