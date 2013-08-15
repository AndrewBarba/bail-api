
var BaseSchema = require("../schemas/base"),
      mongoose = require("mongoose"),
        extend = require("mongoose-schema-extend"),
  twilioClient = require("../modules/twilio");

var BLANK_STRING = "xxx";
var VERIFICATION_CODE_LENGTH = 5;

var UserSchema = BaseSchema.extend({
    phone_number: { type: String, index: { unique: true } }, // cell number, no +
    auth_token: { type: String, default: BLANK_STRING, required: true, index: { unique: true } },
    bail_outs: { type: Number, default: 0 }
    verification_code: { type: String, default: BLANK_STRING },
});

/**
 * Creates a record in the db if one does not exist
 * Resets verification code and sends a text to the number
 */
UserSchema.statics.register = function(phone_number, callback) {
    User.findOrCreate(phone_number, function(err, user){
        if (err || !user) return callback(err);
        user.verification_code = AB.randomNumber();
        user.save(function(err){
            if (!err) {
                user.verifyViaSMS(function(err){
                    if (!err) {
                        return callback(null, user);
                    } else {
                        return callback(err);
                    }
                });
            } else {
                return callback(err);
            }
        });
    });
}

/**
 * Returns a user object via phone number
 * If the user does not already exist we create one
 */
UserSchema.statics.findOrCreate = function(phone_number, callback) {
    var data = {
        "phone_number" : phone_number
    }
    User.findOne(data, function(err, user){
        if (err) return callback(err);
        if (user) {
            return callback(null, user);
        } else {
            var user = new User(data);
            user.save(function(err){
                if (err) return callback(err);
                return callback(null, user);
            });
        }
    });
}

/**
 * Sends a verification SMS to the user
 */ 
UserSchema.statics.verifyPhoneNumber = function(phone_number, code, callback) {
    User.findOrCreate(phone_number, function(err, user){
        if (err || !user) {
            return callback(err);
        } else {
            var now = (new Date()).getTime()/1000;
            var updated = user.updated_at / 1000;
            var diff = now - updated;
            var exp = 60 * 5;
            if (diff > exp) { // time expired
                return callback("Time expired to verify number.");
            } else {
                var verification_code = user.verification_code;
                if (verification_code != BLANK_STRING && verification_code === code) {
                    user.verification_code = BLANK_STRING;
                    user.auth_token = AB.simpleGUID();
                    user.save(function(err){
                        if (err) return callback(err);
                        return callback(null, user);
                    });
                } else {
                    return callback("Verification codes do not match.");
                }
            }
        }
    });
};

/**
 * Sends a verification SMS to the user
 */ 
UserSchema.methods.verifyViaSMS = function(callback) {
    var phone_number = "+" + this.phone_number;
    var message = "Thanks for using BailOut! Enter this code to verify your cell number: " + this.verification_code;
    var data = {
        "to" : phone_number,
        "from" : AB_SETTINGS.twilio[AB_ENV].phone_number,
        "body" : message
    };
    twilioClient.sendSms(data, callback);
};

/**
 * Bails out the user by calling they're phone number
 * Delays call by @time in seconds
 */ 
UserSchema.methods.bail = function(time, callback) {
    var user = this;
    setTimeout(function(){
        var phone_number = "+" + user.phone_number;
        var data = {
            "to" : phone_number,
            "from" : AB_SETTINGS.twilio[AB_ENV].phone_number,
            "url" : "http://bail-api.heroku.com/bail/twiml"
        };
        twilioClient.makeCall(data, callback);
    }, time * 1000);
};

/**
 * Gets the current user via a request object or supplied auth token
 */
UserSchema.statics.getCurrentUser = function(reqOrToken, callback) {
    var token = (typeof reqOrToken == "string") ? reqOrToken : reqOrToken.query.auth;
    if (token && token != BLANK_STRING) {
        User.findOne({ "auth_token" : token }, callback);
    } else {
        callback("Not authorized");
    }
};

var User = mongoose.model("User", UserSchema);
module.exports = User;