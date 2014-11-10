// dash.controller.js
'use strict';
var myApp = angular.module('cacheItApp');

// myApp.directive('ngFocus', [function() {
//   var FOCUS_CLASS = "ng-focused";
//   return {
//     restrict: 'A',
//     require: 'ngModel',
//     link: function(scope, element, attrs, ctrl) {
//       ctrl.$focused = false;
//       element.bind('focus', function(evt) {
//         element.addClass(FOCUS_CLASS);
//         scope.$apply(function() {ctrl.$focused = true;});
//       }).bind('blur', function(evt) {
//         element.removeClass(FOCUS_CLASS);
//         scope.$apply(function() {ctrl.$focused = false;});
//       });
//     }
//   }
// }]);

myApp.controller('TranCtrl', function ($scope, $location, $http ,Auth, User) {
  $scope.users = User.query();

  $scope.fromAccOptions=['Checking', 'Saving'];
  $scope.toAccOptions=['Checking', 'Saving'];  
  $scope.fromAccSelected = $scope.fromAccOptions[0];
  $scope.toAccSelected = $scope.toAccOptions[0];


  $scope.accOptions=['Checking', 'Saving'];

  $scope.accSelected = $scope.accOptions[0];
  $scope.newChecking;
  $scope.newSaving;

  $scope.getTime = function() {

    return $scope.date = new Date();
  };



  $scope.updateUsers = function() {
    $scope.users = User.query();
  }


});
