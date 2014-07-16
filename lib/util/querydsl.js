/**
 * query DSL
 * NOTE: MIGRATED TO ES 1.2.2
 * Some old queries don't work
 */
//var StringBuilder = require('./stringbuilder');
var properties = require('../properties')
  , querystring = require('querystring')
  , qu = require('./queryutil');

var QueryDSL = module.exports = function() {
  var that = this;
  var QueryUtil = new qu();
  ///////////////////////////////////////
  //Proxies
  ///////////////////////////////////////

  that.findNodeByURL= function(url) {
	//{"query":{"field":{"url":"http%3A%2F%2Fgoogle.com%2F"}}}
	return termQuery(properties.URL,querystring.escape(url),0,-1);
  };
  
  that.listNodesByType = function(typeLocator,start,count) {
	return termQuery(properties.INSTANCE_OF, typeLocator,start,count);
  };
  
  
  that.listNodesByKey = function(key,value,start,count) {
    return termQuery(key, value,start,count);
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
  //{"sort":"_score","text":{"details":"\"Topic Map\""}}
  
  //1.2.2 uses match:
  //{"match" : {"message" : "this is a test"}}
  //http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html
  //{"multi_match" : {"query":    "this is a test", "fields": [ "subject", "message" ] }}
  ////////////////////////////////
  //http://www.elasticsearch.org/guide/en/elasticsearch/reference/0.90/query-dsl-text-query.html
  //http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/search-request-sort.html
  
  /**
   * This searches either or both of two text fields (typically label or details in some language
   * @param textFieldA  can be <code>null</code>
   * @param textFieldB can be <code>null</code> at least one of the two must not be <code>null</code>
   * @param queryString
   * @param start
   * @param count
   */
  that.listByText = function(textFieldA,textFieldB, queryString, start, count) {
	//This will tread any string with an embedded " as a phrase query
	// of the type "\"something or other\""
	var where = queryString.indexOf("\"");
	console.log("QueryDSL.listByText "+where);
    var query = {};
    var m = {};
    m.query = queryString;
    if (where > -1) { m.type = "phrase";}
    var l = [];
    if (textFieldA !== null) {l.push(textFieldA);}
    if (textFieldB !== null) {l.push(textFieldB);}
    m.fields = l;
    if (count > -1) {
    	query.size = count;
    	query.from = start;
    }
    var q={};
    q.multi_match = m;
    query.query = q;
 /**   query.sort = "_score";
    var q = {};
    q[textField] = queryString;
    query.text = q; */
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

  
  
  //es 1.* docs 
  //http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-term-query.html
  // { "term" : { "user" : "kimchy" }
  /**
   * @param property
   * @param value
   * @param start
   * @param count
   * @return
   */
  function termQuery(property,value, start, count) {
	var query = {};
    if (count > -1) {
    	query.size = count;
    	query.from = start;
    }

	var m = {};
	var q = {};
	q[property] = value;
	//supposed to be term but that didn't work
	m.match = q;
	query.query = m;
	return query;
  }
  
  /**
   * Analyze <code>text</code> and create query from that
   * @param property
   * @param text
   * @return
   */
  //not used
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
  //TODO these need work
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