/**
 * SubjectProxy
 * <p>A class which serves the purpose of <em>knowledge representation</em>; each
 * instance is a representation of, a proxy for a <em>subject</em></p>
 */
var dateFormat = require('dateformat')
   ,constants	= require('../constants')
   ,properties = require('../properties');


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
	//TODO: deal with transitive closure
};
SubjectProxy.prototype.getNodeType = function() {
	return this.properties[properties.INSTANCE_OF];
};
SubjectProxy.prototype.addSuperClassLocator = function(superClassLocator) {
	console.log('SubjectProxy.addSuperClassLocator '+superClassLocator+' '+this);
	var supx = this.properties[properties.SUB_OF];
	console.log('AAA '+supx);
	if (!supx) {
		supx = [];
	}
	var where = supx.indexOf(superClassLocator);
	console.log('XXX '+where+ " | "+supx);
	if (where < 0) {
		supx.push(superClassLocator);
		this.properties[properties.SUB_OF] = supx;
	}
	//TODO: deal with transitive closure
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
/////////////////////////////////////////////////
// Text data
/////////////////////////////////////////////////
function makeLanguageLabel(language) {
	if (language === constants.ENGLISH) {
		return properties.LABEL;
	}
	return properties.LABEL+language;
};
function makeLanguageDetails(language) {
	if (language === constants.ENGLISH) {
		return properties.DETAILS;
	}
	return properties.DETAILS+language;
};

SubjectProxy.prototype.addLabel = function(label, language) {
	var lan = language;
	if (!lan) {
		lan = constants.ENGLISH; // default
	}
	var key = makeLanguageLabel(lan);

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
	var key = makeLanguageDetails(lan);
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
	return this.properties[makeLanguageLabel(lan)];
};
SubjectProxy.prototype.listDetails = function(language) {
	var lan = language;
	if (!lan) {
		lan = constants.ENGLISH; // default
	}
	return this.properties[makeLanguageDetails(lan)];
};

/////////////////////////////////////////////////
// Other properties
/////////////////////////////////////////////////
SubjectProxy.prototype.setResourceUrl = function(url) {
	this.properties['url'] = url;
};
SubjectProxy.prototype.getResourceUrl = function() {
	return this.properties['url'];
};

SubjectProxy.prototype.setCreatorId = function(creatorId) {
	this.properties['creatorId'] = creatorId;
};
SubjectProxy.prototype.getCreatorId = function() {
	return this.properties['creatorId'];
};
SubjectProxy.prototype.setImage = function(imagePath) {
	this.properties['largeIcon'] = imagePath;
};
SubjectProxy.prototype.getImage = function() {
	return this.properties['largeIcon'];	
};
SubjectProxy.prototype.setSmallImage = function(imagePath) {
	this.properties['smallIcon'] = imagePath;
};
SubjectProxy.prototype.getSmallImage = function() {
	return this.properties['smallIcon'];	
};
SubjectProxy.prototype.setDate = function(date) {
	//@see https://github.com/litejs/date-format-lite
	this.properties['createdDate'] = dateFormat(date, 'yyyy-MM-dd HH:mm:ss');
};
SubjectProxy.prototype.getDate = function() {
	//@see https://github.com/litejs/date-format-lite
	return this.properties['createdDate'].date();	
};
SubjectProxy.prototype.setLastEditDate = function(date) {
	this.properties['lastEditDate'] = dateFormat(date, 'yyyy-MM-dd HH:mm:ss');
};
SubjectProxy.prototype.getLastEditDate = function() {
	return this.properties['lastEditDate'].Date();	
};
SubjectProxy.prototype.setIsPrivate = function(isPrivate) {
	var ip = 'false';
	if (isPrivate) {
		ip = 'true';
	}
	this.properties['isPrivate'] = ip;	
};
SubjectProxy.prototype.getIsPrivate = function() {
	var ip = this.properties['isPrivate'];
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

module.exports = SubjectProxy;