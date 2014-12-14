/*
 * Filename: recover.controller.js
 * Description: Handles recover user and assigning new temp password
 */ 

'use strict';

angular.module('cacheItApp')
.controller('RecoveryCtrl', function ($scope, $location, $http ,Auth, User,Transaction, myService) {
  $scope.errors = {};
  $scope.errFlag = false;
  $scope.message = "";

  // Recover user with some validation and also temporary password replacement
  $scope.recoverUser = function(form) {
    Auth.checkUser($scope.user.email, function(err){
      console.log("Err: " + err);
      $scope.errFlag = err;
    }).then(function(data) {
      if (!data[0]) {
        $scope.message = "No user exists with that email";
      }
      else {
          if (!($scope.user.questionOne === data[0].questionOne) ||
              !($scope.user.questionTwo === data[0].questionTwo) ) {
                $scope.message = "One or more of your responses was incorrect";
              }
          else {
            //var newPass = Math.random() * 1000000;
            var newPass = Math.round(Math.random() * 10000000);
            Auth.setPassword(data[0]._id, newPass);
            $scope.message = "Your new temporary password is: " + newPass;
          }
      }
    });
  }
});
