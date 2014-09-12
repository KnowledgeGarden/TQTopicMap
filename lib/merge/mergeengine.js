/**
 * MergeEngine
 */
var SubjectProxy = require('../models/subjectproxy')
	, tcp = require('../util/jsonsocketserver')
;

var MergeEngine = module.exports = function(environment, srvr) {
	var environment = environment;
	var JSONSocketServer = srvr;
	var NEW_DOCUMENT = "NewDocument";
	console.log('MergeEngine starting '+ JSONSocketServer);
	var self = this;
	/**
	 * Ship a NewDocument-tagged proxy to listener
	 * @param proxy  a JSON object
	 */
	self.onNewProxy = function(proxy) {
		console.log("MergeEngine--- "+JSONSocketServer);
		var json = {};
		json.tag = NEW_DOCUMENT;
		json.cargo = proxy;
		console.log('MergeEngine.onNewProxy '+proxy.getLocator());
		JSONSocketServer.addMessage(json);
	};
};

