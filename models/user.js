var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true,
    
  },
    password: String,

    optradio:{
    type: String,
    
  },
    Blood:{
    type: String,
    required: true,
  },
    Age:{
    type: String,
  },
    Mobile:{
    type: String,
    required: true,
    },
    Email:{
    type: String,
    unique: true
  
  },
    Address:{
    type: String,
    
  },
    City:{
    type: String,
    required: true,
  },
    District:{
    type: String,
  },
    optradio1:{
    type: String,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);