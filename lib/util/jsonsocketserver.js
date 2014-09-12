/**
 * JSONSocket
 * This waits for some single socket to make a permanent connection.
 * It then sends messages as they come in.
 * ISSUE: crashes if the socket closes
 */

var net = require('net')
	, JsonSocket = require('json-socket')
;


var JSONSocketServer = module.exports = function(port) {
	console.log("STARTING SOCKET SERVER");
	this.sockets = [];
	var self = this;
	//create a server which returns sockets as they are opened
	this.server = net.createServer(function(sock) {
		console.log("JSONSocketServer socket "+sock);
		self.sockets.push(sock);
	}).listen(port);
	this.messages = [];
	console.log("Z "+this.server);
	
};

/**
 * Remove a message from messages list and return it
 */
var takeMessage = function(self) {
	var m = self.messages;
	var result = m[0];
	var len = m.length;
	var x = [];
	for (var i=1;i<len;i++) {
		x.push(m[i]);
	}
	self.messages = x;
	
	return m;
};

/**
 * Send a message
 */
var shipMessage = function(self, newmessage) {
	console.log("S.foo "+self.sockets);
	var socks = self.sockets;
	var len = socks.length;
	//ripple through all listener sockets
	for (var i=0;i<len;i++) {
		console.log("S.bar "+socks[i]);
		new JsonSocket(socks[i]).sendMessage(newmessage);
	}
};

/**
 * Coordinate sending messages with:
 * a) getting sockets
 * b) getting messages
 */
var broadCastMessage = function(self) {
	var len = self.messages.length;
	try { //try to trap for socket going down. Doesn't catch the error
		console.log("S.broadCastMessage 1 "+self.sockets.length);
		var json;
		if (len === 0) {
			return;
		}
		//ripple through all messages
		for (var i=0;i<len;i++) {
			json = takeMessage(self);
			console.log("GOT "+JSON.stringify(json));
			shipMessage(self,json);
		}			
		//recurse to wait for another message
		broadCastMessage(self);
	} catch (e) {
		console.log(e);
	}
};


/**
 * Add a message to be sent. This assumes that one listener will eventually
 * open a permanent socket
 */
JSONSocketServer.prototype.addMessage = function(json) {
	console.log("S.addMessage "+this.sockets.length+" "+JSON.stringify(json));
	this.messages.push(json);
	broadCastMessage(this);
};
	




