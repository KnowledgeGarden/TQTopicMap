/**
 * Date sorting test
 */
var index = require('../index')
  , constants = require('../lib/constants');

new index(function(err,data) {
  var Environment = data;
  console.log('NodeBuilder-1 '+err+" "+Environment.hello());
  var dataProvider = Environment.getDataProvider();
	
  var topicModel = Environment.getTopicModel();
  //some constants
  var lox1 = "DateFirstTopic";
  var lox2 = "DateSecondTopic";
  var lox3 = "DateThirdTopic";
  var lox4 = "DateFourthTopic";
  var type1 = "SortTestType";

  var proxyA, proxyB, proxyC, proxyD;
  var credentials = null; //todo
  //build first topic
  topicModel.newInstanceNode(lox1,type1,"My very first node", "we always knew this would happen", "en",
			"SystemUser","","",false,credentials, function(err,data) {
    proxyA = data;
    proxyA.setDate(new Date(2014,7,1));
    console.log('A '+proxyA.toJSON());
    dataProvider.putNode(proxyA, function(err, data) {
     // console.log("A "+err+" "+data);
/*
A {"locator":"DateFirstTopic","creatorId":"SystemUser","smallIcon":"","largeIcon
":"","createdDate":"2014-08-01T00:00:00","sortDate":"2014-08-01T07:00:00.000Z","
lastEditDate":"2014-07-06T19:45:08","isPrivate":"false","label":["My very first
node"],"details":["we always knew this would happen"],"instanceOf":"SortTestType
","transitiveClosure":["SortTestType"]}

 */
      //second proxy
      topicModel.newInstanceNode(lox2,type1,"First instance node","Seems likely", "en",
  			"SystemUser","","",false, credentials, function(err,data) {
        proxyB = data;
        proxyB.setDate(new Date(2014,7,2));
        console.log('B '+proxyB.toJSON()); 
        dataProvider.putNode(proxyB, function(err, data) {
 //           console.log("B "+err+" "+data);
 /*
  B {"locator":"DateSecondTopic","creatorId":"SystemUser","smallIcon":"","largeIco
n":"","createdDate":"2014-08-02T00:00:00","sortDate":"2014-08-02T07:00:00.000Z",
"lastEditDate":"2014-07-06T19:45:08","isPrivate":"false","label":["First instanc
e node"],"details":["Seems likely"],"instanceOf":"SortTestType","transitiveClosu
re":["SortTestType"]}

  */
            //third proxy
            topicModel.newInstanceNode(lox3,type1,"Second instance node","Seems likely too", "en",
        			"SystemUser","","",false, credentials, function(err,data) {
              proxyC = data;
              proxyC.setDate(new Date(2014,7,3));
              console.log('C '+proxyC.toJSON()); 
              dataProvider.putNode(proxyC, function(err, data) {
                  //console.log("C "+err+" "+data);
 /**
  C {"locator":"DateThirdTopic","creatorId":"SystemUser","smallIcon":"","largeIcon
":"","createdDate":"2014-08-03T00:00:00","sortDate":"2014-08-03T07:00:00.000Z","
lastEditDate":"2014-07-06T19:45:09","isPrivate":"false","label":["Second instanc
e node"],"details":["Seems likely too"],"instanceOf":"SortTestType","transitiveC
losure":["SortTestType"]}

  */
                  //fourth proxy
                  topicModel.newInstanceNode(lox4,type1,"Third instance node","Also Seems likely", "en",
              			"SystemUser","","",false, credentials, function(err,data) {
                    proxyD = data;
                    proxyD.setDate(new Date(2014,7,4));
                    console.log('D '+proxyD.toJSON()); 
                  dataProvider.putNode(proxyD, function(err, data) {
                     //   console.log("D "+err+" "+data);
 /*
D {"locator":"DateFourthTopic","creatorId":"SystemUser","smallIcon":"","largeIco
n":"","createdDate":"2014-08-04T00:00:00","sortDate":"2014-08-04T07:00:00.000Z",
"lastEditDate":"2014-07-06T19:45:09","isPrivate":"false","label":["Third instanc
e node"],"details":["Also Seems likely"],"instanceOf":"SortTestType","transitive
Closure":["SortTestType"]}
 
  */              		 
                    });
                  });
         		 
              });
            });
  		 
        });
      });
			
    });
  });
});