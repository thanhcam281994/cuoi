var User    = require('./../Controllers/Users/UsersController');

module.exports = function(app, passport) {
    app.get('/login',User.index);
    app.get('/signup',User.signup);
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/login',
        failureRedirect : '/signup',
        failureFlash    : true
    }));
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect : '/login',
        failureFlash    : true
    }));
    //login by facebook
    app.get('/auth/facebook', passport.authenticate('facebook',{  scope: 'email' }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/login'
    }));
    app.get('/logout', function(req,res){
        req.logout();
        res.redirect('/');
    })
};
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
