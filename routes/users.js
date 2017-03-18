var User    = require('./../Controllers/Users/UsersController');

module.exports = function(app, passport) {
    app.get('/login',User.index);
    app.get('/signup',User.signup);
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup',
        failureFlash : true
    }));
    // process the login form
    app.post('/login',  passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));
};
