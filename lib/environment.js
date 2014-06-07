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

var TopicMapEnvironment = module.exports = function() {
	this.esDatabase = new es();
	this.DataProvider = new dp(this);
	this.topicModel = new tm(this);
	this.queryDSL = new qd();
	// create an internal instance of MergeEngine
	// for now, it just responds to 'newproxy' events generated
	// by DataProvider
	this.mergeEngine = new mg(this);
	// detect 'newproxy' events and send them to MergeEngine
	this.DataProvider.on('newproxy', this.mergeEngine.onNewProxy);
	console.log('Environment up '+this.esDatabase+' '+this.queryDSL);
};

TopicMapEnvironment.prototype.getDatabase = function() {
	return this.esDatabase;
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
