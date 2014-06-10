/**
 * query DSL
 */
//var StringBuilder = require('./stringbuilder');
var properties = require('../properties');

var QueryDSL = module.exports = function() {
  var that = this;
  ///////////////////////////////////////
  //Proxies
  ///////////////////////////////////////
  that.findNodeByLocator= function(locator) {
    // {"match":{"locator":"MyTestProxy"}}
    return matchQuery(properties.LOCATOR,locator);
  };
  
  that.findNodeByType= function(typeLocator) {
//	var query = {}
//	  , prop = {};
//	prop[properties.INSTANCE_OF] = typeLocator;
//	query.match=prop;
    //
    return matchQuery(properties.INSTANCE_OF,typeLocator);
  };

  that.findNodeByURL= function(url) {
    // {"match":{"url":"http://google.com/"}}
    return matchQuery(properties.URL,url);
  };
  
  that.listNodesByType = function(typeLocator,start,count) {
	  
  };
  
  that.listSubclassNodes = function(superClassLocator,start,count) {
	  
  };
  
  that.listInstanceNodes = function(parentNodeLocator,start,count) {
	  
  };
  that.listNodesByURL = function(url,start,count) {
	  
  };
  
  that.listNodesByPSI = function(psi,start,count) {
	  
  };
  ///////////////////////////////////////
  //Tuples
  ///////////////////////////////////////
  that.listObjectNodesByRelationAndObjectRole = function(relationLocator, 
		  objectRoleLocator, start, count) {
	  
  };
  
  that.listObjectNodesByRelationAndSubjectRole = function(relationLocator, 
		  subjectRoleLocator, start, count) {
	  
  };

  that.listObjectNodesBySubjectAndRelation = function(subjectLocator, 
		  relationLocator, start, count) {
	  
  };
  
  that.listObjectNodesBySubjectAndRelationAndScope = function(subjectLocator, 
		  relationLocator, scopeLocator, start, count) {
	  
  };
  
  that.listSubjectNodesByObjectAndRelation = function(objectLocator, 
		  relationLocator, start, count) {
	  
  };
  
  that.listSubjectNodesByObjectAndRelationAndScope = function(objectLocator, 
		  relationLocator, scopeLocator, start, count) {
	  
  };
  
  that.listSubjectNodesByRelationAndObjectRole = function(relationLocator,
		  objectRoleLocator, start, count) {
	  
  };
  
  that.listSubjectNodesByRelationAndSubjectRole = function(relationLocator,
		  subjectRoleLocator, start, count) {
	  
  };
  
  that.listTuplesByObjectLocator = function(objectLocator,start,count) {
	  
  };
  
  that.listTuplesByPredTypeAndObject = function(predType, obj, start, count) {
	  
  };
  
  that.listTuplesBySubject = function(subjectLocator,start,count) {
	  
  };
  
  that.listTuplesBySubjectAndPredType = function(subjectLocator, 
		  predType, start, count) {
	  
  };
  
  that.listTuplesByLabels = function(labels,start,count) {
	  
  };
  
  that.listTuplesByPredTypeAndObjectOrSubject = function(predType,
			obj, start, count) {
	  
  };
  
  that.getTupleBySignature = function(signature) {
    var query = {}
	  , prop = {};
	prop[properties.TUPLE_SIGNATURE_PROPERTY] = signature;
	query.match=prop;
	// 
	return query;
  };
  
  ////////////////////////////////
  function matchQuery(property,value) {
	    var query = {}
		  , prop = {};
		prop[property] = value;
		query.match=prop;
		// 
		return query;
  };
};