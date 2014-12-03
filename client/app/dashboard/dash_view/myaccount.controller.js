// dash.controller.js
'use strict';
angular.module('cacheItApp').controller('AccountCtrl', AccCtrl);

// Pass this function into the angular controller
// Using different style of declaring controller using this keyword
function AccCtrl($location, Auth, Transaction) {
  this.isLoggedIn = Auth.isLoggedIn;
  this.isAdmin = Auth.isAdmin;
  this.getCurrentUser = Auth.getCurrentUser;
}



