/**
 * Index to boot Environment and give you a copy of it by way of callback
 * This is how you use TQTopicMap:
 * <pre>
 * var index = require("./<path to index.js>);
 * new index(function(err, Environment) {
 *  <your code using Environment goes here>
 *  };
 *  We need to boot from here to maintain internal hardwired paths
 *  to: 
 *    config.json
 *    /log/<logfile>
 *    mappings.json
 */
var env = require("./lib/environment");

/**
 * @param callback: signature = (err, Environment)
 */
var Index = module.exports = function(callback) {
	console.log("STARTING ");
	new env(callback);
};