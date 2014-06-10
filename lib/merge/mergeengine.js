/**
 * MergeEngine
 */
var SubjectProxy = require('../models/subjectproxy');

var MergeEngine = module.exports = function(environment, db) {
	this.environment = environment;
	this.database = db;
	console.log('MergeEngine starting ');
};

MergeEngine.prototype.onNewProxy = function(proxy) {
	console.log('MergeEngine.onNewProxy '+proxy.getLocator());
};
