/**
 * query DSL
 */
var StringBuilder = require('stringbuilder');

var QueryDSL = module.exports = function() {
	 var that = this;
	 
  that.findNodeByType= function(typeLocator) {
	var sb = new StringBuilder("{\"query\": { \"term\": { \"instanceOf\":\"");
	sb.append(typeLocator+"\"}}}");
	
	return sb.toString();
  };

  that.findNodeByURL= function(url) {
	var sb = new StringBuilder("{\"query\": { \"term\": { \"url\":\"");
	sb.append(url+"\"}}}");
	
	return sb.toString();
  };

};