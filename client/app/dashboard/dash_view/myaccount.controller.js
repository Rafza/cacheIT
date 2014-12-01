// dash.controller.js
'use strict';
angular.module('cacheItApp').controller('AccountCtrl', AccCtrl);

// Pass this function into the angular controller
// Using different style of declaring controller using this keyword
function AccCtrl($location, Auth, Transaction) {
  //this.savBal = 1234;
  //this.checkBal = 1337;
  this.isLoggedIn = Auth.isLoggedIn;
  this.isAdmin = Auth.isAdmin;
  this.getCurrentUser = Auth.getCurrentUser;
  // this.toggle = true;

}

//Description: Method to withdraw money from account.
//Param: Double amount, amount to with draw
//       String accType, the account type - saving or checking
// AccCtrl.prototype.withdraw = function(amount, accType) {

// };



