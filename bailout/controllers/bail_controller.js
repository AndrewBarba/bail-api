
var User = require("../models/user"),
 BailOut = require("../models/bailout"),
  twilio = require("twilio");

function BailController() {

	this.bailOut = function(req, res, next) {
		User.getCurrentUser(req, function(err, user){
			if (err || !user) {
				return Error.e401(res, err);
			} else {
				var time = req.body.timeout;
				if (!time) time = 0;
				if (time > 30) time = 30;
				user.bail(time);
				res.json({
					"status" : "success"
				});
			}
		});
	}

	this.twiML = function(req, res, next) {
		//Create TwiML response
		User.getCurrentUser(req, function(err, user){

			var twiml = new twilio.TwimlResponse();
			var voice = {
				"voice" : "woman",
				"language" : "en-us"
			};
			
			twiml.pause({
				"length" : 1
			});

			if (user && user.bail_outs > 0) {
				twiml.say("Hello! Thank you again for using Bail Out. You have used Bail Out "+ user.bail_outs +" times! Hopefully this call will keep you occupied while you get away. Good luck!", voice);
			} else {
				twiml.say("Hello! Thank you for using Bail Out. Hopefully this call will keep you occupied while you get away. Good luck!", voice);
			}

			twiml.pause({
				"length" : 1
			});
			
			twiml.hangup();
			
			res.writeHead(200, {"Content-Type": "text/xml"});
			res.end(twiml.toString());
		});
	};
}

module.exports = function(app) {
	
	var controller = new BailController();

	app.post("/bail", controller.bailOut);
	app.get("/bail/twiml", controller.twiML);

	return controller;
}