'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var controller = require('../../api/user/user.controller');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
    // Make sure user's account isn't locked
    if( Date.now() < user.lockUntil ) {
    	if( user.loginAttempts >= 5 ) {
    		return res.json(404, {message: 'Your Account is locked.'});
    	}
    }

    controller.unlockAccount(user);
    var token = auth.signToken(user._id, user.role);
    res.json({token: token});
  })(req, res, next)
});

module.exports = router;