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
  this.properties.lox=locator;
};

SubjectProxy.prototype.getLocator = function() {
  return this.properties.lox;
};

SubjectProxy.prototype.addPSI = function(psi) {
	var l = this.properties.psi;
	if (!l) {l = [];}
	var where = l.indexOf(psi);
	if (where < 0) {
		l.push(psi);
		this.properties.psi = l;
	}
};

/**
 * This can return <code>undefined</code>
 * @returns {Array}
 */
SubjectProxy.prototype.listPSIs = function() {
	return this.properties.psi;
};
////////////////////////////////////////////////
// Taxonomy
//   Transitive Closure is a list of all parents "up the tree"
//     from this topic.  Maintaining that lest allows us to
//     answer an "isA" question without multiple databaes calls
//   TransitiveClosure is modeled as properties['transitiveClosure'] list
////////////////////////////////////////////////
SubjectProxy.prototype.setNodeType = function(typeLocator) {
  this.properties.inOf = typeLocator;
  var tc = this.listTransitiveClosure();
  if (!tc) {tc = [];}
  if (tc.indexOf(typeLocator) < 0) {
      tc.push(typeLocator); //watch for duplicates
  }
  this.properties.trCl = tc;
};


SubjectProxy.prototype.getNodeType = function() {
	return this.properties.inOf;
};

SubjectProxy.prototype.listTransitiveClosure = function() {
	return this.properties.trCl;
};

SubjectProxy.prototype.addTransitiveClosureFromParent = function(tcList) {
	if (tcList) {
		var tc = this.listTransitiveClosure();
		if (!tc) {
			tc = [];
		}
		var len = tcList.length;
		var tl;
		for (var i=0;i<len;i++) {
			tl = tcList[i];
			if (tc.indexOf(tl) < 0) {
				tc.push(tl); //watch for duplicates
			}
		}
		this.properties.trCl = tc;
	}
};

SubjectProxy.prototype.setConversationNodeType = function(typeLocator) {
	this.properties.conTyp = typeLocator;
};

SubjectProxy.prototype.getConversationNodeType = function() {
	return this.properties.conTyp;
};

/**
 * NOTE: use ONLY when making a new proxy
 * @param superClassLocator
 */
SubjectProxy.prototype.addSuperClassLocator = function(superClassLocator) {
  console.log('SubjectProxy.addSuperClassLocator '+superClassLocator+' '+this);
  var supx = this.properties.sbOf;
//  console.log('AAA '+supx);
  if (!supx) {
    supx = [];
    this.properties.sbOf = supx;
 }
  var where = supx.indexOf(superClassLocator);
  if (where < 0) {
    supx.push(superClassLocator);
    this.properties.sbOf = supx;
  }
  var tc = this.listTransitiveClosure();
  if (!tc) {tc = [];}
  if (tc.indexOf(superClassLocator) < 0) {
      tc.push(superClassLocator); //watch for duplicates
  }
  this.properties.trCl = tc;
};

SubjectProxy.prototype.listSuperClassLocators = function () {
  return this.properties.sbOf;
};

SubjectProxy.prototype.isA = function(locator) {
  var tclist = this.properties.trCl;
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
  this.properties.tupO = object;
};

SubjectProxy.prototype.getObject = function() {
  return this.properties.tupO;
};

SubjectProxy.prototype.setObjectType = function(typeLocator) {
  this.properties.tupOT = typeLocator;
};

SubjectProxy.prototype.getObjectType = function() {
  return this.properties.tupOT;
};

SubjectProxy.prototype.setObjectRole = function(roleLocator) {
  this.properties.tupOR = roleLocator;
};

SubjectProxy.prototype.getObjectRole = function() {
  return this.properties.tupOR;
};

SubjectProxy.prototype.setSubjectLocator = function(locator) {
  this.properties.tupS = locator;
};

SubjectProxy.prototype.getSubjectLocator = function() {
  return this.properties.tupS;
};

SubjectProxy.prototype.setSubjectType = function(typeLocator) {
  this.properties.tupST = typeLocator;
};

