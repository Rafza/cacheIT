'use strict';
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

var _ = require('lodash');
var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  console.log("update() looping");
  if(req.body.transactions) {
    req.body.transactions.forEach(function(transacts) {
        console.log("Date: "+ transacts.date);
        console.log("Description: "+ transacts.description);
        console.log("Debit: "+ transacts.debit);
        console.log("Credit: "+ transacts.credit);
        console.log("Bal: "+ transacts.balance);

    });
  };

  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, usr) {
    if (err) { return handleError(res, err); }
    if(!usr) { return res.send(404); }
      console.log("Usr: "+ usr);
    var updated = _.merge(usr, req.body);
    //http://stackoverflow.com/questions/26372523/document-sub-arrays-stored-as-duplicate-values-of-the-first-entry-in-mongo
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, usr);
    });
  });
};

// Push an existing thing in the DB.
exports.push = function(req, res) {
  if(req.body._id) { delete req.body._id; }
    User.transactions.push(req.body, function (err,usr) {
    if (err) { return handleError(res, err); }
    if(!usr) { return res.send(404); }
  });
};

// exports.updateById =  function(req, res) {
//     {$push: {items: item}},
//     {safe: true, upsert: true},
//     function(err, model) {
//         console.log(err);
//     }
//
// };

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

// Handles Error
function handleError(res, err) {
  return res.send(500, err);
}
/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
