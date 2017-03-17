var LocalStrategy    = require('passport-local').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
var User             = require('./../Models/userdb');
// var configAuth       = require('./auth');

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
        console.log(3242432);
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err){
                    return done(err);
                }
                if (!user){
                    return done(null, false, req.flash('loginMessage', 'Không tồn tại người dùng!'));
                }
                if (!user.validPassword(password)){
                    return done(null, false, req.flash('loginMessage', 'Mật khẩu đăng nhập không đúng.'));
                }
                return done(null, user);
            });

        }));
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            if (email){
                email = email.toLowerCase();
            }
            process.nextTick(function() {
                if (!req.user) {
                    console.log('Session dont exist');
                    User.findOne({ 'local.email' :  email }, function(err, user) {
                        if (err){
                            console.log('Error');
                            return done(err);
                        }
                        if (user) {
                            console.log('User exist!');
                            return done(null, false, req.flash('signupMessage', 'Tài khoản này đã tồn tại!'));
                        } else {
                            if(req.body.password != req.body.conf_password){
                                return done(null, false, req.flash('signupMessage', 'Xác nhận mật khẩu không đúng!'))
                            }
                            console.log('User dont exist!');
                            // create the user
                            var newUser            = new User();

                            newUser.local.email    = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.local.fullname = req.body.fullname;
                            newUser.local.sex      = req.body.sex;
                            newUser.local.birthday = req.body.birthday;
                            newUser.local.city     = req.body.city;
                            newUser.save(function(err) {
                                if (err){
                                    return done(err);
                                }
                                return done(null, newUser);
                            });
                        }

                    });
                } else if ( !req.user.local.email ) {
                    User.findOne({ 'local.email' :  email }, function(err, user) {
                        if (err){
                            return done(err);
                        }
                        if (user) {
                            return done(null, false, req.flash('loginMessage', 'Tài khoản này đang được sử dụng!'));
                        } else {
                            var user = req.user;
                            user.local.email = email;
                            user.local.password = user.generateHash(password);
                            user.local.fullname = req.body.fullname;
                            user.local.sex      = req.body.sex;
                            user.local.birthday = req.body.birthday;
                            user.local.city     = req.body.city;
                            user.save(function (err) {
                                if (err){
                                    return done(err);
                                }

                                return done(null,user);
                            });
                        }
                    });
                } else {
                    console.log('Session exist!');

                    return done(null, req.user);
                }

            });

        }));
};