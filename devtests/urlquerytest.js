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
	var urlx = "http://www.amazon.com/Reinventing-American-Health-Care-Outrageously/dp/1610393457";
	var urly = "http://bar.bar";
	dataProvider.getNodeByURL(urlx, [], function(err,data) {
 		console.log('querytest-4 '+err+" "+data);
 		if (data) {
 			console.log(JSON.stringify(data));
 		}
 	});
});

/**
 * 
actual: http://bar.bar
"http://bar.bar" got a score of 3.89
"http://bar.bar/" got a score of 4.349
actual http://google.com/
"http://google.com" got a score 3.359
"http://google.com/" got a score of 3.917
actual  nothing
urlx got a max score of 0.423
*/