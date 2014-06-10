/**
 * simple test of elasticsearch client
 */
/////////////////////////////////
//This code is being used to debug es.js and environment.js
// Since ElasticSearch can take a while to initialize itself, it's not a matter
// of just serially booting, then starting to call APIs.
// We need to wait for ESClient to fully boot and signal by calling its callback
//  with any error messages.
//  One known error message will be that of an index already existing.
//  We ignore that and keep going.
// But, we are now running into issues related to the callbacks.
//  In the case of ESClient, the client itself was passed back in the callback.
//  In the case of Environment, it was first passed back in the callback, but below
//    is a body of code: console.log("DANG "+TopicMapEnvironment.hello());
//    which shows that the environment can be called with a wait callback but still
//    sets a var with itself, which can fire the hello() method.
//    But, that same environment cannot set var database and var dataprovider even after
//    the waitFunction.
// Note that code in environment.js
//   console.log('TopicMapEnvironment+ '+this.ESClient.hello());
//   which is similar to here -- ESClient sets its own var -- fails
///////////////////////////////////
var env = require('../lib/environment'),
    sp  = require('../lib/models/subjectproxy');

function waitFunction(err) {
	  console.log("STARTING "+err+' '+TopicMapEnvironment.hello());
	  var database = TopicMapEnvironment.getDatabase();
	  var dataprovider = TopicMapEnvironment.getDataProvider();
	  console.log("STARTING-1 "+database+' '+dataprovider);
	  if (!err) {
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
	  }
}
var TopicMapEnvironment = new env(waitFunction);
//This console.log runs fine BEFORE the same call above in waitFunction
console.log("DANG "+TopicMapEnvironment.hello());
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
