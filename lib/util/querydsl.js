/**
 * query DSL
 */
//var StringBuilder = require('./stringbuilder');
var properties = require('../properties');

var QueryDSL = module.exports = function() {
  var that = this;
	 
  that.findNodeByLocator= function(locator) {
    var query = {}
      , term = {}
      , prop = {};
    prop[properties.LOCATOR] = locator;
    term.term = prop;
    query.query=term;
    // {"query":{"term":{"locator":"MyTestProxy"}}}
    return query;
  };
  
  that.findNodeByType= function(typeLocator) {
    var query = {}
      , term = {}
      , prop = {};
    prop[properties.INSTANCE_OF] = typeLocator;
    term.term = prop;
    query.query=term;
    //{"query":{"term":{"instanceOf":"FancyNode"}}}
    return query;
  };

  that.findNodeByURL= function(url) {
    var query = {}
      , term = {}
      , prop = {};
    prop[properties.URL] = url;
    term.term = prop;
    query.query=term;
    //{"query":{"term":{"url":"http://google.com/"}}}
    return query;
  };

};