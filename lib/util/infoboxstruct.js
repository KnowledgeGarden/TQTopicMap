/**
 * infoboxstruct.js
 */
var struct = module.exports = function(name, creatorId, date, lastEditDate) {
	var result = {};
	result.creator = creatorId;
	result.dat = date;
	result.leDat = lastEditDate;
	result.name = name;
	return result;
};