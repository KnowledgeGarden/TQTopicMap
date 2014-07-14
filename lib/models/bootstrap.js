/**
 * Bootstrap
 */
var SubjectProxy = require('../models/subjectproxy')
  , types	= require('../types')
  , icons = require('../icons')
  , constants = require('../constants')
;
var Bootstrap = module.exports = function(dataProvider, topicModel) {
	var english = constants.English;
	var user = constants.SYSTEM_USER;
	var credentials = [];
	credentials.push(constants.SYSTEM_USER);
	//readdirSync(path) returns array
	
	var findBootDir = function() {
		var fs = require('fs');
		var fileArray;
		if (fs.existsSync('../../bootstrap')) {
			fileArray = fs.readdirSync('../../bootstrap');
			if (fileArray && fileArray.length > 0) {
				console.log("Bootstrap.findBootDir "+"../../bootstrap");
				return "../../bootstrap";
			}
		}
		if (fs.existsSync('../bootstrap')) {
			fileArray = fs.readdirSync('../bootstrap');
			if (fileArray && fileArray.length > 0) {
				console.log("Bootstrap.findBootDir "+"../../bootstrap");
				return "../bootstrap";
			}
		}
		return null;
	}
	var cursorA, cursorB;
	/**
	 * Read a JSON topicmap bootstrap file
	 */
	var bootFile = function(file, callback) {
		console.log("BOOTING "+file);
		require('fs').readFile(file,'utf8', function (err, data) {
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
					topicModel.nodeFromJSON(json,function(err) {
						if (err) {error+=err;}
					});
				}
				loop();
			}
			loop();
		});
	};
	/**
	 * Load all json files in /bootstrap directory
	 */
	var load = function(callback) {
		var error = '';
		var path = findBootDir();
		console.log("Bootstrap path "+path);
		var fileArray = require('fs').readdirSync(path);
		console.log("Bootstrap.load "+fileArray.length);
		if (fileArray) {
			var len = fileArray.length;
			//diagnostics
			for (var i=0;i<len;i++) {
				console.log(fileArray[i]);
			}
			cursorB = 0;
			console.log("Bootstrap.load-a "+cursorB);
			var fx;
			function loop() {
				console.log("Bootstrap.load-b "+cursorB);
				if (cursorB >= len) {
					callback(error);
					return;
				}
				console.log("Bootstrap.load-2 "+cursorB);
				fx = fileArray[cursorB++];
				console.log("Bootstrap.load-3 "+fx);
				// only load json files
				if (fx.indexOf(".json") > -1) {
					bootFile(path+"/"+fx, function(err) {
						if (err) {error+=err;}
					});
				}
				loop();
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
				})
			} else {
				callback(error);
			}
		});
	}
	


};