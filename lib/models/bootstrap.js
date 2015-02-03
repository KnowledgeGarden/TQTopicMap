/**
 * Bootstrap
 */
var SubjectProxy = require('../models/subjectproxy')
  , types	= require('../types')
  , icons = require('../icons')
  , fs = require('fs')
  , constants = require('../constants')
;
var Bootstrap = module.exports = function(environment) {
	var dataProvider = environment.getDataProvider();
	var topicModel = environment.getTopicModel();
	var english = constants.English;
	var user = constants.SYSTEM_USER;
	var credentials = [];
	credentials.push(constants.SYSTEM_USER);

	var cursorA, cursorB;
	/**
	 * Read a JSON topicmap bootstrap file
	 */
	var bootFile = function(file, callback) {
		environment.logDebug("BOOTING "+file);
		environment.logDebug("Bootstrap.bootfile "+file);
		fs.readFile(file,'utf8', function (err, data) {
			environment.logDebug("BOOTING-1 "+err+" "+data);
			var error = '',
				jsonx = JSON.parse(data);
			environment.logDebug("BOOTING-2 "+JSON.stringify(jsonx));
			var jsonlist = jsonx.nodes,
				len = jsonlist.length;
			environment.logDebug("BOOTING-2A "+len);
			var json;
			cursorA = 0;
			function loop() {
//				console.log("BOOTING-4 "+cursorA);
				if (cursorA >= len) {
					environment.logDebug("BOOTING-2A RETURN");
					return callback(error);
				}
				json = jsonlist[cursorA++];
//				console.log("BOOTING-5 "+JSON.stringify(json));
				if (!json.comment) {
					environment.logDebug("BOOTING-3 "+json.lox);
					var lox = json.lox;
					dataProvider.nodeExists(lox, function(err, result) {
						environment.logDebug("BOOTING-4 "+result);
						if (!result) {
							topicModel.nodeFromJSON(json, function(err) {
								if (err) {error+=err;}
								environment.logDebug("BOOTING-5 "+json.lox+" | "+err);
								loop();
							});
						} else {
							loop();				
						}
					});
				} else {
					loop();
				}
			}
			loop();
		});
	};
	/**
	 * Load all json files in /bootstrap directory
	 */
	var load = function(bdir, callback) {
		var error = '';
		var path1 = __dirname+bdir;
		var path = __dirname+bdir+"/";

		console.log("Bootstrap path "+path);
		var fileArray = fs.readdirSync(path1);
		console.log("Bootstrap.load "+fileArray.length);
		if (fileArray) {
			var len = fileArray.length;
			//diagnostics
		//	for (var i=0;i<len;i++) {
		//		environment.logDebug("Bootstrap.load-1 "+fileArray[i]);
		//	}
			cursorB = 0;
			console.log("Bootstrap.load-a "+cursorB);
			var fx;
			function loop() {
				environment.logDebug("Bootstrap.load-2 "+cursorB+" "+len);
				if (cursorB >= len) {
					return callback(error);
				}
//				console.log("Bootstrap.load-2 "+cursorB);
				fx = fileArray[cursorB++];
				environment.logDebug("Bootstrap.load-3 "+fx);
				// only load json files
				if (fx.indexOf(".json") > -1) {
					bootFile(path+fx, function(err) {
						if (err) {error+=err;}
						loop();
					});
				} else {
					loop();
				}
			};
			loop();
		} else {
			callback(error);
		}
	};

	var self = this;
	/**
	 * Load all bootstraps
	 * @param bdir  directory where bootstrap is found
	 * @param callback signature = err;
	 */
	self.bootstrap = function(bdir, callback) { //
		environment.logDebug("Bootstrap.bootstrap "+bdir);
		load(bdir, function(err) {
			environment.logDebug("Bootstrap.bootstrap booted "+bdir+" | "+err);
			return callback(err);
		});
	};
	

};