/**
 * SubjectProxy
 * <p>A class which serves the purpose of <em>knowledge representation</em>; each
 * instance is a representation of, a proxy for a <em>subject</em></p>
 */
var dateFormat = require('dateformat')
  , constants	= require('../constants')
  , querystring = require('querystring')
  , struct = require('../util/relnstruct')
  , airstruct = require('../util/airstruct')
  , childstruct = require('../util/childstruct')
  , langutils = require('../util/propertylanguageutils')
  , properties = require('../properties');


function SubjectProxy(props) {
//	console.log('SubjectProxy '+props);
  if (props) {
    this.properties = props;
  } else {
    this.properties = {};
  }
//	console.log('SubjectProxy+ '+this);
}
///////////////////////////////////////////////
// THERE is every reason to believe that we might
//  need to use querystring.encode and unencode on details fields
//  in case they contain URLs.  
// TODO: test for that
///////////////////////////////////////////////
///////////////////////////////////////////////
// Subject Identity:
//   Based on several components:
//      A LOCATOR which is a unique identifier in the database
//      Location in a taxonomy:
//			Type (instanceOf)
//			SuperClass (subclassOf)
//			Relations  (links to Tuples)
///////////////////////////////////////////////
// A Tuple is a SubjectProxy which forms the equivalent
//  of a TRIPLE:
//		{subject, predicate, object}
///////////////////////////////////////////////
/**
 * A <code>locator</code> is a <em>UUID</em> for this
 * object; it is an identifier.
 * @param locator
 */
SubjectProxy.prototype.setLocator =function(locator) {
  this.properties[properties.LOCATOR]=locator;
};

SubjectProxy.prototype.getLocator = function() {
  return this.properties[properties.LOCATOR];
};
////////////////////////////////////////////////
// Taxonomy
//   Transitive Closure is a list of all parents "up the tree"
//     from this topic.  Maintaining that lest allows us to
//     answer an "isA" question without multiple databaes calls
//   TransitiveClosure is modeled as properties['transitiveClosure'] list
////////////////////////////////////////////////
SubjectProxy.prototype.setNodeType = function(typeLocator) {
  this.properties[properties.INSTANCE_OF] = typeLocator;
  var tc = this.listTransitiveClosure();
  if (!tc)
    tc = [];
  tc.push(typeLocator);
  this.properties[properties.TRANSITIVE_CLOSURE] = tc;
};


SubjectProxy.prototype.getNodeType = function() {
	return this.properties[properties.INSTANCE_OF];
};

SubjectProxy.prototype.listTransitiveClosure = function() {
	return this.properties[properties.TRANSITIVE_CLOSURE];
}

SubjectProxy.prototype.addTransitiveClosureFromParent = function(tcList) {
  if (tcList) {
    var tc = this.listTransitiveClosure();
    if (!tc)
      tc = [];
    var len = tcList.length;
    var tl;
    for (var i=0;i<len;i++) {
      tl = tcList[i];
      if (tc.indexOf(tl) < 0)
        tc.push(tl); //watch for duplicates
    }
    this.properties[properties.TRANSITIVE_CLOSURE] = tc;
  }
};

SubjectProxy.prototype.setConversationNodeType = function(typeLocator) {
	this.properties[properties.CONVERSATION_NODE_TYPE] = typeLocator;	
};

SubjectProxy.prototype.getConversationNodeType = function() {
	return this.properties[properties.CONVERSATION_NODE_TYPE];
};

/**
 * NOTE: use ONLY when making a new proxy
 * @param superClassLocator
 */
SubjectProxy.prototype.addSuperClassLocator = function(superClassLocator) {
  console.log('SubjectProxy.addSuperClassLocator '+superClassLocator+' '+this);
  var supx = this.properties[properties.SUB_OF];
//  console.log('AAA '+supx);
  if (!supx) {
    supx = [];
  }
  var where = supx.indexOf(superClassLocator);
  //console.log('XXX '+where+ " | "+supx);
  if (where < 0) {
    supx.push(superClassLocator);
    this.properties[properties.SUB_OF] = supx;
  }
  var tc = this.listTransitiveClosure();
  if (!tc)
    tc = [];
    tc.push(superClassLocator);
  this.properties[properties.TRANSITIVE_CLOSURE] = tc;
};

SubjectProxy.prototype.listSuperClassLocators = function () {
  return this.properties[properties.SUB_OF];
};