SubjectProxy.prototype.getSubjectType = function() {
  return this.properties.tupST;
};

SubjectProxy.prototype.setSubjectRole = function(roleLocator) {
  this.properties.tupSR = roleLocator;
};

SubjectProxy.prototype.getSubjectRole = function() {
  return this.properties.tupSR;
};

SubjectProxy.prototype.setIsTransclude = function(isTransclude) {
  var ip = 'false';
  if (isTransclude) {ip = 'true';}
  this.properties.isTrcld = ip;
};

SubjectProxy.prototype.getIsTransclude = function() {
  var ip = this.properties.isTrcld;
  if (!ip) {
    return false; // not set = default false
  }
  if (ip === 'true') {
    return true;
  }
  return false;
};

//SubjectProxy.prototype.setSignature = function(signature) {
//  this.properties[properties.TUPLE_SIGNATURE_PROPERTY] = signature;
//};

//SubjectProxy.prototype.getSignature = function() {
//  return this.properties.tupSR;
//};

SubjectProxy.prototype.addScope = function(scopeLocator) {
  var sl = this.properties.scpL;
  if (!sl) {sl = [];}
  sl.push(scopeLocator);
  this.properties.scpL = sl;
};

SubjectProxy.prototype.listScopes = function() {
  return this.properties.scpL;
};

SubjectProxy.prototype.addMergeReason = function(reason) {
  var sl = this.properties.mrgRnRlL;
  if (!sl) {sl = [];}
  sl.push(reason);
  this.properties[properties.MERGE_REASON_RULES_PROPERTY ] = sl;
};

SubjectProxy.prototype.listMergeReasons = function() {
  return this.properties.mrgRnRlL;
};

/**
* <p>A node can have one and only one merge tuple if it has been merged</p>
* <p>A VirtualNode can have many merge tuples</p>
* @param locator
*/
SubjectProxy.prototype.addMergeTupleLocator = function(locator) {
	var sl = this.properties.mrgT;
	if (!sl) {sl = [];}
	var where = sl.indexOf(locator);
	if (where < 0) {
		sl.push(locator);
		this.properties.mrgT = sl;
	}
};

/**
* Can return <code>null</code>
* @return
*/
SubjectProxy.prototype.getMergeTupleLocator = function() {
  var sl = this.properties.mrgT;
  if (sl) {return sl[0];}
  return sl;
};

/**
* For VirtualNodes
* @return
*/
SubjectProxy.prototype.listMergeTupleLocators = function() {
  return this.properties.mrgT;
};

SubjectProxy.prototype.isTuple = function() {
  if (this.getSubjectLocator()) {
    return true;
  }
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
  if (!lx) {lx = [];}
  lx.push(label);
  this.properties[key] = lx;
};

/**
 * Allow to overwrite the <em>first</em> label
 * @param label
 * @param language
 */
SubjectProxy.prototype.updateLabel = function(label,language) {
	var lan = language;
	if (!lan) {
		lan = constants.ENGLISH; // default
	}
	var key = langutils.makeLanguageLabel(lan);
//	console.log("FFF "+key);
	var lx = this.properties[key];
//	console.log("GGG "+lx);
//	console.log(JSON.stringify(this.properties));
	if (!lx) {lx = [];}
	try {
		lx[0] = label;
		this.properties[key] = lx;
	} catch (e) {
		var ux = [];
		ux.push(label);
		this.properties[key] = ux;
	}
};

SubjectProxy.prototype.addDetails = function(details,language) {
	var lan = language;
	if (!lan) {
		lan = properties.ENGLISH; // default
	}
	var key = langutils.makeLanguageDetails(lan);
	var lx = this.properties[key];
	if (!lx) {lx = [];}
	try {
		lx[0] = details;
		this.properties[key] = lx;
	} catch (e) {
		var ux = [];
		ux.push(details);
		this.properties[key] = ux;
	}
};

