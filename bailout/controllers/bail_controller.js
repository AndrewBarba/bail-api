
var User = require("../models/user"),
 BailOut = require("../models/bailout"),
  twilio = require("twilio");

function BailController() {

	this.bailOut = function(req, res, next) {
		User.getCurrentUser(req, function(err, user){
			if (err || !user) {
				return Error.e404(res, err, "Could not find a user with the given auth token.");
			} else {
				var time = req.body.timeout;
				if (!time) time = 0;
				if (time > 30) time = 30;
				user.bail(time, function(err){
					if (!err) {
						user.bail_outs = user.bail_outs + 1;
						user.save();
					}
				});
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