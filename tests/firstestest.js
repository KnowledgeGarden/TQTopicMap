/**
 * simple test of elasticsearch client
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
	console.log('B '+data);
	if (data)
		console.log('C '+JSON.stringify(data));
});
/*
{"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
A null
B [object Object]
C {"ok":true,"_index":"proxies","_type":"core","_id":"MyTestProxy","_version":2}
 */
var credentials = null;
dataprovider.getNode(proxy.getLocator(),credentials,function(err,data){
	console.log('D '+err);
	console.log('E '+data);
	if (data)
		console.log('F '+data.toJSON());
	
});

/*
{"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
DataProvider.getNode {"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":[
"MySuper"]}
SubjectProxy [object Object]
SubjectProxy+ [object Object]
DataProvider.getNode-1 [object Object]
D null
E [object Object]
F {"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
A null
B [object Object]
C {"ok":true,"_index":"proxies","_type":"core","_id":"MyTestProxy","_version":10
}
 */
