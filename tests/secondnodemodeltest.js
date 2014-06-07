/**
 * secondnodemodeltest
 */
var env = require('../lib/environment'),
    nm = require('../lib/models/topicmodel');

var TopicMapEnvironment = new env();
var TopicModel = TopicMapEnvironment.getTopicModel();


TopicModel.newSubclassNode("SomeSuperClass","Bonjour","sa va?","fr","park",null,null,false, function(data) {
	console.log('AA');
	console.log(data.toJSON());
	
//	{"locator":"5e33b880-ee02-11e3-b76f-4786fc874e52","creatorId":"park","createdDat
//		e":"2014-12-06 22:06:48","lastEditDate":"2014-12-06 22:06:48","isPrivate":"false
//		","labelfr":["Bonjour"],"detailsfr":["sa va?"],"subOf":["SomeSuperClass"]}

});
TopicModel.newSimpleSubclassNode("MyThirty", "SomeSuperClass","Bonjour","sa va?","fr","park",null,null,false, function(data) {
	console.log('BB');
	console.log(data.toJSON());
//	{"locator":"MyThirty","creatorId":"park","createdDate":"2014-12-06 22:06:48","la
//		stEditDate":"2014-12-06 22:06:48","isPrivate":"false","labelfr":["Bonjour"],"det
//		ailsfr":["sa va?"],"subOf":["SomeSuperClass"]}
});
TopicModel.newInstanceNode("SomeParentClass","Bonjour","sa va?","fr","park",null,null,false, function(data) {
	console.log('CC');
	console.log(data.toJSON());
//	{"locator":"5e33b880-ee02-11e3-b76f-4786fc874e52","creatorId":"park","createdDat
//		e":"2014-12-06 22:06:48","lastEditDate":"2014-12-06 22:06:48","isPrivate":"false
//		","labelfr":["Bonjour"],"detailsfr":["sa va?"],"subOf":["SomeParentClass"]}
});
TopicModel.newSimpleInstanceNode("MyThirtyOne","SomeParentClass","Bonjour","sa va?","fr","park",null,null,false, function(data) {
	console.log('DD');
	console.log(data.toJSON());
//	{"locator":"MyThirtyOne","creatorId":"park","createdDate":"2014-12-06 22:06:48",
//		"lastEditDate":"2014-12-06 22:06:48","isPrivate":"false","labelfr":["Bonjour"],"
//		detailsfr":["sa va?"],"subOf":["SomeParentClass"]}
});
