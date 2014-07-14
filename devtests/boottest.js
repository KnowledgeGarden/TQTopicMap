/**
 * Simple boottest
 */
var index = require('../index')
  , constants = require('../lib/constants');

var x = new index(function(err,data) {
	var Environment = data;
	console.log('Boottest-1 '+err+" "+Environment.hello());
	var dataProvider = Environment.getDataProvider();
	console.log('Boottest-2 '+dataProvider);
	var topicModel = Environment.getTopicModel();
	console.log('Boottest-2 '+topicModel);
});

/**


c:\projects\eclipseNODE\workspace\TQTopicMap\devtests>node boottest.js
STARTING
TopicMapEnvironment starting
TopicMapEnvironment starting-1 {
        "clusters": [ {"host":"localhost","port":"9200"}],
        "comment": "We can use this to define default admins, etc"
} [object Object] undefined
ESClient-- {"_indices":["topics"],"_types":["core"],"refresh":true,"server":{"ho
st":"localhost","port":"9200"}}
ESClient- [object Object] [object Object]
ESClient exists null [object Object]
{"statusCode":200,"exists":true}
ESClient-3 null [object Object]
TopicMapEnvironment-1 [object Object]
DataProvider [object Object]
TopicModel [object Object]
MergeEngine starting
Environment up [object Object] [object Object] [object Object] [object Object]
DataProvider.getNodeByLocator TypeType SystemUser
FOO {"query":{"field":{"locator":"TypeType"}}}
ESClient hello [object Object]
LOGGINGinfo Environment started
LOGGINGdebug Environment.started
TopicMapEnvironment+
Boottest-1 null hello
Boottest-2 [object Object]
Boottest-2 [object Object]
XXXXX {"took":2,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0
},"hits":{"total":0,"max_score":null,"hits":[]}}
DataProvider.getNode-2 0
DataProvider.getNode+ null
Bootstrap.bootstrap-1 null null

c:\projects\eclipseNODE\workspace\TQTopicMap\devtests>

*/