var mongoose = require('mongoose');
var bcript  = require('bcrypt-nodejs');
var userSchema = new mongoose.Schema({
	local		:{
        fullname     : String,
        email		 : {type:String, require:true, unique: true},
        password	 : {type:String, require:true},
        sex			 : { type: Number},
        birthday	 : {type:String, require:true},
        city		 : {type:String, require:true}
	},
    facebook 	:{
		id			 : String,
		token		 : String,
		email		 : String,
		name		 : String,
		image		 : String
    },
    twitter     : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String,
		image		 : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

//generator a hash
userSchema.methods.generateHash = function(password){
	return bcript.hashSync(password, bcript.genSaltSync(8), null);
};

//checking if password is valid
userSchema.methods.validPassword = function (password) {
	return bcript.compareSync(password, this.local.password);
};

var User = mongoose.model('User', userSchema);
module.exports = User;