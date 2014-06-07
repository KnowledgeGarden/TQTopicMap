/**
 * query DSL
 */
var StringBuilder = require('stringbuilder');

var QueryDSL = module.exports = function() {};

QueryDSL.prototype.findNodeByType = function(typeLocator) {
	var sb = new StringBuilder("{\"query\": { \"term\": { \"instanceOf\":\"");
	sb.append(typeLocator+"\"}}}");
	
	return sb.toString();
};