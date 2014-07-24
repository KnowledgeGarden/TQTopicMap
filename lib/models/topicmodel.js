/**
 * TopicModel
 */
var SubjectProxy = require('../models/subjectproxy')
  , types	= require('../types')
  , constants = require('../constants')
;

var TopicModel = module.exports = function(environment) {
  var dataProvider = environment.getDataProvider();
  console.log('TopicModel '+ dataProvider);
  var defaultCredentials = [];
  defaultCredentials.push(constants.SYSTEM_USER);
  var self = this;


  /**
   * Create a new SubjectProxy 
   * @param locator can be ''
   * @param label
   * @param description
   * @param lang
   * @param userLocator
   * @param smallImagePath
   * @param largeImagePath
   * @param isPrivate
   * @param callback: signature (err,data)
   */
  self.newNode = function(locator, label, description,
		  lang,  userLocator,  smallImagePath,
		  largeImagePath,  isPrivate, callback) {
    var result = new SubjectProxy();
    var lox = locator;
    if (!lox || lox === '' || lox === null || lox === "" || lox.length === 0) {
      lox =  dataProvider.uuid();
    }
    result.setLocator(lox);
    result.setCreatorId(userLocator);
    result.setSmallImage(smallImagePath);
    result.setImage(largeImagePath);
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
    console.log('TopicModel.newNode '+result.toJSON());
    return callback(result);
  };

  /**
   * Create a new SubjectProxy as a subclass of <code>superClassLocator</code>
   * @param locator can be ''
   * @param superClassLocator
   * @param label
   * @param description
   * @param lang
   * @param userLocator
   * @param smallImagePath
   * @param largeImagePath
   * @param isPrivate
   * @param credentials
   * @param callback: signature (err,data)
   */
  self.newSubclassNode = function(locator, superClassLocator, label, description,
			lang,  userLocator,  smallImagePath,
			largeImagePath,  isPrivate, credentials,callback) {
    var result;
    self.newNode(locator,label,description,lang,userLocator,smallImagePath,largeImagePath,
    		isPrivate,function(data) {
      result = data;
      result.addSuperClassLocator(superClassLocator);
      dataProvider.getNodeByLocator(superClassLocator,credentials, function(err,rx) {
        //in some cases, this is looking for a node which doesn't exist
        console.log('TopicModel.newSubclassNode-1 '+err+' '+rx);
        if (err) {
        	environment.logError("TM:newSubclassNode.getNodeByLocator "+superClassLocator+" "+locator+" "+err);
        }
        if (rx) {
          var tcList = rx.listTransitiveClosure();
          if (tcList) {
            result.addTransitiveClosureFromParent(tcList);
          }
        }
        console.log('TopicModel.newSubclassNode '+result.toJSON());
        callback(err, result);
      });
    });
  };


  /**
   * Create a new SubjectProxy as an instance of <code>superClassLocator</code>
   * @param locator can be ''
   * @param typeLocator
   * @param label
   * @param description
   * @param lang
   * @param userLocator
   * @param smallImagePath
   * @param largeImagePath
   * @param isPrivate
   * @param credentials
   * @param callback: signature (err,data)
   */
  self.newInstanceNode = function(locator,typeLocator, label, description,
			lang,  userLocator,  smallImagePath,
			largeImagePath,  isPrivate, credentials,callback) {
    var result;
    self.newNode(locator,label,description,lang,userLocator,smallImagePath,largeImagePath,
    		isPrivate,function(data) {
      result = data;
      result.setNodeType(typeLocator);
      console.log('TopicModel.newInstanceNode '+result.toJSON());
      dataProvider.getNodeByLocator(typeLocator, credentials, function(err,rx) {
        //in some cases, this is looking for a node which doesn't exist
        console.log('TopicModel.newInstanceNode-1 '+err+' '+rx);
        if (rx) {
          var tcList = rx.listTransitiveClosure();
          if (tcList) {
            result.addTransitiveClosureFromParent(tcList);
          }
        }
        console.log('TopicModel.newInstanceNode-2 '+result.toJSON());
        callback(err,result);
      });
    });
  };
  
  /**
   * Check for duplicate relation
   * @param topic
   * @param relationType
   * @param targetLocator
   * @return <code>true</code> if relation exists
   */
  self.__hasRelation = function(topic, relationType, targetlocator) {
	var relns = topic.listRelationsByRelationType(relationType);
	if (!relns) { return false;}
	var len = relns.length;
	var r;
	for (var i=0;i<len;i++) {
		r = relns[i];
		if (r.lox === targetlocator) {return true;}
	}
	return false;
  },

  /**
   * <p>Create a <em>tuple</cod> which relates <code>sourceNode</code>
   * with <code>targetNode</code> as an instance of <code>relationTypeLocator</code></p>
   * NOTE: if relation exists, callback returns <code>null</code>. Otherwise, it returns
   * the signature of the new relation node;
   * @param sourceNode
   * @param tartegNode
   * @param relationTypeLocator
   * @param userLocator
   * @param smallImagePath
   * @param largeImagePath
   * @param isTransclude
   * @param isPrivate
   * @param credentials
   * @param callback: signature (err,data)
   */
  self.relateExistingNodes = function(sourceNode, targetNode,
			relationTypeLocator, userLocator, smallImagePath,
			largeImagePath, isTransclude, isPrivate, credentials, callback) {
	if (self.__hasRelation(sourceNode,relationTypeLocator, targetNode.getLocator())) {
		callback(null, null);
		return;
	}
    //doing something new here: using the signature as the relation's locator
    var signature = sourceNode.getLocator()+relationTypeLocator+targetNode.getLocator();
    var details = sourceNode.getLocator()+" "+relationTypeLocator+" "+targetNode.getLocator();
    //Craft the tuple
    var errors='';
    var tuple;
    console.log('TopicModel.relateExistingNodes '+signature+' '+relationTypeLocator);
    self.newInstanceNode(signature,relationTypeLocator, relationTypeLocator,details,
			  constants.ENGLISH,userLocator, smallImagePath, largeImagePath,isPrivate, credentials, function(err,data) {
      tuple = data;
      tuple.setIsTransclude(isTransclude);
      tuple.setSubjectLocator(sourceNode.getLocator());
      tuple.setObject(targetNode.getLocator());
      tuple.setObjectType(types.NODE_TYPE);
      tuple.setSubjectType(types.NODE_TYPE);
//      tuple.setSignature(signature);
      //Now, wire the two actor nodes
      //relationType, relationLabel,documentSmallIcon,targetLocator, targetLabel
      sourceNode.addRelation(relationTypeLocator,relationTypeLocator,targetNode.getSmallImage(),
				targetNode.getLocator(),targetNode.getLabel(constants.ENGLISH));
      targetNode.addRelation(relationTypeLocator,relationTypeLocator,sourceNode.getSmallImage(),
				sourceNode.getLocator(),sourceNode.getLabel(constants.ENGLISH));
      //Now, save these puppies
       dataProvider.putNode(tuple, function(err,data) {
        if (err) {errors += err;}
         dataProvider.putNode(sourceNode, function(err,data) {
          if (err) {errors += err;}
           dataProvider.putNode(targetNode, function(err,data) {
            if (err) {errors += err;}
            callback(errors,signature);
          });
        });
      });
    });
  },
  
  /**
   * Create a <em>tuple</cod> which relates <code>sourceNode</code>
   * with <code>targetNode</code> as an instance of <code>relationTypeLocator</code>
   * @param sourceNode
   * @param tartegNode
   * @param relationTypeLocator
   * @param userLocator
   * @param smallImagePath
   * @param largeImagePath
   * @param isTransclude
   * @param isPrivate
   * @param callback: signature (err,data)
   */
  self.relateNewNodes = function(sourceNode, targetNode,
			 relationTypeLocator,  userLocator,  smallImagePath,
			 largeImagePath,  isTransclude,  isPrivate, callback) {
	  //TODO
  },
  
  /**
   * Create a <em>tuple</cod> which relates the proxy identified by <code>sourceNodeLocator</code>
   * with the proxy identified by <code>targetNodeLocator</code> 
   * as an instance of <code>relationTypeLocator</code>
   * @param sourceNodeLocator
   * @param targetNodeLocator
   * @param relationTypeLocator
   * @param userLocator
   * @param smallImagePath
   * @param largeImagePath
   * @param isTransclude
   * @param isPrivate
   * @param callback: signature (err,data)
   */
  self.relateNodes = function(sourceNodeLocator, targetNodeLocator,  relationTypeLocator,
			 userLocator,  smallImagePath,  largeImagePath,
			 isTransclude,  isPrivate ) {
	  //TODO
  },
  
  ///////////////////////////////////////////////
  // Tree Structure Support
  ///////////////////////////////////////////////
  
  /**
   * Returns a fresh proxy that is already saved.
   * This is not intended to be used for creation of context documents.
   * @param contextLocator  cannot be <code>null</code>
   * @param parentNode can be the same as the context node
   * @newLocator  can be <code>null</code> or <code>""</code>
   * @nodeType  required
   * @param subject required
   * @param body  optional
   * @param language required
   * @param smallIcon required
   * @param largeIcon required
   * @param credentials required
   * @param userLoctaor required
   * @param isPrivate
   * @param callback signature = (err,result)
   */
  self.createTreeNode = function(contextLocator, parentNode,
		  newLocator, nodeType, subject, body, language, smallIcon, largeIcon,
		  credentials, userLocator, isPrivate, callback) {
	  //Create an instance of nodeType with no label or details
	  self.newInstanceNode(newLocator,nodeType,"","",language,userLocator,
			  smallIcon,largeIcon,isPrivate,credentials, function(err,result) {
		  var newNode = result;
		  var error = "";
		  if (err) {error += err;}
		  //Add subject and body to it
		  newNode.setSubject(subject,language,userLocator);
		  if (body != null && body.length > 0) {
			  newNode.setBody(body,language,userLocator);
		  }
		  //ADD parent structure to it
		  //This could be a plain SubjectProxy with labels, or it could be an AIR
		  //with subject values
		  var parentSubject = parentNode.getSubject(language);
		  if (!parentSubject || parentSubject === null || parentSubject === "") {
			  var parentLabel = parentNode.getLabel(language);
			  if (parentLabel && parentLabel.length > 0) {
				  parentSubject = parentLabel;
			  } else {
				  parentLabel = "No subject found";
			  }
		  } else {
			  //pluck the text out of the structure
			  parentSubject = parentSubject.theText;
		  }
		  newNode.addParentNode(contextLocator,parentNode.getSmallImage(),
				  parentNode.getLocator(),parentSubject);
		  //now save it
		  dataProvider.putNode(newNode, function(err,data) {
			  if (err) {error += err;}
			//deal with parent node
			//ADD child structure to it
			 parentNode.addChildNode(contextLocator,newNode.getSmallImage(),
					 newNode.getLocator(),subject);
			//save it
			dataProvider.putNode(result, function(err,data) {
				if (err) {error += err;}
				callback(error,newNode);
			});
		  });		  
	  });
  },

  ///////////////////////////////////////////////
  // Used only for reading bootstrap JSON files
  ///////////////////////////////////////////////
  /**
   * example:	{"locator":"TypeType", "label":"Type type","details":"Topic Map root type","smallIcon":"/images/cogwheel_sm.png""largeIcon":"/images/cogwheel.png"},
   * @param json per the example
   * @param callback signature (err)
   */
  self.nodeFromJSON = function(json, callback) {
	  console.log("TopicModel.nodeFromJSON "+JSON.stringify(json));
	  self.newNode(json.lox,json.label,json.details,constants.ENGLISH,
			  constants.SYSTEM_USER,json.sIco,json.lIco,false, function(data){
		  console.log("TopicModel.nodeFromJSON-1 "+json.lox);
		  if (json.trCl) {
			  data.addTransitiveClosureFromParent(json.trCl);
		  }
		  console.log("TopicModel.nodeFromJSON-2 "+json.lox);
		  if (json.sbOf) {
			  data.addSuperClassLocator(json.sbOf);
		  }
		  console.log("TopicModel.nodeFromJSON-3 "+json.lox);
		  dataProvider.putNode(data,function(err,data) {
			  callback(err);
		  });
	  });
  };
};

