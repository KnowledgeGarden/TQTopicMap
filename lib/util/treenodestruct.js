/**
 * treenodestruct
 * For collecting conversation trees from root
 * Based on ITreeNode
 */

/**
 * @param locator -- the node's locator
 * @param lable -- the node's label/subject
 * @param smallImage
 * @param nodetype
 * @param subs -- list of subclasses -- doubles for childnodes of a tree node
 * @param instances -- list of instances when used in a taxonomoy
 */
var struct = module.exports = function(locator, label, smallImage, nodetype, subs,
			                           instances, children) {
	var result = {};
	result.locator = locator;
	result.label = label;
	result.img = smallImage;
	result.subs = subs;
	result.typ = nodetype;
	result.instances = instances;
	result.children = children;
	return result;
};