var express = require('express');
var router  = express.Router();
var User    = require('./../Controllers/Users/UsersController');
/* GET users listing. */
router.get('/', User.index);

router.get('/signup', User.signup);

router.post('/signup', User.store);

router.post('/login', User.login);

module.exports = router;
