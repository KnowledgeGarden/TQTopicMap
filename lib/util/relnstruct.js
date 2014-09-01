/**
 * Relation Struct
 */

/**
 * @param relationType
 * @param relationLabel
 * @param documentSmallIcon (for display)
 * @param documentLocator
 * @param documentLabel
 * @param documentType  for pivots, is nodetype, for relations, is transcludeUser if any
 */
var struct = module.exports = function(relationType, relationLabel,documentSmallIcon,
			                           documentLocator, documentLabel, documentType) {
	var result = {};
	result.relationType = relationType;
	result.relationLabel = relationLabel;
	result.documentType = documentType;
	result.icon = documentSmallIcon;
	result.locator = documentLocator;
	result.label = documentLabel;
	return result;
};