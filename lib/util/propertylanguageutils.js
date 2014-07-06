/**
 * proplanguageutils
 */
var constants = require('../constants')
  , properties = require('../properties');

module.exports.makeLanguageLabel = function(language) {
	if (language === constants.ENGLISH) {
		return properties.LABEL;
	}
	return properties.LABEL+language;
};
module.exports.makeLanguageDetails = function (language) {
	if (language === constants.ENGLISH) {
		return properties.DETAILS;
	}
	return properties.DETAILS+language;
};
module.exports.makeLanguageSubject =  function (language) {
	if (language === constants.ENGLISH) {
		return properties.AIR_SUBJECT_PROPERTY;
	}
	return properties.AIR_SUBJECT_PROPERTY+language;
};
module.exports.makeLanguageBody = function (language) {
	if (language === constants.ENGLISH) {
		return properties.AIR_BODY_PROPERTY;
	}
	return properties.AIR_BODY_PROPERTY+language;
};
module.exports.makeLanguageSubjectVersion = function (language) {
	if (language === constants.ENGLISH) {
		return properties.AIR_SUBJECT_VERSION_PROPERTY;
	}
	return properties.AIR_SUBJECT_VERSION_PROPERTY+language;
};
module.exports.makeLanguageBodyVersion =  function (language) {
	if (language === constants.ENGLISH) {
		return properties.AIR_Body_VERSION_PROPERTY;
	}
	return properties.AIR_BODY_VERSION_PROPERTY+language;
};