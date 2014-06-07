/**
 * TopicModel
 */
var SubjectProxy = require('../models/subjectproxy');

var TopicModel = module.exports = function(environment) {
	this.dataProvider = environment.getDataProvider();
	console.log('TopicModel '+this.dataProvider);
	var self = this; 

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
  self.newSimpleNode = function(locator, label, description,
			 lang,  userId,  smallImagePath,
			 largeImagePath,  isPrivate, callback) {
	  console.log("11 "+locator+" | "+label+" | "+description+" | "+lang+" | "+userId+" | "+smallImagePath+" | "+largeImagePath+" | "+isPrivate+" | "+callback);
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
	//TODO much more
	callback(result);
  };

  self.newNode = function(label, description,
		 				lang,  userId,  smallImagePath,
		 				largeImagePath,  isPrivate, callback) {
	  var lox = this.dataProvider.uuid();
	  self.newSimpleNode(lox,label,description,lang,userId,smallImagePath,largeImagePath,isPrivate,function(data) {
	    callback(data);
	  });
  };

  self.newSubclassNode = function(superClassLocator, label, description,
			lang,  userId,  smallImagePath,
			largeImagePath,  isPrivate, callback) {
	  console.log("22 "+superClassLocator+" | "+label+" | "+description+" | "+lang+" | "+userId+" | "+smallImagePath+" | "+largeImagePath+" | "+isPrivate+" | "+callback);
	  self.newNode(label,description,lang,userId,smallImagePath,largeImagePath,isPrivate,function(data) {
		data.addSuperClassLocator(superClassLocator);
	    callback(data);
	  });
  };
  self.newSimpleSubclassNode = function(locator, superClassLocator, label, description,
				lang,  userId,  smallImagePath,
				largeImagePath,  isPrivate, callback) {
	  self.newSimpleNode(locator,label,description,lang,userId,smallImagePath,largeImagePath,isPrivate,function(data) {
	    data.addSuperClassLocator(superClassLocator);
	    callback(data);
	  });
  };
  self.newInstanceNode = function(superClassLocator, label, description,
			lang,  userId,  smallImagePath,
			largeImagePath,  isPrivate, callback) {
	  self.newNode(label,description,lang,userId,smallImagePath,largeImagePath,isPrivate,function(data) {
		data.addSuperClassLocator(superClassLocator);
	    callback(data);
	  });
  };
  self.newSimpleInstanceNode = function(locator, superClassLocator, label, description,
				lang,  userId,  smallImagePath,
				largeImagePath,  isPrivate, callback) {
	  self.newSimpleNode(locator,label,description,lang,userId,smallImagePath,largeImagePath,isPrivate,function(data) {
	    data.addSuperClassLocator(superClassLocator);
	    callback(data);
	  });
  };
};

