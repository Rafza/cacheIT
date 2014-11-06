/**
* Populate DB with sample data on server start
* to disable, edit config/environment/index.js, and set `seedDB: false`
*/

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');

Thing.find({}).remove(function() {
  Thing.create(//{
  //   name : 'Development Tools',
  //   info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  // },
  {
    name : 'sam',
    info : 'This is my sam\'s account test',
    bankAcc : { saving : 1234, checking : 5678 },
    transactions :
    [{
      date : '11/1/2014',
      description : 'Another Transaction',
      debit : 580 ,
      credit : 50 ,
      balance : 501},
    {
      date : '11/2/2014',
      description : 'Another One',
      debit : 122 ,
      credit : 213,
      balance : -2131
    }]
    },
    {
    name : 'alex',
    info : 'This is my account test',
    bankAcc : { saving : 1234, checking : 5678 },
    transactions :
    [{
      date : '10/30/2014',
      description : 'Transaction Test',
      debit : 0 ,
      credit : 100 ,
      balance : 100
    },
    {
      date : '11/1/2014',
      description : 'Another Transaction',
      debit : 50 ,
      credit : 0 ,
      balance : 50},
    {
      date : '11/2/2014',
      description : 'Another One',
      debit : 75 ,
      credit : 0 ,
      balance : -25
    }]

  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User0',
    email: 'test0@test.com',
    password: 'test',
    checking: 4487,
    saving: 7898
  },{
    provider: 'local',
    name: 'Test User1',
    email: 'test1@test.com',
    password: 'test',
    checking: 78,
    saving: 934
  },{
    provider: 'local',
    name: 'Test User2',
    email: 'test2@test.com',
    password: 'test',
    checking: 4936,
    saving: 45
  },{
    provider: 'local',
    name: 'Test User3',
    email: 'test3@test.com',
    password: 'test',
    checking: 778,
    saving: 356
  },{
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
    console.log('finished populating users');
  }
);
});
