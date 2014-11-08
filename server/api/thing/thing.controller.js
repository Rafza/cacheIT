/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');

// Get list of things
exports.index = function(req, res) {


  // var myvar1 = {
  //   'saving' : 123,
  //   'transactions' : [{'id' :1}, {'id' : 2}]
  //   };
  // var myvar2 = {
  //   'saving' : 123,
  //   'transactions' : [{'id' : 3}, {'id' : 4}]
  //   };
  // myvar1.push(myvar2);
  //
  //
  // console.log(myvar1);
  // var updated = _.extend(myvar1, myvar2);
  // console.log(updated);


  Thing.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};
// Get a single thing by name
exports.showName = function(req, res) {
  var userId = req.params.name;
  console.log("What's up?" + userId);


  Thing.findById(userId,function(err,docs) {
  if(err) { return handleError(res, err); }
    console.log(docs.info);
    return res.json(200, docs);
  });
};
// Updates an existing thing in the DB.
exports.withdraw = function(req, res) {

  var newAmt = Number(req.params.amt);
  var id = String(req.params.id);
  //var userId = req.user._id;
  console.log("id: " + id);
  console.log("Amount: " + newAmt);

  // Begin Find
  Thing.findById(id,function(err,docs) {
    var oldAmt = Number(docs.bankAcc.checking);
    console.log("Old Amount: " + oldAmt);
    console.log("New Amount: " + newAmt);
    newAmt = oldAmt - newAmt;
    console.log("New Total: " + newAmt);
    docs.bankAcc.checking = newAmt;
    //Begin Save to DB
    docs.save(function(err) {
      if (err) return validationError(res, err);
        res.send(200);
    });// End Save to DB

  });// End Find
};
/**
 * Change a users password
 */
// exports.changePassword = function(req, res, next) {
//   var userId = req.user._id;
//   var oldPass = String(req.body.oldPassword);
//   var newPass = String(req.body.newPassword);
//
//   User.findById(userId, function (err, user) {
//     if(user.authenticate(oldPass)) {
//       user.password = newPass;
//       user.save(function(err) {
//         if (err) return validationError(res, err);
//         res.send(200);
//       });
//     } else {
//       res.send(403);
//     }
//   });
// };
// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {

  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