SubjectProxy.prototype.isA = function(locator) {
  var tclist = this.properties[properties.TRANSITIVE_CLOSURE];
  if (!tclist) {
    return false;
  }
  var where = tclist.indexOf(locator);
  return (where > -1);
};

///////////////////////////////////////////////
//A Tuple is a Topic which forms the equivalent
//of a TRIPLE:
//		{subject, predicate, object}
///////////////////////////////////////////////

SubjectProxy.prototype.setObject = function(object) {
  this.properties[properties.TUPLE_OBJECT_PROPERTY] = object;
};

SubjectProxy.prototype.getObject = function() {
  return this.properties[properties.TUPLE_OBJECT_PROPERTY];
};

SubjectProxy.prototype.setObjectType = function(typeLocator) {
  this.properties[properties.TUPLE_OBJECT_TYPE_PROPERTY] = typeLocator;
};

SubjectProxy.prototype.getObjectType = function() {
  return this.properties[properties.TUPLE_OBJECT_TYPE_PROPERTY];
};

SubjectProxy.prototype.setObjectRole = function(roleLocator) {
  this.properties[properties.TUPLE_OBJECT_ROLE_PROPERTY] = roleLocator;
};

SubjectProxy.prototype.getObjectRole = function() {
  return this.properties[properties.TUPLE_OBJECT_ROLE_PROPERTY];
};

SubjectProxy.prototype.setSubjectLocator = function(locator) {
  this.properties[properties.TUPLE_SUBJECT_PROPERTY] = locator;
};

SubjectProxy.prototype.getSubjectLocator = function() {
  return this.properties[properties.TUPLE_SUBJECT_PROPERTY];
};

SubjectProxy.prototype.setSubjectType = function(typeLocator) {
  this.properties[properties.TUPLE_SUBJECT_TYPE_PROPERTY] = typeLocator;
};

SubjectProxy.prototype.getSubjectType = function() {
  return this.properties[properties.TUPLE_SUBJECT_TYPE_PROPERTY];
};

SubjectProxy.prototype.setSubjectRole = function(roleLocator) {
  this.properties[properties.TUPLE_SUBJECT_ROLE_PROPERTY] = roleLocator;
};

SubjectProxy.prototype.getSubjectRole = function() {
  return this.properties[properties.TUPLE_SUBJECT_ROLE_PROPERTY];
};

SubjectProxy.prototype.setIsTransclude = function(isTransclude) {
  var ip = 'false';
  if (isTransclude) {
    ip = 'true';
  }
  this.properties[properties.TUPLE_IS_TRANSCLUDE_PROPERTY] = ip;
};

SubjectProxy.prototype.getIsTransclude = function() {
  var ip = this.properties[properties.TUPLE_IS_TRANSCLUDE_PROPERTY];
  if (!ip) {
    return false; // not set = default false
  }
  if (ip === 'true') {
    return true;
  }
  return false;
};

SubjectProxy.prototype.setSignature = function(signature) {
  this.properties[properties.TUPLE_SIGNATURE_PROPERTY] = signature;
};

SubjectProxy.prototype.getSignature = function() {
  return this.properties[properties.TUPLE_SUBJECT_ROLE_PROPERTY];
};

SubjectProxy.prototype.addScope = function(scopeLocator) {
  var sl = this.properties[properties.SCOPE_LIST_PROPERTY_TYPE];
  if (!sl)
    sl = [];
  sl.push(scopeLocator);
  this.properties[properties.SCOPE_LIST_PROPERTY_TYPE] = sl;
};

SubjectProxy.prototype.listScopes = function() {
  return this.properties[properties.SCOPE_LIST_PROPERTY_TYPE];
};

SubjectProxy.prototype.addMergeReason = function(reason) {
  var sl = this.properties[properties.MERGE_REASON_RULES_PROPERTY];
  if (!sl)
    sl = [];
  sl.push(reason);
  this.properties[properties.MERGE_REASON_RULES_PROPERTY ] = sl;
},

SubjectProxy.prototype.listMergeReasons = function() {
  return this.properties[properties.MERGE_REASON_RULES_PROPERTY];
};

/**
* <p>A node can have one and only one merge tuple if it has been merged</p>
* <p>A VirtualNode can have many merge tuples</p>
* @param locator
*/
SubjectProxy.prototype.addMergeTupleLocator = function(locator) {
  var sl = this.properties[properties.MERGE_TUPLE_PROPERTY];
  if (!sl)
    sl = [];
  sl.push(locator); //TODO check for duplicates
  this.properties[properties.MERGE_TUPLE_PROPERTY ] = sl;
};

