/**
 * TopicModel
 */
var SubjectProxy = require('../models/subjectproxy');

var TopicModel = module.exports = function(environment, dp) {
	this.dataProvider = dp;
	console.log('TopicModel '+this.dataProvider);
	var self = this; 

  /**
   * create a new SubjectProxy
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
//	  console.log("11 "+locator+" | "+label+" | "+description+" | "+lang+" | "+userId+" | "+smallImagePath+" | "+largeImagePath+" | "+isPrivate);
	var result = new SubjectProxy();
	result.setLocator(locator);
	result.setCreatorId(userId);
	var now = new Date();
	result.setDate(now);
	result.setLastEditDate(now);
	result.setIsPrivate(isPrivate);
	if (label) {
		result.addLabel(label, lang);
	}
	if (description) {
		result.addDetails(description, lang);
	}
	//TODO much more
	callback(result);
  };

  /**
   * Create a new SubjectProxy 
   * @param label
   * @param description
   * @param lang
   * @param userId
   * @param smallImagePath
   * @param largeImagePath
   * @param isPrivate
   * @param callback: signature (err,data)
   */
  self.newNode = function(label, description,
		 				lang,  userId,  smallImagePath,
		 				largeImagePath,  isPrivate, callback) {
	  var lox = this.dataProvider.uuid();
	  self.newSimpleNode(lox,label,description,lang,userId,smallImagePath,largeImagePath,
			  isPrivate,function(data) {
	    callback(data);
	  });
  };

  /**
   * Create a new SubjectProxy as a subclass of <code>superClassLocator</code>
   * @param superClassLocator
   * @param label
   * @param description
   * @param lang
   * @param userId
   * @param smallImagePath
   * @param largeImagePath
   * @param isPrivate
   * @param callback: signature (err,data)
   */
 self.newSubclassNode = function(superClassLocator, label, description,
			lang,  userId,  smallImagePath,
			largeImagePath,  isPrivate, callback) {
//	  console.log("22 "+superClassLocator+" | "+label+" | "+description+" | "+lang+" | "+userId+" | "+smallImagePath+" | "+largeImagePath+" | "+isPrivate);
	  self.newNode(label,description,lang,userId,smallImagePath,largeImagePath,
			  isPrivate,function(data) {
		data.addSuperClassLocator(superClassLocator);
	    callback(data);
	  });
  };
  /**
   * Create a new SubjectProxy as a subclass of <code>superClassLocator</code>
   * @param locator
   * @param superClassLocator
   * @param label
   * @param description
   * @param lang
   * @param userId
   * @param smallImagePath
   * @param largeImagePath
   * @param isPrivate
   * @param callback: signature (err,data)
   */
  self.newSimpleSubclassNode = function(locator, superClassLocator, label, description,
				lang,  userId,  smallImagePath,
				largeImagePath,  isPrivate, callback) {
	  self.newSimpleNode(locator,label,description,lang,userId,smallImagePath,largeImagePath,
			  isPrivate,function(data) {
	    data.addSuperClassLocator(superClassLocator);
	    callback(data);
	  });
  };

  /**
   * Create a new SubjectProxy as an instance of <code>superClassLocator</code>
   * @param superClassLocator
   * @param label
   * @param description
   * @param lang
   * @param userId
   * @param smallImagePath
   * @param largeImagePath
   * @param isPrivate
   * @param callback: signature (err,data)
   */
  self.newInstanceNode = function(superClassLocator, label, description,
			lang,  userId,  smallImagePath,
			largeImagePath,  isPrivate, callback) {
	  self.newNode(label,description,lang,userId,smallImagePath,largeImagePath,
			  isPrivate,function(data) {
		data.addSuperClassLocator(superClassLocator);
	    callback(data);
	  });
  };
  
  /**
   * Create a new SubjectProxy as an instance of <code>superClassLocator</code>
   * @param locator
   * @param superClassLocator
   * @param label
   * @param description
   * @param lang
   * @param userId
   * @param smallImagePath
   * @param largeImagePath
   * @param isPrivate
   * @param callback: signature (err,data)
   */  
  self.newSimpleInstanceNode = function(locator, superClassLocator, label, description,
				lang,  userId,  smallImagePath,
				largeImagePath,  isPrivate, callback) {
	  self.newSimpleNode(locator,label,description,lang,userId,smallImagePath,largeImagePath,
			  isPrivate,function(data) {
	    data.addSuperClassLocator(superClassLocator);
	    callback(data);
	  });
  };
  
  /**
   * Create a <em>tuple</cod> which relates <code>sourceNode</code>
   * with <code>targetNode</code> as an instance of <code>relationTypeLocator</code>
   * @param sourceNode
   * @param tartegNode
   * @param relationTypeLocator
   * @param userId
   * @param smallImagePath
   * @param largeImagePath
   * @param isTransclude
   * @param isPrivate
   * @param callback: signature (err,data)
   */
  self.relateExistingNodes = function(sourceNode, targetNode,
			relationTypeLocator, userId, smallImagePath,
			largeImagePath, isTransclude, isPrivate, callback) {
	  //TODO
  };
  
  /**
   * Create a <em>tuple</cod> which relates <code>sourceNode</code>
   * with <code>targetNode</code> as an instance of <code>relationTypeLocator</code>
   * @param sourceNode
   * @param tartegNode
   * @param relationTypeLocator
   * @param userId
   * @param smallImagePath
   * @param largeImagePath
   * @param isTransclude
   * @param isPrivate
   * @param callback: signature (err,data)
   */
  self.relateNewNodes = function(sourceNode, targetNode,
			 relationTypeLocator,  userId,  smallImagePath,
			 largeImagePath,  isTransclude,  isPrivate, callback) {
	  //TODO
  };
  
  /**
   * Create a <em>tuple</cod> which relates the proxy identified by <code>sourceNodeLocator</code>
   * with the proxy identified by <code>targetNodeLocator</code> 
   * as an instance of <code>relationTypeLocator</code>
   * @param sourceNodeLocator
   * @param targetNodeLocator
   * @param relationTypeLocator
   * @param userId
   * @param smallImagePath
   * @param largeImagePath
   * @param isTransclude
   * @param isPrivate
   * @param callback: signature (err,data)
   */
  self.relateNodes = function(sourceNodeLocator, targetNodeLocator,  relationTypeLocator,
			 userId,  smallImagePath,  largeImagePath,
			 isTransclude,  isPrivate ) {
	  //TODO
  };
};

