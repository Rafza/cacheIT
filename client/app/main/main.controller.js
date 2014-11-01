'use strict';
// Login handling
var myModule = angular.module('cacheItApp');

myModule.controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/dash');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });

// Signup Handling

myModule.controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(signupForm) {
      $scope.submitted = true;

      if(signupForm.$valid) {
        Auth.createUser({
          name: $scope.signup.name,
          email: $scope.signup.email,
          password: $scope.signup.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/dash');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            signupForm[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  });
