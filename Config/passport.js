var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User             = require('./../Models/userdb');
var configAuth       = require('./auth');

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(function(user, done){
        User.findById(id, function (err, user) {
            done(err, user);
        })
    });

    passport.use('local-signup', new LocalStrategy({
        userNameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, data, done) {
        process.nextTick(function () {
            User.findOne({'local.email' : data.email}, function (err, user) {
                if(err) return done(err);
                if(user){
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                }else{
                    var newUser = new User();
                    newUser.local.email    = data.email;
                    newUser.local.password = newUser.generateHash(data.password);
                    newUser.local.fullname = data.fullname;
                    newUser.local.sex = data.sex;
                    newUser.local.birthday = data.birthday;
                    newUser.local.city = data.city;

                    newUser.save(function (err) {
                        if(err) return done(null);
                    });
                    return done(null, newUser);
                }
            })

        })
    }))
};