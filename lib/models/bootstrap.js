/**
 * Bootstrap the topic map
 */
var SubjectProxy = require('../models/subjectproxy')
  , types	= require('../types')
  , constants = require('../constants')
;

var Bootstrap = module.exports = function(dataProvider, topicModel) {
	var self = this;

	/**
	 * Test the database to see if it needs to be bootstrapped
	 * @param callback signature = err;
	 */
	self.bootstrap = function(callback) {
		var credentials = [];
		credentials.push(constants.SYSTEM_USER);
		dataProvider.getNodeByLocator(types.TYPE_TYPE, credentials, function(err,result) {
			console.log("Bootstrap.bootstrap-1 "+err+" "+result);
			callback(err);
		});
	};
};
