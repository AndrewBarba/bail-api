
/**
 * This is a custom http request wrapper around nodes built in request object
 */

var http = require("http"),
   https = require("https");

function ABHTTP(proto) {

	this.request = function(options, callback) {
	    var req = proto.request(options, function(response){
	    	var str = "";

			//another chunk of data has been recieved, so append it to `str`
			response.on("data", function (chunk) {
				str += chunk;
			});

			//the whole response has been recieved, so we just print it out here
			response.on("end", function () {
				callback(null, str);
			});
	    });

	    req.on("error", function(e){
	    	trace("HTTP ERROR: "+e.message);
	    	callback(e);
	    });

	    req.end();
	}

	this.json = function(options, callback) {
		this.request(options, function(err, str){
			if (err) return callback(err);
			var json = JSON.parse(str);
			callback(null, json);
		});
	}

	this.fb = function(path, token, callback) {
		if (token) {
			path += (path.indexOf("?") < 0) ? "?" : "&";
			path += ("access_token=" + token);
		}
		var options = {
			"host" : "graph.facebook.com",
			"path" : path
		};
		this.json(options, function(err, data){
			if (err || !data || data.error) {
				if (data && data.error) {
					err.facebook = data.error;
				}
				return callback(err);
			} else {
				return callback(null, data);
			}
		});
	}

	this.place = function(ref, callback) {
		var path = "/maps/api/place/details/json?sensor=false&reference=" + ref + "&key=" + SP_SETTINGS.google.api_key;
		var options = {
			"host" : "maps.googleapis.com",
			"path" : path
		};
		this.json(options, function(err, data){
			if (err || !data || !data.result) {
				if (callback) callback(err);
			} else {
				if (callback) callback(null, data.result);
			}
		});
	}
}


























module.exports = new ABHTTP(https);