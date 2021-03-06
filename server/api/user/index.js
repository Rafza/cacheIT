/*
 * Filename: index.js
 * Description: Handles the HTTP requests by sending the parameters to the controllers
 */ 

'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

// Express Routing
router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/setPassword', controller.setPassword);
router.get('/:id', auth.isAuthenticated(), controller.show);

//Method used to withdraw from saving and checking
router.get('/:email/email', controller.showName);
router.put('/:id/update', auth.isAuthenticated(), controller.update);

//Push document
router.put('/:name/push', auth.isAuthenticated(), controller.pushCreate);

router.post('/', controller.create);

module.exports = router;
