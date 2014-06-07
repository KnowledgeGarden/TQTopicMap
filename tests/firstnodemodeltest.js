/**
 * New node file
 */
var env = require('../lib/environment'),
    nm = require('../lib/models/topicmodel');

var TopicMapEnvironment = new env();
var TopicModel = TopicMapEnvironment.getTopicModel();

//label, description,lang,  userId,  smallImagePath,largeImagePath,  isPrivate
TopicModel.newNode("foo","something to say","en","park",null,null,false, function(data) {
	console.log(data.toJSON());

});

TopicModel.newSimpleNode("MyFirstTopicTest","Bonjour","sa va?","fr","park",null,null,false, function(data) {
	console.log(data.toJSON());

});

/*

{
    "locator": "3dc53500-ec50-11e3-8f18-c34b4b889a24",
    "creatorId": "park",
    "createdDate": "2014-25-04 18:06:12",
    "lastEditDate": "2014-25-04 18:06:12",
    "isPrivate": "false",
    "label": [
        "foo"
    ],
    "details": [
        "something to say"
    ]
}

{
    "locator": "MyFirstTopicTest",
    "creatorId": "park",
    "createdDate": "2014-28-04 18:06:16",
    "lastEditDate": "2014-28-04 18:06:16",
    "isPrivate": "false",
    "labelfr": [
        "Bonjour"
    ],
    "detailsfr": [
        "sa va?"
    ]
}
 */
	