SubjectProxy.prototype.updateDetails = function(details,language) {
	var lan = language;
	if (!lan) {
		lan = properties.ENGLISH; // default
	}
	var key = langutils.makeLanguageDetails(lan);
	var lx = this.properties[key];
	if (!lx) {lx = [];}
	lx[0] = details;
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
  if (!rl) {
    rl = this.listLabels(constants.ENGLISH);
  }
  if (rl) {
    return rl[0];
  }
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
  if (!rl) {
    rl = this.listDetails(constants.ENGLISH);
  }
  if (rl) {
    return rl[0];
  }
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
	dateFormat(new Date(), 'isoDateTime'),
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
	dateFormat(new Date(), 'isoDateTime'),userLocator, comment);
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
	dateFormat(new Date(), 'isoDateTime'),userLocator, "");
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
	dateFormat(new Date(), 'isoDateTime'),userLocator, comment);
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
//Pivots: special kinds of relations, mostly: authorship, tags, and documents
//InfoBox: a way to capture microstructures which describe specific topic properties
////////////////////////////////////

SubjectProxy.prototype.putInfoBox = function(name, jsonString) {
	var l = this.properties.infL;
	if (!l) {l = {};}
	l[name] = jsonString;
	this.properties.infL = l;
};

/**
 * @param name
 * @return can return undefined
 */
SubjectProxy.prototype.getInfoBox = function(name) {
	var l = this.properties.infL;
	var result;
	if (l) {
		result = l[name];
	}
	return result;
};

SubjectProxy.prototype.removeInfoBox = function(name) {
	var l = this.properties.infL;
	if (l) {
		l[name] = "";
		this.properties.infL = l;
	}
};

SubjectProxy.prototype.getInfoBoxes = function() {
	return this.properties.infL;
};

SubjectProxy.prototype.addPivot = function(relationType, relationLabel,
		documentSmallIcon,targetLocator, targetLabel, nodeType, sORt) {
	console.log('SubjectProxy.addPivot '+documentSmallIcon+' '+relationType+' '+relationLabel+
					targetLocator+' '+targetLabel+" "+nodeType);
	var rx = struct(relationType,relationLabel,
		documentSmallIcon, targetLocator, targetLabel, nodeType,sORt);
	var l = this.properties.pvL;
	if (!l) {l = [];}
	//look for duplicates
	var len = l.length;
	var tx;
	var notFound = true;
	for (var i=0;i<len;i++) {
		tx = l[i];
		if (tx.relationType === relationType) {
			if (tx.locator === targetLocator) {
				notFound = false;
				break;
			}
		}
	}
	if (notFound) {
		l.push(rx);
	}
	this.properties.pvL = l;
};
SubjectProxy.prototype.addRestrictedPivot = function(relationType, relationLabel,
		documentSmallIcon,targetLocator, targetLabel, nodeType, sORt) {
	console.log('SubjectProxy.addPivot '+documentSmallIcon+' '+relationType+' '+relationLabel+
					targetLocator+' '+targetLabel+" "+nodeType);
	var rx = struct(relationType,relationLabel,
		documentSmallIcon, targetLocator, targetLabel, nodeType,sORt);
	var l = this.properties.rpvL;
	if (!l) {l = [];}
	//look for duplicates
	var len = l.length;
	var tx;
	var notFound = true;
	for (var i=0;i<len;i++) {
		tx = l[i];
		if (tx.relationType === relationType) {
			if (tx.locator === targetLocator) {
				notFound = false;
				break;
			}
		}
	}
	if (notFound) {
		l.push(rx);
	}
	this.properties.rpvL = l;
};

/**
 * List pivots
 * @param relationType can be undefined; returns all
 * @returns {Array}
 */