/**
* Can return <code>null</code>
* @return
*/
SubjectProxy.prototype.getMergeTupleLocator = function() {
  var sl = this.properties[properties.MERGE_TUPLE_PROPERTY];
  if (sl)
    return sl[0];
  return sl;
};

/**
* For VirtualNodes
* @return
*/
SubjectProxy.prototype.listMergeTupleLocators = function() {
  return this.properties[properties.MERGE_TUPLE_PROPERTY];
};

SubjectProxy.prototype.isTuple = function() {
  if (this.getSubjectLocator())
    return true;
  return false;
};

/////////////////////////////////////////////////
//Text data
/////////////////////////////////////////////////
SubjectProxy.prototype.addLabel = function(label, language) {
  var lan = language;
  if (!lan) {
    lan = constants.ENGLISH; // default
  }
  var key = langutils.makeLanguageLabel(lan);
  var lx = this.properties[key];
  if (!lx) {
    lx = [];
  }
  lx.push(label);
  this.properties[key] = lx;
};

SubjectProxy.prototype.addDetails = function(details,language) {
  var lan = language;
  if (!lan) {
    lan = properties.ENGLISH; // default
  }
  var key = langutils.makeLanguageDetails(lan);
  var lx = this.properties[key];
  if (!lx) {
    lx = [];
  }
  lx.push(details);
  this.properties[key] = lx;	
};

SubjectProxy.prototype.listLabels = function(language) {
  var lan = language;
  if (!lan) {
    lan = constants.ENGLISH; // default
  }
  return this.properties[langutils.makeLanguageLabel(lan)];
};

SubjectProxy.prototype.listDetails = function(language) {
  var lan = language;
  if (!lan) {
    lan = constants.ENGLISH; // default
  }
  return this.properties[langutils.makeLanguageDetails(lan)];
};

/**
 * Fetch the first label for given <code>language</code>.
 * If nothing, try to return first label for English
 * @param language
 * @return : can return <em>undefined</em>
 */
SubjectProxy.prototype.getLabel = function(language) {
  var rl = this.listLabels(language);
  if (!rl)
    rl = this.listLabels(constants.ENGLISH);
  if (rl)
    return rl[0];
  return rl;
};

/**
 * Fetch the first details for given <code>language</code>.
 * If nothing, try to return first details for English
 * @param language
 * @return : can return <em>undefined</em>
 */
SubjectProxy.prototype.getDetails = function(language) {
  var rl = this.listDetails(language);
  if (!rl)
    rl = this.listDetails(constants.ENGLISH);
  if (rl)
    return rl[0];
  return rl;
};
/////////////////////////////
//AIR subjects and bodies are sensitive to provenance
//so we model them with a structure which includes:
//-- the text itself
//-- lastEditDate (the AIR itself has a createdDate and lastEditDate)
//-- userLocator
//-- edit comments
/////////////////////////////
/**
* An AIR has one and only one <code>subjectString</code> per
* </code>language</code>
* @param subjectString
* @param language
* @param userLocator
*/
SubjectProxy.prototype.setSubject = function(subjectString, language, userLocator) {
  var prop = langutils.makeLanguageSubject(language);
  var struct = new airstruct(subjectString,
		  dateFormat(newDate(), 'isoDateTime'),
		  userLocator, "");
  this.properties[prop] = struct;
};

/**
* Fetch this AIR's subject: NOTE: this returns
* the struct; to get the text itself, you use
* <pre>struct.theText</pre>
* @param language
* @returns
*/
SubjectProxy.prototype.getSubject = function(language) {
  var prop = langutils.makeLanguageSubject(language);
  return this.properties[prop];
};

SubjectProxy.prototype.updateSubject = function(updatedSubject, language, userLocator, comment) {
  var prop = langutils.makeLanguageSubject(language);
  var struct = new airstruct(updatedSubject,
		dateFormat(newDate(), 'isoDateTime'),
			  userLocator, comment);
  var verProp = langutils.makeLanguageSubjectVersion(language);
  var vl = this.properties[verProp];
  if (!vl) { vl = [];}
  //get the old one
  var vold = this.properties[prop];
  //push it to the end of the version list (first is oldest)
  vl.push(vold);
  //replace current
  this.properties[prop] = struct;
};

