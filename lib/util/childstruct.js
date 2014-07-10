/**
 * childstruct
 * A structure for child nodes which gives them context
 * @param contextLocator
 * @param childLocator
 * @param childLabel
 * @param childSmallImagePath
 */
var struct = module.exports = function(contextLocator, childLocator,
			                           childLabel, childSmallImagePath) {
	var result = {};
	//contextLocator is typically the conversationRootLocator
	result.contextLocator = contextLocator;
	result.childLocator = childLocator;
	result.childLabel = childLabel;
	result.childSmallImagePath = childSmallImagePath;
	return result;
};