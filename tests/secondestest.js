/**
 * query testing es
 */
var env = require('../lib/environment'),
    sp  = require('../lib/models/subjectproxy');

var TopicMapEnvironment = module.exports = new env();
var database = TopicMapEnvironment.getDatabase();
var dataprovider = TopicMapEnvironment.getDataProvider();
var proxy = new sp();
proxy.setLocator("MyTestProxy");
proxy.setNodeType("FancyNode");
proxy.addSuperClassLocator('MySuper');

console.log(proxy.toJSON());
dataprovider.putNode(proxy,function(err,data) {
	console.log('A '+err);
	proxy.setLocator("MySecondTestProxy");
	dataprovider.putNode(proxy,function(err,data) {
		console.log('B '+err);
		
	});
});
var credentials = null;
var QueryDSL = TopicMapEnvironment.getQueryDSL();
var query = QueryDSL.findNodeByType("FancyNode");
console.log('Query: '+query);
dataprovider.search(query,credentials,function(err,data){
	console.log('C '+err);
	console.log('D '+data);
	if (data) {
		console.log('E '+data);
		var p,len = data.length;
		console.log('YYY '+len);
		for (var i=0;i<len;i++)
			console.log(data[i].toJSON());
	}

} );
/* most recent
{"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
Query: [Object StringBuilder]
MergeEngine.onNewProxy MyTestProxy
A null
C null
D [object Object],[object Object]
E [object Object],[object Object]
YYY 2
{"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
{"locator":"MySecondTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
MergeEngine.onNewProxy MySecondTestProxy
B null
 */
/*
{"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
Query: [Object StringBuilder]
DataProvider.search {"took":2,"timed_out":false,"_shards":{"total":5,"successful
":5,"failed":0},"hits":{"total":2,"max_score":1,"hits":[{"_index":"proxies","_ty
pe":"core","_id":"MySecondTestProxy","_score":1,"_source":{"locator":"MySecondTe
stProxy","instanceOf":"FancyNode","subOf":["MySuper"]}},{"_index":"proxies","_ty
pe":"core","_id":"MyTestProxy","_score":1,"_source":{"locator":"MyTestProxy","in
stanceOf":"FancyNode","subOf":["MySuper"]}}]}}
DataProvider.search-1 [{"_index":"proxies","_type":"core","_id":"MySecondTestPro
xy","_score":1,"_source":{"locator":"MySecondTestProxy","instanceOf":"FancyNode"
,"subOf":["MySuper"]}},{"_index":"proxies","_type":"core","_id":"MyTestProxy","_
score":1,"_source":{"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["M
ySuper"]}}]
XXXX 2
DataProvider.search-2 {"_index":"proxies","_type":"core","_id":"MySecondTestProx
y","_score":1,"_source":{"locator":"MySecondTestProxy","instanceOf":"FancyNode",
"subOf":["MySuper"]}}
DataProvider.search-3 {"locator":"MySecondTestProxy","instanceOf":"FancyNode","s
ubOf":["MySuper"]}
DataProvider.search-4 {"locator":"MySecondTestProxy","instanceOf":"FancyNode","s
ubOf":["MySuper"]}
DataProvider.search-2 {"_index":"proxies","_type":"core","_id":"MyTestProxy","_s
core":1,"_source":{"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["My
Super"]}}
DataProvider.search-3 {"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":
["MySuper"]}
DataProvider.search-4 {"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":
["MySuper"]}
C null
D [object Object],[object Object]
E [object Object],[object Object]
YYY 2
{"locator":"MySecondTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
{"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
A null
B null
 */
/*
{"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
Query: [Object StringBuilder]
A null
C null
D [object Object]
E {"took":6,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"h
its":{"total":2,"max_score":1,"hits":[{"_index":"proxies","_type":"core","_id":"
MyTestProxy","_score":1,"_source":{"locator":"MyTestProxy","instanceOf":"FancyNo
de","subOf":["MySuper"]}},{"_index":"proxies","_type":"core","_id":"MySecondTest
Proxy","_score":1,"_source":{"locator":"MySecondTestProxy","instanceOf":"FancyNo
de","subOf":["MySuper"]}}]}}
B null
*/