SubjectProxy.prototype.listSubjectVersions = function(language) {
  var verProp = langutils.makeLanguageSubjectVersion(language);
  return this.properties[verProp];
};

/**
* An AIR has one and only one <code>bodyString</code> per
* <code>language</code>.
* @param bodyString
* @param language
* @param userLocator
*/
SubjectProxy.prototype.setBody = function(bodyString, language, userLocator) {
  var prop = langutils.makeLanguageBody(language);
  var struct = new airstruct(bodyString,
		dateFormat(newDate(), 'isoDateTime'),
		  userLocator, "");
  this.properties[prop] = struct;
};

/**
* Fetch this AIR's body: NOTE: this returns
* the struct; to get the text itself, you use
* <pre>struct.theText</pre>
* @param language
* @returns
*/
SubjectProxy.prototype.getBody= function(language) {
  var prop = langutils.makeLanguageBody(language);
  return this.properties[prop];
};

SubjectProxy.prototype.updateBody = function(updatedBody, language, userLocator, comment) {
  var prop = langutils.makeLanguageBody(language);
  var struct = new airstruct(updatedBody,
		  dateFormat(newDate(), 'isoDateTime'),
		  userLocator, comment);
  var verProp = langutils.makeLanguageBodyVersion(language);
  var vl = this.properties[verProp];
  if (!vl) { vl = [];}
  //get the old one
  var vold = this.properties[prop];
  //push it to the end of the version list (first is oldest)
  vl.push(vold);
  //replace current
  this.properties[prop] = struct;
};

SubjectProxy.prototype.listBodyVersions = function(language) {
  var verProp = langutils.makeLanguageBodyVersion(language);
  return this.properties[verProp];
};

////////////////////////////////////
//Graph Relations: these use Tuples
//  to create subjects from each relation
////////////////////////////////////
/**
* <p>Add a modeled relation to this topic.</p>
* <p>Relations are modeled as a JSON object, with fields used
* according to the type of relation.</p>
* <p>There are two model types: <em>SimpleRelationType</em> and
* <em>ComplexRelationType</em>.</p>
* @param relationType
* @param relationLabel
//* @param documentType,
* @param documentSmallIcon
* @param targetLocator
* @param targetLabel
*/
SubjectProxy.prototype.addRelation = function(relationType, relationLabel, //documentType,
                       documentSmallIcon,
						  targetLocator, targetLabel) {
  console.log('SubjectProxy.addRelation '+documentSmallIcon+' '+relationType+' '+relationLabel+
				targetLocator+' '+targetLabel);
  var rx = struct(relationType,relationLabel,//documentType,
 		documentSmallIcon, targetLocator, targetLabel);
  if (!this.properties[properties.TUPLE_LIST_PROPERTY])
	  this.properties[properties.TUPLE_LIST_PROPERTY] = [];
  this.properties[properties.TUPLE_LIST_PROPERTY].push(rx);
  //update count
  var ct = this.properties[properties.TUPLE_COUNT];
  if (!ct) {ct = 0;}
  ct ++;
  this.properties[properties.TUPLE_COUNT] = ct;
};

SubjectProxy.prototype.listRelations = function() {
  return this.properties[properties.TUPLE_LIST_PROPERTY];
};

/**
* Return a list of relations of type <code>relationType</code>
* @param relationType
* @returns {Array}
*/
SubjectProxy.prototype.listRelationsByRelationType = function(relationType) {
var result = [];
var relns = this.properties[properties.TUPLE_LIST_PROPERTY];
if (!relns)
 return result; // return empty
var len = relns.length;
var r;
for (var i=0;i<len;i++) {
 r = relns[i];
 if (r.relationType === relationType) {
   result.push(r)
 }
}
return result;
};

///////////////////////////
// Tree Relations: this is a parent-child relationship
// which does not use tuples
///////////////////////////
/**
* Add a child node to this topic: this builds a conversation tree.
* @param childSmallIcon
* @param childLocator
* @param childLabel
*/
SubjectProxy.prototype.addChildNode = function(contextLocator, childSmallIcon, childLocator,childLabel) {
 console.log('SubjectProxy.addChildNode '+childLocator+' '+childLabel);
 var struct = new childstruct(contextLocator,childLocator,childLabel,childSmallIcon);
 if (!this.properties[properties.CONVERSATION_NODE_TYPE])
   this.properties[properties.CONVERSATION_NODE_TYPE] = [];
 this.properties.children.push(struct);
};

