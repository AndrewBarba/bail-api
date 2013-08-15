
var twilio = require("twilio");

function BailController() {

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

	app.get("/bail/twiml", controller.twiML);

	return controller;
}