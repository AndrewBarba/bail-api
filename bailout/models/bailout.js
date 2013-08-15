
var BaseSchema = require("../schemas/base"),
      mongoose = require("mongoose"),
        Schema = mongoose.Schema,
        extend = require("mongoose-schema-extend");

var BailOutSchema = BaseSchema.extend({
    phone_number: String,
    success: Boolean
});

BailOutSchema.statics.log = function(phone_number, success, callback) {
	var data = {
		"phone_number" : phone_number,
		"success" : success
	};
	var bailout = new BailOut(data);
	bailout.save(callback, function(err){
		if (err) {
			return callback(err);
		} else {
			return callback(null, bailout);
		}
	});
}

var BailOut = mongoose.model("BailOut", BailOutSchema);
module.exports = BailOut;