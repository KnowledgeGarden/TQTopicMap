/**
 * simple test of elasticsearch client
 */
/////////////////////////////////
// This code illustrates an approach to building and using a topic map app:
//  You first create the TopicMapEnvironment
//  You then wait for the ESClient to fire an 'onReady' signal from which
//    you fire up the main altorithm (begin)
///////////////////////////////////
var env = require('../lib/environment')
  , EventEmitter = require('events').EventEmitter
  , sp  = require('../lib/models/subjectproxy');

var TopicMapEnvironment = new env();

var begin = function() {
  console.log("STARTING "+TopicMapEnvironment.hello());
  var database = TopicMapEnvironment.getDatabase();
  var dataprovider = TopicMapEnvironment.getDataProvider();
  console.log("STARTING-1 "+database+' '+dataprovider);
  //here, we are building our own SubjectProxy
  var proxy = new sp();
  proxy.setLocator("MyTestProxy");
  proxy.setNodeType("FancyNode");
  proxy.addSuperClassLocator('MySuper');

  console.log(proxy.toJSON());
  //save it
  dataprovider.putNode(proxy,function(err,data) {
    console.log('A '+err);
    console.log('B '+data);
    if (data) {
      console.log('C '+JSON.stringify(data));
    }
    var credentials = null;
    //fetch it back
    dataprovider.getNode(proxy.getLocator(),credentials,function(err,data){
      console.log('D '+err);
      console.log('E '+data);
      if (data) {
        console.log('F '+data.toJSON());
      }
      //In the end, this might not be important
      TopicMapEnvironment.shutDown();
    });

  });
};

var ESClient = TopicMapEnvironment.getDatabase();
ESClient.on('onReady', begin);
//diagnostic to watch timing behaviors
console.log("DANG "+TopicMapEnvironment.hello());

/*
TopicMapEnvironment starting
INDICES.createIndex [object Object] [object Object]
TopicMapEnvironment-1 [object Object]
DataProvider [object Object]
TopicModel [object Object]
MergeEngine starting
Environment up [object Object] [object Object] [object Object]
ESClient hello [object Object]
TopicMapEnvironment+ undefined
DANG hello
ESClient-1 Error: {"error":"IndexAlreadyExistsException[[topics] already exists]
","status":400}
STARTING hello
STARTING-1 [object Object] [object Object]
SubjectProxy.addSuperClassLocator MySuper [object Object]
AAA undefined
XXX -1 |
{"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
MergeEngine.onNewProxy MyTestProxy
A null
B [object Object]
C {"ok":true,"_index":"topics","_type":"core","_id":"MyTestProxy","_version":3}
DataProvider.getNode MyTestProxy
FOO {"match":{"locator":"MyTestProxy"}}
XXXXX {"took":2,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0
},"hits":{"total":1,"max_score":1,"hits":[{"_index":"topics","_type":"core","_id
":"MyTestProxy","_score":1,"_source":{"locator":"MyTestProxy","instanceOf":"Fanc
yNode","subOf":["MySuper"]}}]}}
DataProvider.getNode-2 1
DataProvider.getNode-3 {"locator":"MyTestProxy","instanceOf":"FancyNode","subOf"
:["MySuper"]}
DataProvider.getNode-4 {"locator":"MyTestProxy","instanceOf":"FancyNode","subOf"
:["MySuper"]}
DataProvider.getNode+ [object Object]
D null
E [object Object]
F {"locator":"MyTestProxy","instanceOf":"FancyNode","subOf":["MySuper"]}
ESClient closed not closing anymore

c:\projects\eclipseNODE\workspace\TQTopicMap\tests>
*/
