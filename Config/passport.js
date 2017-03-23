var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User             = require('./../Models/userdb');
var configAuth       = require('./auth');

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
    //facebook 
    passport.use(new FacebookStrategy({
        clientID      : configAuth.facebookAuth.clientID,
        clientSecret  : configAuth.facebookAuth.clientSecret,
        callbackURL   : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'name', 'picture.type(large)', 'emails', 'displayName', 'gender']
    },
    function (req, token, refreshToken, profile, done) {
        process.nextTick(function () {
            if(! req.user){
                User.findOne({'facebook.id' : profile.id}, function (err, user) {
                    if(err){
                        return done(err);
                    }
                    if(user){
                        return done(null,user);
                    }else{
                        var newUser = new User();

                        newUser.facebook.id         = profile.id;
                        newUser.facebook.token      = token;
                        newUser.facebook.name       = profile.displayName;
                        newUser.facebook.email      = profile.emails[0].value;
                        newUser.facebook.picture    = profile.photos[0].value;
                        newUser.facebook.gender    = profile.gender;
                        newUser.save(function (err) {
                            if(err){
                                throw err;
                            }

                            return done(null, newUser);
                        })
                    }

                })
            } else{
                var newUser                 = req.user;

                newUser.facebook.id         = profile.id;
                newUser.facebook.token      = token;
                newUser.facebook.name       = profile.displayName;
                newUser.facebook.email      = profile.emails[0].value;
                newUser.facebook.picture    = profile.photos[0].value;
                newUser.facebook.gender     = profile.gender;

                newUser.save(function (err) {
                    if(err){
                        throw err;
                    }

                    return done(null, newUser);
                })
            }

        })
    }));
    //login by google+
    passport.use(new GoogleStrategy({
        clientID            : configAuth.googleAuth.clientID,
        clientSecret        : configAuth.googleAuth.clientSecret,
        callbackURL         : configAuth.googleAuth.callbackURL,
        passReqToCallback   : true

    },
    function (req, token, refreshToken, profile, done) {
        process.nextTick(function () {
            if (!req.user) {
                User.findOne({'google.id': profile.id}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value;
                        newUser.save(function (err) {
                            if (err){
                                throw err;
                            }

                            return done(null, newUser);
                        });
                    }
                })
            }else {
                var user          = req.user;
                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = profile.emails[0].value;

                user.save(function(err) {
                    if (err){
                        throw err;
                    }

                    return done(null, user);
                });

            }
        })
    }));

    //login by twitter
    passport.use(new TwitterStrategy({
        consumerKey         : configAuth.twitterAuth.consumerKey,
        consumerSecret      : configAuth.twitterAuth.consumerSecret,
        callbackURL         : configAuth.twitterAuth.callbackURL
    },
    function (req, token, tokenSecret, profile, done) {
        console.log(profile);
        process.nextTick(function () {
            if(! req.user){
                User.findOne({'twitter.id' : profile.id}, function (err, user) {
                    if(err){
                        return done(err);
                    }
                    if(user){
                        return done(null,user);
                    }else{
                        var newUser = new User();
                        newUser.twitter.id              = profile.id;
                        newUser.twitter.token           = token;
                        newUser.twitter.displayName     = profile.displayName;
                        newUser.twitter.username        = profile.username;
                        newUser.twitter.image           = profile.photos[0].value;

                        newUser.save(function (err) {
                            if(err){
                                return done(err);
                            }

                            return done(null, newUser);
                        })
                    }
                })
            }else{
                var user = req.user;

                user.twitter.id              = profile.id;
                user.twitter.token           = token;
                user.twitter.displayName     = profile.displayName;
                user.twitter.username        = profile.username;
                user.twitter.image           = profile.photos[0].value;

                user.save(function (err) {
                    if(err){
                        return done(err);
                    }

                    return done(null, user);
                })
            }
        })
    }));

    //local-login
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err){
                    return done(err);
                }
                if (!user){
                    return done(null, false, req.flash('loginMessage', 'Tài khoản hoặc mật khẩu đăng nhập không đúng.'));
                }
                if (!user.validPassword(password)){
                    return done(null, false, req.flash('loginMessage', 'Tài khoản hoặc mật khẩu đăng nhập không đúng.'));
                }

                return done(null, user);
            });

        }));
    //local signup
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            if (email){
                email = email.toLowerCase();
            }
            process.nextTick(function() {
                if (!req.user) {
                    User.findOne({ 'local.email' :  email }, function(err, user) {
                        if (err){
                            return done(err);
                        }
                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'Tài khoản này đã tồn tại!'));
                        } else {
                            if(req.body.password != req.body.conf_password){
                                return done(null, false, req.flash('signupMessage', 'Xác nhận mật khẩu không đúng!'))
                            }
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
                            user.local.email    = email;
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
                    return done(null, req.user);
                }

            });

        }));
};