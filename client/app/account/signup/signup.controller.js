/*
 * Filename: signup.controller.js
 * Description: Registers user.
 */ 

'use strict';

angular.module('cacheItApp')
  .controller('SignupCtrl', function ($scope, $location, $http ,Auth, User,Transaction, myService) {
    $scope.user = {};
    $scope.errors = {};
    $scope.user.name = myService.getField();
    $scope.user.email = myService.getEmail();
    $scope.user.password = myService.getPassword();
    $scope.user.lastName = myService.getlastName();

    // Register user and redirect to dash after account creation
    $scope.register = function(form) {
      console.log("register(): " + form.$valid);
      console.log("Err: " + form.$valid);
      $scope.submitted = true;
      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          lastName: $scope.user.lastName,
          email: $scope.user.email,
          password: $scope.user.password,
          address: $scope.user.address,
          phoneNumber: $scope.user.phoneNumber,
          questionOne: $scope.user.questionOne,
          questionTwo: $scope.user.questionTwo

        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/dash');
        })
        .catch( function(err) {
          err = err.data;
          console.log("Err: " + err);
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  });
