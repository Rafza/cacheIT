/*
 * Filename: index.js
 * Description: API used for testing.  Not used in production.
 */ 

'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/name/:name', controller.showName);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.get('/wd/:id/:amt', controller.withdraw);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
