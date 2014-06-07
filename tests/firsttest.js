/**
 * first boot test
 */
var env = require('../lib/environment');

var TopicMapEnvironment = module.exports = new env();
console.log('Environment '+TopicMapEnvironment);
console.log('Database '+TopicMapEnvironment.getDatabase());
console.log('DataProvider '+TopicMapEnvironment.getDataProvider());
console.log('TopicModel '+TopicMapEnvironment.getTopicModel());