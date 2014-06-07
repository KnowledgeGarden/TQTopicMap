/**
 * MergeEngine
 */
var SubjectProxy = require('../models/subjectproxy');

var MergeEngine = module.exports = function(environment) {
	this.database = environment.getDatabase();
	console.log('MergeEngine starting ');
};

MergeEngine.prototype.onNewProxy = function(proxy) {
	console.log('MergeEngine.onNewProxy '+proxy.getLocator());
};