/**
* Return a list of all child nodes according to <code>contextLocator</code>
* @param contextLocator: returns all if no contextLocator
*/
SubjectProxy.prototype.listChildNodes = function(contextLocator) {
	var lx = this.properties[properties.CONVERSATION_NODE_TYPE];
	if (!contextLocator) { return lx; }
	var result;
	if (lx) {
		var len = lx.length;
		result = [];
		for (var i=0;i<len;i++) {
			if (lx[i].contextLocator === contextLocator) {
				result.push(lx[i]);
			}
		}
	}
	return result;
};

/**
 * This is really a shortcut for listChildNodes
 * @returns {Array}
 */
SubjectProxy.prototype.listChildNodesByConversation = function() {
	
	var contextLocator = this.properties[properties.CONVERSATION_ROOT];
	return listChildNodes(contextLocator);
};

/**
 * A <em>conversation</em> is rooted in a <em>Map</em> node.<br/>
 * We need to select child nodes according to the conversation parent.<br/>
 * This allows to <em>transclused</em> one node into diffeent conversations,
 * to reuse the node in diffeent contexts, without confusing subtrees.
 * @param rootLocator
 */
SubjectProxy.prototype.setConversationRoot = function(rootLocator) {
	this.properties[properties.CONVERSATION_ROOT] = rootLocator;
};

SubjectProxy.prototype.getConversationRoot = function() {
	return this.properties[properties.CONVERSATION_ROOT];
};

/////////////////////////////////////////////////
// Other properties
/////////////////////////////////////////////////
SubjectProxy.prototype.setResourceUrl = function(url) {
  this.properties[properties.URL] = querystring.escape(url);
};
SubjectProxy.prototype.getResourceUrl = function() {
	var result = this.properties[properties.URL];
	if (result) {
		result = querystring.unescape(result);
	}
	return result;
};

SubjectProxy.prototype.setCreatorId = function(creatorId) {
  this.properties[properties.CREATOR_ID] = creatorId;
};
SubjectProxy.prototype.getCreatorId = function() {
  return this.properties[properties.CREATOR_ID];
};
SubjectProxy.prototype.setImage = function(imagePath) {
  this.properties[properties.LARGE_ICON] = imagePath;
};
SubjectProxy.prototype.getImage = function() {
  return this.properties[properties.LARGE_ICON];	
};
SubjectProxy.prototype.setSmallImage = function(imagePath) {
  this.properties[properties.SMALL_ICON] = imagePath;
};
SubjectProxy.prototype.getSmallImage = function() {
  return this.properties[properties.SMALL_ICON];	
};

//////////////////////////////////////
// For dates, we are switching to isoDateTime
//  which is ISO8601.
// We can use the same format in JSONTopicMap
//////////////////////////////////////
/**
 * @param date: Date
 */
SubjectProxy.prototype.setDate = function(date) {
  //@see https://github.com/litejs/date-format-lite
  this.properties[properties.CREATED_DATE] = dateFormat(date, 'isoDateTime');
  //sortDate is a long value for sorting on dates
  this.properties[properties.SORT_DATE] = date.getTime();
};

SubjectProxy.prototype.getDate = function() {
  //@see https://github.com/litejs/date-format-lite
  return this.properties[properties.CREATED_DATE];	
};

/**
 * For diagnostic use
 * @returns
 */
SubjectProxy.prototype.getSortDate = function() {
  return this.properties[properties.SORT_DATE];	
};

SubjectProxy.prototype.setLastEditDate = function(date) {
  this.properties[properties.LAST_EDIT_DATE] = dateFormat(date, 'isoDateTime');
};
SubjectProxy.prototype.getLastEditDate = function() {
  return this.properties[properties.LAST_EDIT_DATE];	
};
SubjectProxy.prototype.setIsPrivate = function(isPrivate) {
  var ip = 'false';
  if (isPrivate) {
    ip = 'true';
  }
  this.properties[properties.IS_PRIVATE] = ip;	
};
SubjectProxy.prototype.getIsPrivate = function() {
  var ip = this.properties[properties.IS_PRIVATE];
  if (!ip) {
    return false; // not set = default false
  }
  if (ip === 'true') {
    return true;
  }
  return false;
};


SubjectProxy.prototype.toJSON = function() {
  return JSON.stringify(this.properties);
};

//Export last to capture all the methods
module.exports = SubjectProxy;