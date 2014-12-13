/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var controller = require('./api/user/user.controller');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;

var counter = 0;
// Use Cron
var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '*/1 * * * * *',
  onTick: function() {
    // console.log("Day " + (1+(++counter)%30) +" Updating Penalty/Interest...");
    controller.incrementDays();
  },
  start: false,
  timeZone: "America/Los_Angeles"
});
job.start();
