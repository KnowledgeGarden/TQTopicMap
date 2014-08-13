/**Node tests
 */
var index = require('../index')
  , constants = require('../lib/constants');

new index(function(err,data) {
  var Environment = data;
  console.log('NodeBuilder-1 '+err+" "+Environment.hello());
  var dataProvider = Environment.getDataProvider();
	  //some constants
  var lox1 = "NodeBuilderFirstTopic";
  var lox2 = "NodeBuilderSecondTopic";
  var lox3 = "NodeBuilderThirdTopic";
  var lox4 = "NodeBuilderFourthTopic";
  var lox5 = "ASuperClass";
  var type1 = "NodeBuilderType";
  var type2 = "NodeBuilderOtherType";
  var proxyA, proxyB, proxyC, proxyD;
  var credentials = null; //todo
  
  //go looking
  dataProvider.getNodeByLocator(lox1, credentials, function(err,data) {
	  console.log("A "+err+" "+data.toJSON());
	  dataProvider.getNodeByLocator(lox2, credentials, function(err,data) {
		  console.log("B "+err+" "+data.toJSON());
		  dataProvider.getNodeByLocator(lox3, credentials, function(err,data) {
			  console.log("C "+err+" "+data.toJSON());
			  dataProvider.getNodeByLocator(lox4, credentials, function(err,data) {
				  console.log("D "+err+" "+data.toJSON());
				  //OK to here
				  dataProvider.listInstanceNodes(type1,0,-1, credentials, function(err,data,count) {
					  console.log("E "+err+" "+data+" "+count);
					  var len = data.length;
					  for (var i=0;i<len;i++) // should return 2
						  console.log(data[i].toJSON());
					  dataProvider.listInstanceNodes(type2,0,-1, credentials, function(err,data,count) {
						  console.log("F "+err+" "+data+" "+count);
						  //should get 1
						  var len = data.length;
						  for (var i=0;i<len;i++) // should return 1
							  console.log(data[i].toJSON());
						  dataProvider.listNodesByLabel("\"First instance node\"",constants.ENGLISH, 0,-1, credentials, function(err,data,count) {
							  console.log("G "+err+" "+data+" "+count);
							  //should get 1
//{"locator":"NodeBuilderSecondTopic","creatorId":"SystemUser","smallIcon":"","lar
//	geIcon":"","createdDate":"2014-12-05 14:07:41","lastEditDate":"2014-12-05 14:07:
//		41","isPrivate":"false","label":["First instance node"],"details":["Seems likely
//		"],"instanceOf":"NodeBuilderType","transitiveClosure":["NodeBuilderType"]}
							  if (data) {
							    var len = data.length;
							    for (var i=0;i<len;i++)
								  console.log(data[i].toJSON());
							  }
							  dataProvider.listSubclassNodes(lox5, 0,-1, credentials, function(err,data, count) {
								  //{"query":{"term":{"sbOf":"ASuperClass"}}}
								  console.log("H "+err+" | "+data+" | "+count);
								  //should get 2
								  if (data) {
								    var len = data.length;
								    for (var i=0;i<len;i++)
									  console.log(data[i].toJSON());
								  }
							  });
						  });
					  });
					 });
				  
			  });
		  });
	  });
  });
});