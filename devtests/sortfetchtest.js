/**
 * Fetch sorted on date nodes
 */
var index = require('../index')
  , querydsl = require('../lib/util/querydsl')
  , constants = require('../lib/constants');

new index(function(err,data) {
  var Environment = data;
  console.log('NodeBuilder-1 '+err+" "+Environment.hello());
  var dataProvider = Environment.getDataProvider();
  var qDSL = new querydsl();
	  //some constants
  var lox1 = "DateFirstTopic";
  var lox2 = "DateSecondTopic";
  var lox3 = "DateThirdTopic";
  var lox4 = "DateFourthTopic";
  var type1 = "SortTestType";
  var proxyA, proxyB, proxyC, proxyD;
  var credentials = null; //todo
  var query = qDSL.sortedDateTermQuery("instanceOf",type1);
  //go looking
  dataProvider.listNodesByQuery(query, 0,-1,credentials, function(err,data) {
	  console.log("A "+err+" "+data);
	  var len = data.length;
	  for (var i=0;i<len;i++)
		  console.log(data[i].toJSON());
/**
{"locator":"DateFourthTopic","creatorId":"SystemUser","smallIcon":"","largeIcon"
:"","createdDate":"2014-08-04T00:00:00","sortDate":1407135600000,"lastEditDate":
"2014-07-07T13:50:55","isPrivate":"false","label":["Third instance node"],"detai
ls":["Also Seems likely"],"instanceOf":"SortTestType","transitiveClosure":["Sort
TestType"]}
{"locator":"DateThirdTopic","creatorId":"SystemUser","smallIcon":"","largeIcon":
"","createdDate":"2014-08-03T00:00:00","sortDate":1407049200000,"lastEditDate":"
2014-07-07T13:50:55","isPrivate":"false","label":["Second instance node"],"detai
ls":["Seems likely too"],"instanceOf":"SortTestType","transitiveClosure":["SortT
estType"]}
{"locator":"DateSecondTopic","creatorId":"SystemUser","smallIcon":"","largeIcon"
:"","createdDate":"2014-08-02T00:00:00","sortDate":1406962800000,"lastEditDate":
"2014-07-07T13:50:55","isPrivate":"false","label":["First instance node"],"detai
ls":["Seems likely"],"instanceOf":"SortTestType","transitiveClosure":["SortTestT
ype"]}
{"locator":"DateFirstTopic","creatorId":"SystemUser","smallIcon":"","largeIcon":
"","createdDate":"2014-08-01T00:00:00","sortDate":1406876400000,"lastEditDate":"
2014-07-07T13:50:54","isPrivate":"false","label":["My very first node"],"details
":["we always knew this would happen"],"instanceOf":"SortTestType","transitiveCl
osure":["SortTestType"]}
 */	  
  });
});