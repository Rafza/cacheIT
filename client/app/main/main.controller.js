'use strict';
/*
 * Two Seperate Controllers to Handle Login/Signup for main.html
 */
 
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
          if($scope.user.email=="admin@admin.com") {
            $location.path('/admin_dash');
          } else {
            $location.path('/dash');
          }

        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    // Redirect to recovery page
    $scope.recover = function() {
      $location.path('/recovery');
    };

  });

// Signup Handling. Transfers user input to signup page
myModule.controller('SignCtrl', function ($scope, Auth, $location, myService) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(signupForm) {
      $scope.submitted = true;
      myService.saveField($scope.signup.name);
      myService.setEmail($scope.signup.email);
      myService.setPassword($scope.signup.password);
      myService.setlastName($scope.signup.lastName);

      // Redirect to signup page with autofilled data
      $location.path('/signup');
    };
  });
