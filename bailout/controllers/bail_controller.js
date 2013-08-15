
var User = require("../models/user"),
  twilio = require("twilio");

function BailController() {

	this.bailOut = function(req, res, next) {
		User.getCurrentUser(function(err, user){
			if (err || !user) {
				return Error.e404(res, err, "Could not find a user with the given auth token.");
			} else {
				user.bail();
				res.json({
					"status" : "success"
				});
			}
		});
	}

	this.twiML = function(req, res, next) {
		//Create TwiML response
	    var twiml = new twilio.TwimlResponse();
	    twiml.say("Hello! Thank you for using Bail Out. Hopefully this call will keep you occupied while you get away. Good luck!", {
	    	"voice" : "woman",
	    	"language" : "en-us"
	    });
	    res.writeHead(200, {"Content-Type": "text/xml"});
	    res.end(twiml.toString());
	};
}

module.exports = function(app) {
	
	var controller = new BailController();

	app.post("/bail", controller.bailOut);
	app.get("/bail/twiml", controller.twiML);

	return controller;
}