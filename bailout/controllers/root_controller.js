
var mongoose = require("mongoose"),
       Error = require("./error_controller");

function RootController() {
	
	this.getRoot = function(req, res, next) {
		return res.send({
			"name" : "BailOut API",
			"description" : "A node.js REST API for the 'Bail Me Out' app",
			"version" : "0.2.1",
			"time" : Date.now(),
			"server" : "node.js",
			"database" : "MongoDB",
			"frameworks" : [ "express", "mongoose", "mocha" ]
		});
	};

	this.getStatus = function(req, res, next) {
		var connected = mongoose.connection.readyState == 1;
		if (connected) {
			return res.json({ 
				"status" : "OK" 
			});
		} else {
			return Error.e400(res, null, "Lost connection to MongoHQ");
		}
	};
}

module.exports = function(app) {
	
	var root = new RootController();

	app.get("/", root.getRoot);
	app.get("/status", root.getStatus);
	
	return root;
}