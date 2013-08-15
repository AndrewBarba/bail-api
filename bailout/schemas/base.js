
var mongoose = require("mongoose");

var base_data = {
    _id: { type: String, default: AB.simpleGUID, index: { unique: true } },
    updated_at: { type: Number, default: Date.now },
    created_at: { type: Number, default: Date.now },
};

var BaseSchema = new mongoose.Schema(base_data, {strict: AB_PROD ? true : "throw" });

BaseSchema.pre("save", function(next) {
    if (this.isModified()) {
        this.updated_at = Date.now();
    }
    next();
});

BaseSchema.statics.putData = function(id, data, callback, allowed_keys) {
    var allowed_data = {};
    AB.each(allowed_keys, function(i,k){
        val = data[k];
        if (val != null) allowed_data[k] = val;
    });
    this.findByIdAndUpdate(id, data, callback);
};

BaseSchema.methods.putData = function(data, callback, allowed_keys) {
    var allowed_data = {};
    if (allowed_keys && allowed_keys.length) {
        AB.each(allowed_keys, function(i,k){
            val = data[k];
            if (val != null) allowed_data[k] = val;
        });
    } else {
        allowed_data = data;
    }
    AB.extend(this, allowed_data, true);
    this.save(callback);
};

BaseSchema.dataScheme = base_data;
BaseSchema.restricted_fields = Object.keys(base_data);
BaseSchema.set("autoIndex", !AB_PROD);
module.exports = BaseSchema;