var User  = require('../../Models/userdb');
exports.index = function(req,res){
	res.render('users/login');
};

exports.signup = function(req, res){
	res.render('users/signup')
};

// exports.store = function(req, res){
// 	console.log(213213);
// 	// var fullname  	= req.body.fullname;
// 	// var mail 		= req.body.email;
// 	// var password 	= req.body.password;
// 	// var repassword  = req.body.conf_password;
// 	// var birthday 	= req.body.birthday;
// 	// var city		= req.body.country;
//     passport.authenticate('local-signup', {
//     	successRedirect: '/index',
//         failureRedirect: '/signup',
//         failureFlash   : true
// 	})
// };

// exports.login = function(req, res){
// 	var mail 		= req.body.mail;
// 	var password 	= req.body.password;
// 	passport.use(new LocalStrategy(
// 		function(email, password, done){
// 			findUser(email, function(err, emailCf){
// 				if(err){
// 					return done(err);
// 				}
// 				if(! emailCf){
// 					return done(null,false);
// 				}
// 				return done(null, emailCf);
// 			})
// 		}
// 	))
// };