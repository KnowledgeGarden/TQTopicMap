/**
 * constants
 */
///////////////////////////
// language defaults
///////////////////////////
module.exports.ENGLISH				= 'en';
///////////////////////////
//User stuff
///////////////////////////
module.exports.GUEST_USER				= "guest";
module.exports.SYSTEM_USER 				= "SystemUser";
module.exports.SYSTEM_USER_PASSWORD 	= "SystemUser!";
module.exports.ADMIN_CREDENTIALS	= "AdminCred";

///////////////////////////
//ElasticSearch
// We define a single index and a single type
// The system can be generalized to several indices and types
///////////////////////////
module.exports.TOPIC_INDEX		= "topics",
module.exports.CORE_TYPE		= "core";
///////////////////////////
// Identity strings
///////////////////////////
module.exports.TAG_SUFFIX = "_TAG";
