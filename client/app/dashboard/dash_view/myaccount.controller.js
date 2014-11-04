// dash.controller.js
'use strict';
angular.module('cacheItApp').controller('AccountCtrl', AccCtrl);

// Pass this function into the angular controller
// Using different style of declaring controller using this keyword
function AccCtrl($location, Auth) {
  this.savBal = 1234;
  this.checkBal = 1337;  
  this.isLoggedIn = Auth.isLoggedIn;
  this.isAdmin = Auth.isAdmin;
  this.getCurrentUser = Auth.getCurrentUser;
}


//
// angular.module('controllerAsExample', [])
//   .controller('SettingsController1', SettingsController1);
//
// function SettingsController1() {
//   this.name = "John Smith";
//   this.contacts = [
//     {type: 'phone', value: '408 555 1212'},
//     {type: 'email', value: 'john.smith@example.org'} ];
// }
//
// SettingsController1.prototype.greet = function() {
//   alert(this.name);
// };
//
// SettingsController1.prototype.addContact = function() {
//   this.contacts.push({type: 'email', value: 'yourname@example.org'});
// };
//
// SettingsController1.prototype.removeContact = function(contactToRemove) {
//  var index = this.contacts.indexOf(contactToRemove);
//   this.contacts.splice(index, 1);
// };
//
// SettingsController1.prototype.clearContact = function(contact) {
//   contact.type = 'phone';
//   contact.value = '';
// };
// Example Code for reference
// angular.module('controllerExample', [])
//   .controller('SettingsController2', ['$scope', SettingsController2]);
//
// function SettingsController2($scope) {
//   $scope.name = "John Smith";
//   $scope.contacts = [
//     {type:'phone', value:'408 555 1212'},
//     {type:'email', value:'john.smith@example.org'} ];
//
//   $scope.greet = function() {
//     alert($scope.name);
//   };
//
//   $scope.addContact = function() {
//     $scope.contacts.push({type:'email', value:'yourname@example.org'});
//   };
//
//   $scope.removeContact = function(contactToRemove) {
//     var index = $scope.contacts.indexOf(contactToRemove);
//     $scope.contacts.splice(index, 1);
//   };
//
//   $scope.clearContact = function(contact) {
//     contact.type = 'phone';
//     contact.value = '';
//   };
// }
