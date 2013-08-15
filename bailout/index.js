
function BailOut(app) {
	
	// Load Suprizr models
	this.model = require("./models");

	// Load controllers if we're not testing
	if (app) {
        var controller = require("./controllers");
		this.controller = controller(app);
	}

    // Load Modules
    this.module = require("./modules");
}

var _bailout = false;
module.exports = function(app) {
	if (!_bailout) {
        _bailout = new BailOut(app);
    }
	return _bailout;
}

/**
 * Helper functions
 */
AB = function(){};
AB.randomNumber = function(x) {
    if (!x) x = 5;
    var ans = "";
    for (var i = 0; i < x; i++) {
        ans += Math.floor((Math.random()*9)+1);
    }
    return ans;
}
AB.s4 = function(){return (((1+Math.random())*0x10000)|0).toString(16).substring(1); } // random 4 digit string/number
AB.guid = function(del){ // guid generator
	if (!del) del = "-";
	return(AB.s4()+AB.s4()+del+AB.s4()+del+"4"+AB.s4().substr(0,3)+del+AB.s4()+del+AB.s4()+AB.s4()+AB.s4());
}
AB.simpleGUID = function(x) {
	if (!x) x = 1;
    var s = "";
	for (var i = 0; i < 8*x; i++) s += AB.s4();
	return s;
}
AB.now = function() {
    return (new Date()).getTime();
}
AB.dateString = function(date) { // returns a nicely formatted date string
    if (!date) date = new Date();
    return (date.getMonth()+1) + "." + date.getDate() + "." + date.getFullYear();
}
AB.relativeTime = function(date) { // returns a string that nicely portrays relative time since a given date
    var now = new Date();
    var nowSeconds = now.getTime() / 1000;
    var dateSeconds = date.getTime() / 1000;
    var diff = Math.ceil(nowSeconds - dateSeconds);
    var tense;
    if (diff < 60) {
        return "just now";
    } else if (diff < 60*60) {
        tense = "minute";
        diff = Math.floor(diff/60);
    } else if (diff < 60*60*24) {
        tense = "hour";
        diff = Math.floor(diff/60/60);
    } else if (diff < 60*60*24*7) {
        tense = "day";
        diff = Math.floor(diff/60/60/24);
        if (diff == 1) return "yesterday";
        if (diff < 7) return AB.dayOfWeek(date);
    } else {
        return AB.dateString(date);
    }
    if (diff != 1) tense += "s";
    return diff + " " + tense + " ago";
}
AB.dayOfWeek = function(date) { // returns the english day of week for the given date
    switch(date.getDay()) {
        case 0: return "Sunday";
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
    }
    return "";
}
AB.monthString = function(date) { // returns the english month for the given date
    switch(date.getMonth()) {
        case 0: return "January";
        case 1: return "February";
        case 2: return "March";
        case 3: return "April";
        case 4: return "May";
        case 5: return "June";
        case 6: return "July";
        case 7: return "August";
        case 8: return "September";
        case 9: return "October";
        case 10: return "November";
        case 11: return "December";
    }
    return "";
}
AB.parseDiaryDate = function(d) { // parses a date in the format YYYY-MM-DD ex: 2013-05-01
    if (d && d != "") {
        var parts = d.match(/(\d+)/g);
        return new Date(parts[0], parts[1]-1, parts[2]);
    } else {
        return false;
    }
}
AB.parseDateInputString = function(s) { // this function parses dates in the format "2013-06-11T01:00"
    var date = false;
    var parts = s.split("T");
    if (parts.length > 0) {
        date = AB.parseDiaryDate(parts[0]);
    }
    if (date && parts.length > 1) {
        var time = parts[1].split(":");
        date.setHours(time[0]);
        date.setMinutes(time[1]);
    }
    return date;
}
AB.dateToInputDateString = function(date) {
    var s = AB.diaryDate(date) + "T";
    
    var hours = date.getHours();
    if (hours < 10) hours = "0" + hours;
    s += hours + ":";
    
    var min = date.getMinutes();
    if (min < 10) min = "0" + min;
    s += min;

    return s;
}
AB.secondsToFullDateString = function(d) {
    var date = new Date(d*1000);
    var s = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear()

    var h = date.getHours();
    var a = h > 12 ? "pm" : "am";
    if (h > 12) h -= 12;
    if (h == 0) h = 12;

    var m = date.getMinutes();
    if (m < 10) m = "0" + m;
    return s + " " + h + ":" + m + a;
}
AB.isEmail = function(email) { // is the given string a valid email address
    var filter = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return filter.test(email);
}
AB.randomElement = function(array) { // grab a random element from an array
    return array[Math.floor(Math.random()*array.length)];
}
AB.trackTime = function(date) { // prints/returns time difference (seconds) between now and a given date
    var seconds = ((new Date()).getTime()/1000) - (date.getTime()/1000);
    return seconds;
}
AB.each = function(arr,fnc) { // a simple for-each implementation
    if (arr instanceof Array) {
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            fnc.call(obj,i,obj);
        }
    } else {
        for (var k in arr) {
            var obj = arr[k];
            fnc.call(obj,k,obj);
        }
    }
}
AB.extend = function(a,b,f) { // combines second dict into first dict and returns it. if third param is true, b keys overright a keys
    if (a) {
        AB.each(b,function(k,v){
            if (v != null && (!a[k] || f)) a[k] = v;
        });
        return a;
    } else {
        return b;
    }
}
AB.removeKeys = function(data, remove) {
    AB.each(remove, function(i,k){
        delete data[k];
    });
    return data;
}
AB.grep = function(arr,fnc) { // filters an array according to a given function
    var newarr = [];
    AB.each(arr,function(k,v){
        var pass = fnc.call(v,v,k);
        if (pass) newarr.push(v);
    });
    return newarr;
}
