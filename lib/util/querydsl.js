/**
 * query DSL
 */
//var StringBuilder = require('./stringbuilder');
var properties = require('../properties')
  , qu = require('./queryutil');

var QueryDSL = module.exports = function() {
  var that = this;
  var QueryUtil = new qu();
  ///////////////////////////////////////
  //Proxies
  ///////////////////////////////////////
  that.findNodeByLocator= function(locator) {
    // {"tern":{"locator":"MyTestProxy"}}
    return termQuery(properties.LOCATOR, locator);
  };
  
  that.findNodeByType= function(typeLocator) {
    // {"term":{"instanceOf":"FancyNode"}}
    return termQuery(properties.INSTANCE_OF,typeLocator);
  };

  that.findNodeByURL= function(url) {
	// {"term":{"url":"http\\://google.com/"}} with QueryUtil
	  //{"fields":["url"],"term":{"url":"http\\://google.com/"}}
    return termQuery(properties.URL,QueryUtil.escapeQueryCulprits(url));
  };
  
  that.listNodesByType = function(typeLocator,start,count) {
	  //for now
	return termQuery(properties.INSTANCE_OF, typeLocator);
  };
  
  that.listSubclassNodes = function(superClassLocator,start,count) {
	  
  };
  
  that.listInstanceNodes = function(parentNodeLocator,start,count) {
	  
  };
  that.listNodesByURL = function(url,start,count) {
	  
  };
  
  that.listNodesByPSI = function(psi,start,count) {
	  
  };
  
  that.listNodesByKey = function(key,value,start,count) {
	  //for now
    return termQuery(key, value);
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
	// 
	return termQuery(properties.TUPLE_SIGNATURE_PROPERTY, signature);
  };
  ////////////////////////////////
  // Text search
  ////////////////////////////////
  //http://www.elasticsearch.org/guide/en/elasticsearch/reference/0.90/query-dsl-text-query.html
  //http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/search-request-sort.html
  that.listByText = function(textField, queryString, start, count) {
    var query = {};
    query.sort = "_scorre";
    var q = {};
    q[textField] = queryString;
    query.text = q;
    //for now, skip start/count
    return query;
  };
  
  ////////////////////////////////
  // Term query sort by date
  // NOTE: THIS works on SORT_DATE, a real date object
  //{"sort":{"sortDate":{"order":"desc"}},"query":
  //     {"field":{"instanceOf":"SortTestType"}}}
  ////////////////////////////////
  /**
   * @param property, typically instanceOf
   * @param value, typically some type
   * @return query for sorting hits 
   */
  that.sortedDateTermQuery = function(property,value) {
    var query = {};
    var o = {};
    o.order = "desc";
    var s = {};
    s[properties.SORT_DATE] = o;
    query.sort = s;
    var q = {};
    var prop = {};
    prop[property] = value;
    q.field=prop;
    query.query = q;
    return query;
  };
  ////////////////////////////////
  // Term query sort by TupleCount
  ////////////////////////////////
  /**
   * @param property, typically instanceOf
   * @param value, typically some type
   * @return query for sorting hits 
   */
  that.sortedTupleCountTermQuery = function(property,value) {
    var query = {};
    var o = {};
    o.order = "desc";
    var s = {};
    s[properties.TUPLE_COUNT] = o;
    query.sort = s;
    var q = {};
    var prop = {};
    prop[property] = value;
    q.field=prop;
    query.query = q;
    return query;
  };

  
  
  //es 0.9.0 docs 
  //http://www.elasticsearch.org/guide/en/elasticsearch/reference/0.90/query-dsl-match-query.html
  //http://www.elasticsearch.org/guide/en/elasticsearch/reference/0.90/query-dsl-term-query.html
  //http://www.elasticsearch.org/guide/en/elasticsearch/reference/0.90/query-dsl-wildcard-query.html
  //http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/search-request-fields.html
  //http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/search-request-from-size.html
  /**
   * @param property
   * @param value
   * @return
   */
  function termQuery(property,value) {
    var query = {};
    var q = {};
    var prop = {};
    prop[property] = value;
    q.field=prop;
    query.query = q;
    return query;
  }
  
  /**
   * Analyze <code>text</code> and create query from that
   * @param property
   * @param text
   * @return
   */
  function matchPhraseQuery(property,text) {
    var query = {};
	var prop = {};
    prop[property] = text;
    query.match_phrase=prop;
    return query;
  }
  
  /**
   * Note: <code>text</code> must include '*' as wildcard(s),
   * e.g. '*something good', or 'some*thing' or 'such as*'
   * @param property
   * @param text
   * @return
   */
  function wildCardQuery(property,text) {
    var query = {};
    var prop = {};
    prop[property] = text;
    query.wildcard=prop;
    return query;
  }
/**
{
  "bool" : {
    "must" : [ {
      "term" : {
        "instanceOf" : "Foo"
      }
    }, {
      "term" : {
        "TupleObjectPropertyType" : "Bar"
      }
    } ]
  }
}
 */
  function andQueryTwoTerms(propA, valA, propB, valB) {
    var query = {};
    var q = {};
    var must = [];
    var tA = {};
    tA[propA]=valA;
    must.push(tA);
    var tB = {};
    tB[propB]=valB;
    must.push(tB);
    q.must = must;
    query.bool = q;
    return query;
  }
  
  function andQueryThreeTerms(propA,valA,propB,valB,propC,valC) {
    var query = {};
    var q = {};
    var must = [];
    var tA = {};
    tA[propA]=valA;
    must.push(tA);
    var tB = {};
    tB[propB]=valB;
    must.push(tB);
    var tC = {};
    tC[propC] = valC;
    must.push(tC);
    q.must = must;
    query.bool = q;
    return query;
  }
/**
{
  "bool" : {
    "must" : {
      "term" : {
        "instanceOf" : "Foo"
      }
    },
    "should" : [ {
      "term" : {
        "TupleObjectPropertyType" : "bar"
      }
    }, {
      "term" : {
        "TupleSubjectPropertyType" : "bah"
      }
    } ]
  }
}
 */
  //TODO this is incorrect
  function andOrThreeTerms(propA,valA,propB,valB,propC,valC) {
    var query = {};
    var q = {};
    var must = {};
    var tA = {};
    tA[propA]=valA;
    must.push(tA);
    var tB = {};
    tB[propB]=valB;
    must.push(tB);
    var tC = {};
    tC[propC] = valC;
    must.push(tC);
    q.must = must;
    query.bool = q;
    return query;
  }
};