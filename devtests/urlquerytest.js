/**
 * urlquerytest
 */

var index = require('../index')
  , constants = require('../lib/constants');

var x = new index(function(err,data) {
	var Environment = data;
	console.log('querytest-1 '+err+" "+Environment.hello());
	var dataProvider = Environment.getDataProvider();
	console.log('querytest-2 '+dataProvider);
	var topicModel = Environment.getTopicModel();
	console.log('querytest-2 '+topicModel);
//	dataProvider.getNodeByLocator("TypeType ", null, function(err,data) {
//		console.log('querytest-4 '+err+" "+data);
		
//	});
	dataProvider.getNodeByURL("http://google.com/", null, function(err,data) {
 		console.log('querytest-4 '+err+" "+data);
 	});
});