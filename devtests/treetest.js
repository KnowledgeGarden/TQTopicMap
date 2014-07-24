/**
 * treetest
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
	var lox1 = "NodeBuilderFirstTopic";
	var type1 = "QuestionType";
	var type2 = "AnswerType";
	var credentials = []; 
	credentials.push("SystemUser");
	//Build a context Node.
	topicModel.newNode(lox1,"The Earth is flat", 
			"This is general context for a conversation", "en",
				"SystemUser","","",false, function(data) {
		var contextNode = data;
		//Context for this conversation
		var contextLocator = contextNode.getLocator();
		var childNode1, childNode2;
		//save it -- must save it for the rest of tree building to find it
		dataProvider.putNode(contextNode,function(err,data) {
			var error = "";
			if (err) {error += err;}
			console.log("AAA "+error+" "+contextNode);
			// build a conversation node child
			topicModel.createTreeNode(contextLocator,
					contextNode,
					"", type1,"Is it true the Earth is flat?", 
					"Some statements seem absurd.", "en","","",
					credentials,"SystemUser", false, function(err,data) {
				if (err) {error += err;}
				childNode1 = data;
				console.log("BBB "+error+" "+childNode1);
				//save it
				dataProvider.putNode(childNode1,function(err,data) {
					if (err) {error += err;}
					//create a new node as child to that one
					topicModel.createTreeNode(contextLocator,childNode1,
							null, type2,"I suspect that's a false statement", 
							"As stated, some statement seem absurd.", "en","","",
							credentials,"SystemUser", false, function(err,data) {
						if (err) {error += err;}
						childNode2 = data;
						console.log("CCC "+error+" "+childNode1);
						//save it
						dataProvider.putNode(childNode1, function(err,data) {
							if (err) {error += err;}
							console.log("DDD "+contextNode.toJSON());
							console.log("EEE "+childNode1.toJSON());
							console.log("FFF "+childNode2.toJSON());
						});
					});
				});
			});
		});
	});
});
