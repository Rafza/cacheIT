var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var controller = require('../../api/user/user.controller');

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      User.findOne({
        email: email.toLowerCase()
      }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, { message: 'This email is not registered.' });
        }
        if (!user.authenticate(password)) {

          // check if too many attempts have been made
          controller.incLoginAttempts(user);
          if (user.loginAttempts >= 5) {
            return done(null, false, { message : 'Account locked for 5 minutes.' })
          }

          // if password is not correct and account hassn't been locked
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, user);
      });
    }
  ));
};