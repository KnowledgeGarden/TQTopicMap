/**
 * <p>TopicMapEnvironment is a container for all the features
 * required to craft and operate a topic map</p>
 */
var es = require('./persist/es'),
	dp = require('./persist/dataprovider'),
	tm = require('./models/topicmodel'),
	qd = require('./util/querydsl'),
	mg = require('./merge/mergeengine'),
	//https://github.com/quirkey/node-logger
	logger = require('logger').createLogger('development.log');

/**
 * @param callback: signature (err)
 */
var TopicMapEnvironment = function(callback) {
  console.log('TopicMapEnvironment starting');
  //We are forced to wait for ElasticSearch to boot
  this.ESClient = new es(function(err) {

	console.log('TopicMapEnvironment-1 '+err+' '+this.ESClient);
//    if (!err) {
      this.DataProvider = new dp(this, this.ESClient);
      this.topicModel = new tm(this, this.DataProvider);
      this.queryDSL = new qd();
      // create an internal instance of MergeEngine
      // for now, it just responds to 'newproxy' events generated
      // by DataProvider
      this.mergeEngine = new mg(this, this.ESClient);
      // detect 'newproxy' events and send them to MergeEngine
      this.DataProvider.on('newproxy', this.mergeEngine.onNewProxy);
      console.log('Environment up '+this.ESClient+' '+this.queryDSL+' '+this.DataProvider);
//    }
    callback(err);
  });
	console.log('TopicMapEnvironment+ '+this.ESClient.hello());
};

TopicMapEnvironment.prototype.hello = function() {
	return 'hello';
};
TopicMapEnvironment.prototype.getDatabase = function() {
	return this.ESClient;
};
TopicMapEnvironment.prototype.getDataProvider = function() {
	return this.DataProvider;
};
TopicMapEnvironment.prototype.getTopicModel = function() {
	return this.topicModel;
};
TopicMapEnvironment.prototype.getQueryDSL = function() {
	return this.queryDSL;
};

//////////////////////////////////////
// logging utils
//////////////////////////////////////
TopicMapEnvironment.prototype.logInfo = function(message) {
	logger.info(message);
};
TopicMapEnvironment.prototype.logDebug = function(message) {
	logger.debug(message);
};
TopicMapEnvironment.prototype.logError = function(message) {
	logger.error(message);
};

module.exports = TopicMapEnvironment;
