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
		console.log("BOOTING "+file);
		environment.logDebug("Bootstrap.bootfile "+file);
		fs.readFile(file,'utf8', function (err, data) {
			console.log("BOOTING-1 "+err+" "+data);
			var error = '';
			var jsonx = JSON.parse(data);
			console.log("BOOTING-2 "+JSON.stringify(jsonx));
			var jsonlist = jsonx.nodes;
			var len = jsonlist.length;
	//		console.log("BOOTING-3 "+len+" "+JSON.stringify(jsonlist));
			var json;
			cursorA = 0;
			function loop() {
//				console.log("BOOTING-4 "+cursorA);
				if (cursorA >= len) {
					callback(error);
					return;
				}
				json = jsonlist[cursorA++];
//				console.log("BOOTING-5 "+JSON.stringify(json));
				if (!json.comment) {
					console.log("BOOTING-3 "+json.lox);
					topicModel.nodeFromJSON(json,function(err) {
						if (err) {error+=err;}
						console.log("BOOTING-4 "+json.lox);
						loop();
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
	var load = function(callback) {
		var error = '';
		var path1 = __dirname+"/../../bootstrap";
		var path = __dirname+"/../../bootstrap/";

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
				environment.logDebug("Bootstrap.load-2 "+cursorB);
				if (cursorB >= len) {
					callback(error);
					return;
				}
				console.log("Bootstrap.load-2 "+cursorB);
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
		}
		callback(error);
	};

	var self = this;
	/**
	 * Test the database to see if it needs to be bootstrapped
	 * @param callback signature = err;
	 */
	self.bootstrap = function(callback) { //
		var error = '';
		dataProvider.nodeExists(types.TYPE_TYPE, function(err,result) {
			console.log("Bootstrap.bootstrap-1 "+err+" "+result);
			if (err) {error+=err;}
			if (!result) {
				load(function() {
					console.log("Bootstrap.bootstrap booted");
					callback(error);
				});
			} else {
				callback(error);
			}
		});
	};
	

};