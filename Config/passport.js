var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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
    // passport.use('local-signup', new LocalStrategy({
    //     userNameField: 'email',
    //     passwordField: 'password',
    //     passReqToCallback: true
    // },
    // function (req, data, done) {
    //     console.log('adasdasd'+data);
    //     process.nextTick(function () {
    //         User.findOne({'local.email' : data.email}, function (err, user) {
    //             if(err) return done(err);
    //             if(user){
    //                 return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    //             }else{
    //                 var newUser = new User();
    //                 newUser.local.email    = data.email;
    //                 newUser.local.password = newUser.generateHash(data.password);
    //                 newUser.local.fullname = data.fullname;
    //                 newUser.local.sex = data.sex;
    //                 newUser.local.birthday = data.birthday;
    //                 newUser.local.city = data.city;
    //
    //                 newUser.save(function (err) {
    //                     if(err) return done(null);
    //                 });
    //                 return done(null, newUser);
    //             }
    //         })
    //
    //     })
    // }))
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            if (email){
                email = email.toLowerCase();
            }
            console.log(324234);
            process.nextTick(function() {
                User.findOne({ 'local.email' : email }, function(err, user) {
                    if (err){
                        return done(err);
                    }
                    if (!user || !user.validPassword(password)){
                        return done(null, false, req.flash('loginMessage','Tên truy cập hoặc mật khẩu không chính xác'));
                    }else{
                        return done(null, user);
                    }
                });
            });

        })
    );
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            if (email){
                email = email.toLowerCase();
            }
            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:
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
                                return done(null, false, req.flash('confirmPass', 'Error confirm password'))
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
                    // if the user is logged in but has no local account...
                } else if ( !req.user.local.email ) {
                    // ...presumably they're trying to connect a local account
                    // BUT let's check if the email used to connect a local account is being used by another user
                    User.findOne({ 'local.email' :  email }, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                            // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                        } else {
                            var user = req.user;
                            user.local.email = email;
                            user.local.password = user.generateHash(password);
                            user.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null,user);
                            });
                        }
                    });
                } else {
                    console.log('Session exist!');

                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user);
                }

            });

        }));
};