/**
 * childstruct
 * A structure for parent or child nodes which gives them context
 * @param contextLocator
 * @param locator
 * @param subject
 * @param smallImagePath
 * @param transcluderLocator  (optional)
 */
var struct = module.exports = function(contextLocator, locator,
			                           subject, smallImagePath, transcluderLocator) {
	var result = {};
	//contextLocator is typically the conversationRootLocator
	result.contextLocator = contextLocator;
	result.locator = locator;
	result.subject = subject;
	result.smallImagePath = smallImagePath;
    if (transcluderLocator) { 
        result.transcluder = transcluderLocator;
    }
	return result;
};