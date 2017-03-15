var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
	fullname: String,
	email: {type:String, require:true, unique: true},
	password: {type:String, require:true},
	sex: { type: Number},
	birthday: {type:String, require:true},
	city: {type:String, require:true},
})

var User = mongoose.model('User', userSchema);
module.exports = User;