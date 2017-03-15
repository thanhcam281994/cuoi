var User  = require('../../Models/userdb');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var Promise = require('promise');
exports.index = function(req,res){
	res.render('users/login');
};

exports.register = function(req, res){
	res.render('users/register')
};

exports.store = function(req, res){
	var fullname  	= req.body.fullname;
	var mail 		= req.body.email;
	var password 	= req.body.password;
	var repassword  = req.body.conf_password;
	var birthday 	= req.body.birthday;
	var city		= req.body.country;
	console.log(fullname+'   '+mail+'    '+city);
	var promise = new Promise(function(resolve, reject){
		if(mail == ''){
			reject('Errors input');
		}
		resolve('Successfull');
	});
	promise
		.then(function(message){
			console.log(message);
			// console.log(mail);
			// res.send('Register successfull');
		})
		.catch(function(message){
            console.log(message);
        });
	// var mail = req.body.email;
	console.log(mail);
	res.send('Register successfull');
};

exports.login = function(req, res){
	var mail 		= req.body.mail;
	var password 	= req.body.password;
	passport.use(new LocalStrategy(
		function(email, password, done){
			findUser(email, function(err, emailCf){
				if(err){
					return done(err);
				}
				if(! emailCf){
					return done(null,false);
				}
				return done(null, emailCf);
			})
		}
	))
};