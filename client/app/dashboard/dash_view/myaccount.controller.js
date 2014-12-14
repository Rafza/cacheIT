/*
 * Filename: setting.controller.js
 * Description: Handles the setting.html view, which performs settings
 */ 
'use strict';
angular.module('cacheItApp').controller('AccountCtrl', AccCtrl);

/*
* Description: Account Controller
* Function: AccCtrl()
* Note: Pass this function into the angular controller
* Using different style of declaring controller using this keyword
*/
function AccCtrl($location, Auth, Transaction) {
  this.isLoggedIn = Auth.isLoggedIn;
  this.isAdmin = Auth.isAdmin;
  this.getCurrentUser = Auth.getCurrentUser;
}



