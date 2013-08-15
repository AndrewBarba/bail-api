
var User = require("../models/user"),
   Error = require("./error_controller");

function UserController() {

	this.registerUser = function(req, res, next) {
		var phone_number = req.body.phone_number;
		// sanitize here...
		User.register(phone_number, function(err, user){
			if (err || !user) return Error.e400(res, err);
			return res.json(user);
		});
	}
	
}

module.exports = function(app) {
	
	var controller = new UserController();

	app.post("/user/register", controller.registerUser); // create a user and send sms verification

	return controller;
}