SubjectProxy.prototype.listPivotsByRelationType = function(relationType) {
	var result = [];
	var relns = this.properties.pvL;
	if (!relns) {
		return result; // return empty
	}
	// if nothing specified, return all
	if (!relationType) {
		return relns;
	}
	var len = relns.length;
	var r;
	for (var i=0;i<len;i++) {
		r = relns[i];
		if (r.relationType === relationType) {
			result.push(r);
		}
	}
	return result;
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
* @param documentSmallIcon
* @param targetLocator
* @param targetLabel
* @param nodeType
* @param sOrt:  "s" if target is source in the relation; "t" if target is target in the relation
*/
SubjectProxy.prototype.addRelation = function(relationType, relationLabel,
		documentSmallIcon,targetLocator, targetLabel, nodeType, sORt) {
	console.log('SubjectProxy.addRelation '+documentSmallIcon+' '+relationType+' '+relationLabel+
				targetLocator+' '+targetLabel);
	var rx = struct(relationType,relationLabel,
			documentSmallIcon, targetLocator, targetLabel, nodeType, sORt);
  
	if (!this.properties.tpL) {
		this.properties.tpL = [];
	}
	//look for duplicates
	var len = this.properties.tpL.length;
	var tx;
	var notFound = true;
	for (var i=0;i<len;i++) {
		tx = this.properties.tpL[i];
		if (tx.relationType === relationType) {
			if (tx.locator === targetLocator) {
				notFound = false;
				break;
			}
		}
	}
	if (notFound) {
		this.properties.tpL.push(rx);
		//update count
		var ct = this.properties[properties.TUPLE_COUNT];
		if (!ct) {ct = 0;}
		ct ++;
		this.properties[properties.TUPLE_COUNT] = ct;
	}
};

SubjectProxy.prototype.listRelations = function() {
  return this.properties.tpL;
};

/**
 * NOT FOR PUBLIC CONSUMPTION
 */
SubjectProxy.prototype.__listAllRelations = function() {
	var result = [];
	var x = this.properties.tpl;
	var len, i;
	if (x) {
		result = x;
	}
	x = this.properties.tplr;
	if (x) {
		if (result.length === 0) {
			result = x;
		} else {
			len = x.length;
			for (i=0;i<len;i++) {
				result.push(x[i]);
			}
		}
	}
	return result;
};

SubjectProxy.prototype.addRestrictedRelation = function(relationType, relationLabel,
		documentSmallIcon,targetLocator, targetLabel, nodeType, sORt) {
	console.log('SubjectProxy.addRestrictedRelation '+documentSmallIcon+' '+relationType+' '+relationLabel+
					targetLocator+' '+targetLabel);
	var rx = struct(relationType,relationLabel,
		documentSmallIcon, targetLocator, targetLabel, nodeType,sORt);
	if (!this.properties.tpLr) {
		this.properties.tpLr = [];
	}
	//look for duplicates
	var len = this.properties.tpLr.length;
	var tx;
	var notFound = true;
	for (var i=0;i<len;i++) {
		tx = this.properties.tpLr[i];
		if (tx.relationType === relationType) {
			if (tx.locator === targetLocator) {
				notFound = false;
				break;
			}
		}
	}
	if (notFound) {
		this.properties.tpLr.push(rx);
		//update count
		var ct = this.properties[properties.TUPLE_COUNT];
		if (!ct) {ct = 0;}
			ct ++;
			this.properties[properties.TUPLE_COUNT] = ct;
		}
	};

	SubjectProxy.prototype.listRestrictedRelations = function() {
		return this.properties.tpLr;
	};


/**
* Return a list of relations of type <code>relationType</code>
* @param relationType
* @returns {Array}
*/
SubjectProxy.prototype.listRelationsByRelationType = function(relationType) {
	var result = [];
	var relns = this.properties.tpL;
	if (!relns) {
		return result; // return empty
	}
	var len = relns.length;
	var r;
	for (var i=0;i<len;i++) {
		r = relns[i];
		if (r.relationType === relationType) {
			result.push(r);
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
* @param smallIcon
* @param locator
* @param subject
* @param transcluderLocator
*/
SubjectProxy.prototype.addChildNode = function(contextLocator, smallIcon, locator,subject, transcluderLocator) {
 console.log('SubjectProxy.addChildNode '+locator+' '+subject);
 var struct = new childstruct(contextLocator,locator,subject,smallIcon, transcluderLocator);
 if (!this.properties.cNL) {
   this.properties.cNL = [];
 }
 //NOTE: not looking for duplicates
 this.properties.cNL.push(struct);
};

/**
* Return a list of all child nodes according to <code>contextLocator</code>
* @param contextLocator: returns all if no contextLocator; can return undefined
*/
SubjectProxy.prototype.listChildNodes = function(contextLocator) {
	var lx = this.properties.cNL;
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
* Add a parent node to this topic: this builds a conversation tree.
* @param smallIcon
* @param locator
* @param subject
*/
SubjectProxy.prototype.addParentNode = function(contextLocator, smallIcon, locator,subject) {
 console.log('SubjectProxy.addParentNode '+locator+' '+subject);
 var struct = new childstruct(contextLocator,locator,subject,smallIcon);
 if (!this.properties.pNL) {
   this.properties.pNL = [];
 }
 //NOTE: not looking for duplicates
 this.properties.pNL.push(struct);
};

/**
* Return a list of all parent nodes according to <code>contextLocator</code>
* @param contextLocator: returns all if no contextLocator
*/
SubjectProxy.prototype.listParentNodes = function(contextLocator) {
	var lx = this.properties.pNL;
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

/////////////////////////////////////////////////
//ACLS
/////////////////////////////////////////////////
SubjectProxy.prototype.addACLValue = function(value) {
	var l = this.properties.rstns;
	if (!l) {l = [];}
	if (l.indexOf(value) < 0) {
		l.push(value);
	}
	this.properties.rstns = l;
};

SubjectProxy.prototype.removeACLValue = function(value) {
	var l = this.properties.rstns;
	if (l) {
		var where = l.indexOf(value);
		if (where > -1) {
			l.splice(where,0);
			this.properties.rstns = l;
		}
	}
};

SubjectProxy.prototype.listACLValues = function() {
	return this.properties.rstns;
};

/////////////////////////////////////////////////
// Other properties
/////////////////////////////////////////////////

/**
 * General purpose for any key outside the current typology:
 * value could be a string or an array
 */
SubjectProxy.prototype.setProperty = function(key, value) {
	this.properties[key] = value;
};

SubjectProxy.prototype.getProperty = function(key) {
	return this.properties[key];
};

SubjectProxy.prototype.setResourceUrl = function(url) {
  this.properties.url = querystring.escape(url);
};
SubjectProxy.prototype.getResourceUrl = function() {
	var result = this.properties.url;
	if (result) {
		result = querystring.unescape(result);
	}
	return result;
};

SubjectProxy.prototype.setCreatorId = function(creatorId) {
  this.properties.crtr = creatorId;
};
SubjectProxy.prototype.getCreatorId = function() {
  return this.properties.crtr;
};
SubjectProxy.prototype.setImage = function(imagePath) {
  this.properties.lIco = imagePath;
};
SubjectProxy.prototype.getImage = function() {
  return this.properties.lIco;
};
SubjectProxy.prototype.setSmallImage = function(imagePath) {
  this.properties.sIco = imagePath;
};
SubjectProxy.prototype.getSmallImage = function() {
  return this.properties.sIco;
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
  this.properties.crDt = dateFormat(date, 'isoDateTime');
  //sortDate is a long value for sorting on dates
  this.properties.srtDt = date.getTime();
};

SubjectProxy.prototype.getDate = function() {
  //@see https://github.com/litejs/date-format-lite
  return this.properties.crDt;
};

/**
 * For diagnostic use
 * @returns
 */
SubjectProxy.prototype.getSortDate = function() {
  return this.properties.srtDt;
};

SubjectProxy.prototype.setLastEditDate = function(date) {
  this.properties.lEdDt = dateFormat(date, 'isoDateTime');
};
SubjectProxy.prototype.getLastEditDate = function() {
  return this.properties.lEdDt;
};
SubjectProxy.prototype.setIsPrivate = function(isPrivate) {
  var ip = 'false';
  if (isPrivate) {
    ip = 'true';
  }
  this.properties.isPrv = ip;
};
SubjectProxy.prototype.getIsPrivate = function() {
  var ip = this.properties.isPrv;
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