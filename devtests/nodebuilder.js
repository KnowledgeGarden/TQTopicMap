/**
 * Build a testsuite of nodes
 */
var index = require('../index')
  , constants = require('../lib/constants');

new index(function(err,data) {
  var Environment = data;
  console.log('NodeBuilder-1 '+err+" "+Environment.hello());
  var dataProvider = Environment.getDataProvider();
	
  var topicModel = Environment.getTopicModel();
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
  //build first topic
  topicModel.newNode(lox1,"My very first node", "we always knew this would happen", "en",
			"SystemUser","","",false, function(data) {
    proxyA = data;
    proxyA.setResourceUrl("http://google.com/")
    Environment.logDebug('A '+proxyA.toJSON()); //TODO logging doesn't work
    dataProvider.putNode(proxyA, function(err, data) {
      console.log("A "+err+" "+data);
      //second proxy
      topicModel.newInstanceNode(lox2,type1,"First instance node","Seems likely", "en",
  			"SystemUser","","",false, credentials, function(err,data) {
        proxyB = data;
        proxyB.addSuperClassLocator(lox5); //NOTE, this doesn't really deal with transitive closure
        proxyB.setResourceUrl("http://foo.bar");
        console.log("AB "+proxyB.toJSON());
        dataProvider.putNode(proxyB, function(err, data) {
            console.log("B "+err+" "+data);
            //third proxy
            topicModel.newInstanceNode(lox3,type1,"Second instance node","Seems likely too", "en",
        			"SystemUser","","",false, credentials, function(err,data) {
              proxyC = data;
              proxyC.setResourceUrl("http://bar.bar");
              proxyC.addSuperClassLocator(lox5); //NOTE, this doesn't really deal with transitive closure
              dataProvider.putNode(proxyC, function(err, data) {
                  console.log("C "+err+" "+data);
                  //fourth proxy
                  topicModel.newInstanceNode(lox4,type2,"Third instance node","Also Seems likely", "en",
              			"SystemUser","","",false, credentials, function(err,data) {
                    proxyD = data;
                    dataProvider.putNode(proxyD, function(err, data) {
                        console.log("D "+err+" "+data);
               		 
                    });
                  });
         		 
              });
            });
  		 
        });
      });
			
    });
  });
});