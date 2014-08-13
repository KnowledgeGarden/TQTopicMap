/**
 * RelationModel
 */
var SubjectProxy = require('../models/subjectproxy')
  , types	= require('../types')
  , constants = require('../constants')
;
var RelationModel = module.exports = function(environment) {
	  var dataProvider = environment.getDataProvider();
	  var topicModel = environment.getTopicModel();
	  console.log('RelationModel '+ dataProvider);
	  var defaultCredentials = [];
	  defaultCredentials.push(constants.SYSTEM_USER);
	  var self = this;
	  
	  /**
	   * Helper function
	   * @param sourceNode
	   * @param targetNode
	   * @param userLocator
	   * @param credentials
	   * @param isPrivate
	   * @param sourceLabel
	   * @param targetLabel
	   * @param relationSmallIcon
	   * @param callback signature(err,data)
	   */
	  self._assert = function(sourceNode, targetNode, userLocator, credentials, isPrivate,
			  sourceLabel, targetLabel, relationSmallIcon, callback) {
		  
	  },
	  
	  self.cause = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.what = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.why = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.how = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.similar = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.analogous = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.notanalogous = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.metaphor = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.agree = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.disagree = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.different = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.opposite = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.same = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.uses = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.implies = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.enables = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.improves = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.addresses = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.solves = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.prerequisite = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.impairs = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.prevents = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.proves = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.refutes = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.evidenceFor = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.evidenceAgainst = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.consistent = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.inconsistent = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.example = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.predicts = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.envisages = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.responds = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.related = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.partOf = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  },
	  self.containedIn = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
		  
	  }


};