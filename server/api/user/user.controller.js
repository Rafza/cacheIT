/*
 * Filename: user.controller.js
 * Description: File that has the core Business Logic
 */ 

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

/**
* Get a single user by name
*/
exports.showName = function(req, res) {
  User.find({ email: req.params.email }, function (err, usr) {
    if(err) { return handleError(res, err); }
    if(!usr) { return res.send(404); }
    console.log(usr);
    return res.json(usr);
  });
};

/**
* Get a single user by name
*/
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
  }

  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, usr) {
    if (err) { return handleError(res, err); }
    if(!usr) { return res.send(404); }
      console.log("Usr: "+ usr);
    var updated = _.extend(usr, req.body);
    //http://stackoverflow.com/questions/26372523/document-sub-arrays-stored-as-duplicate-values-of-the-first-entry-in-mongo
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, usr);
    });
  });
};

// Push an existing transaction in the DB.
exports.pushCreate = function(req, res) {
  var bodyData = req.body;
  var myName = req.params.name;

  if(req.body._id) { delete req.body._id; }
  User.findOneAndUpdate({email : myName },{$pushAll : bodyData}, {upsert:true},
  function(err, data) {
    if(!data) {
      return res.send(404);
    }
    if (err) { return handleError(res, err); }
    console.log("Data returned: " + data);
    return res.json(200, data);
  });
};

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
 * Change a users password
 */
exports.setPassword = function(req, res, next) {
  var userId = req.params.id;
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(newPass) {
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
 * Increment Days
 */
exports.incrementDays = function() {
  User.find({},'checking accountDays', function (err, users) {
    // console.log(users.length);
    // console.log(users);
    users.forEach( function(element, index, array) {
      // console.log("Day: " + element.accountDays + " Checking: " + element.checking);
      var newDays = ((element.accountDays+1) % 30);
      // console.log("Apply Interest and Penalty.");
      User.update({ _id : element._id },{ accountDays : newDays},function(err){});
    });
    exports.accruedPenalty();
    exports.accruedInterest();
    exports.accruedInterestChecking();
  });
};

/**
 * Apply Penalty
 */
exports.accruedPenalty = function() {
  User.find({checking: { $lt : 100 }, accountDays : 29 },'email checking saving accountDays checkTransactions', function (err, users) {
    // console.log("Accounts to penalize: ");
    // console.log(users);
    users.forEach( function(element, index, array) {
      console.log("Penalizing " + element.email);
      // console.log("Day: " + element.accountDays);
      var newChecking = element.checking-25;
      var chkJson = {
        checkTransactions :
        [{
          description : 'Penalty for account balance less than 100',
          debit : 25,
          credit : 0,
          balance : newChecking
        }]
      };
      User.update({ _id : element._id },{ checking : newChecking, $pushAll : chkJson},function(err){});
    });
  });
};

/**
 * Apply Interest
 */
exports.accruedInterest = function() {
  User.find({saving: { $gte : 1000 }, accountDays : 29 },'email saving', function (err, users) {
    // console.log(users.length);
    // console.log(users);
    var interestRate = 0;

    //Determine Interest Rate
    users.forEach( function(element, index, array) {
      if(element.saving < 2000) {
        interestRate=0.02;
        console.log(element.email + " 2% Interest");
      } else if(element.saving < 3000) {
        interestRate=0.03;
        console.log(element.email + " 3% Interest");
      } else {
        interestRate=0.04;
        console.log(element.email + " 4% Interest");
      }


      var newSavings = element.saving + (element.saving * interestRate);

      var savJson = {
        savTransactions :
        [{
          description : 'Interest Rate of ' + (interestRate*100) +'% applied',
          debit : 0,
          credit : (element.saving * interestRate),
          balance : newSavings
        }]
      };

      User.update({ _id : element._id },{ saving : newSavings, $pushAll : savJson},function(err){});
    });
  });
};
/**
 * Get my info
 */
exports.accruedInterestChecking = function() {
  User.find({checking: { $gte : 1000 }, accountDays : 29 },'email checking', function (err, users) {
    // console.log(users.length);
    // console.log(users);
    var interestRate = 0;

    //Determine Interest Rate
    users.forEach( function(element, index, array) {
      if(element.checking < 2000) {
        interestRate=0.01;
        console.log(element.email + " 1% Interest Chk");
      } else if(element.checking < 3000) {
        interestRate=0.02;
        console.log(element.email + " 2% Interest Chk");
      } else {
        interestRate=0.03;
        console.log(element.email + " 3% Interest Chk");
      }


      var newChecking = element.checking + (element.checking * interestRate);

      var chkJson = {
        checkTransactions :
        [{
          description : 'Interest Rate of ' + (interestRate*100) +'% applied',
          debit : 0,
          credit : (element.checking * interestRate),
          balance : newChecking
        }]
      };

      User.update({ _id : element._id },{ checking : newChecking, $pushAll : chkJson},function(err){});
    });
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

/**
* Increments incorrent login attempts
*/
exports.incLoginAttempts = function(user) {
  var MAX_LOGIN_ATTEMPTS = 5;

  // if user has waited, then reset their attempts to 0
  if ( user.loginAttempts >= MAX_LOGIN_ATTEMPTS && Date.now() >= user.lockUntil ) {
    this.unlockAccount(user);
  }

  var incAttempts = user.loginAttempts += 1;
  User.update({ _id : user._id }, { loginAttempts : incAttempts }, function(err){});

  // if the max attempts have been reached, lock the user
  if ( user.loginAttempts == MAX_LOGIN_ATTEMPTS ) {
    this.lockAccount(user);
  }

};

/**
* Lock user account if login attempts  == 5
*/
exports.lockAccount = function(user) {
  var lock_time = (5 * 60 * 1000) + Date.now(); // 60 * 60 * 1000 = 1 hour
  User.update({ _id : user._id }, { lockUntil : lock_time }, function(err){});
};

/**
* Unlock user account
*/
exports.unlockAccount = function(user) {
  User.update({ _id : user._id }, { loginAttempts : 0, lockUntil: 0 }, function(err){});
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
