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
:"","createdDate":"2014-08-04T00:00:00","sortDate":"2014-08-04T07:00:00.000Z","l
astEditDate":"2014-07-06T19:45:09","isPrivate":"false","label":["Third instance
node"],"details":["Also Seems likely"],"instanceOf":"SortTestType","transitiveCl
osure":["SortTestType"]}
{"locator":"DateThirdTopic","creatorId":"SystemUser","smallIcon":"","largeIcon":
"","createdDate":"2014-08-03T00:00:00","sortDate":"2014-08-03T07:00:00.000Z","la
stEditDate":"2014-07-06T19:45:09","isPrivate":"false","label":["Second instance
node"],"details":["Seems likely too"],"instanceOf":"SortTestType","transitiveClo
sure":["SortTestType"]}
{"locator":"DateSecondTopic","creatorId":"SystemUser","smallIcon":"","largeIcon"
:"","createdDate":"2014-08-02T00:00:00","sortDate":"2014-08-02T07:00:00.000Z","l
astEditDate":"2014-07-06T19:45:08","isPrivate":"false","label":["First instance
node"],"details":["Seems likely"],"instanceOf":"SortTestType","transitiveClosure
":["SortTestType"]}
{"locator":"DateFirstTopic","creatorId":"SystemUser","smallIcon":"","largeIcon":
"","createdDate":"2014-08-01T00:00:00","sortDate":"2014-08-01T07:00:00.000Z","la
stEditDate":"2014-07-06T19:45:08","isPrivate":"false","label":["My very first no
de"],"details":["we always knew this would happen"],"instanceOf":"SortTestType",
"transitiveClosure":["SortTestType"]}
 */	  
  });
});