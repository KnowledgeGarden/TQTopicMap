/**
 * TopicModel
 */
var SubjectProxy = require('../models/subjectproxy');

var TopicModel = module.exports = function(environment) {
	this.dataProvider = environment.getDataProvider();
	console.log('TopicModel '+this.dataProvider);
};

/**
 * 
 * @param locator
 * @param label
 * @param description
 * @param lang
 * @param userId
 * @param smallImagePath
 * @param largeImagePath
 * @param isPrivate
 * @param callback: signature (data)
 */
TopicModel.prototype.newSimpleNode = function(locator, label, description,
			 lang,  userId,  smallImagePath,
			 largeImagePath,  isPrivate, callback) {
	console.log('BB '+locator);
	var result = new SubjectProxy();
	result.setLocator(locator);
	result.setCreatorId(userId);
	var now = new Date();
	result.setDate(now);
	result.setLastEditDate(now);
	result.setIsPrivate(isPrivate);
	if (label)
		result.addLabel(label, lang);
	if (description)
		result.addDetails(description, lang);
	console.log('CC '+result.toJSON());
	//TODO much more
	callback(result);
};

TopicModel.prototype.newNode = function(label, description,
		 				lang,  userId,  smallImagePath,
		 				largeImagePath,  isPrivate, callback) {
	var lox = this.dataProvider.uuid();
	console.log('AA '+lox);
	this.newSimpleNode(lox,label,description,lang,userId,smallImagePath,largeImagePath,isPrivate,function(data) {
		callback(data);
	});
};