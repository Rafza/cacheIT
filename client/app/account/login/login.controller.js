'use strict';

angular.module('econerinApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
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
          $scope.isAdmin = Auth.isAdmin;
          console.log("isAdmin() " + $scope.isAdmin() );
          // Logged in, redirect to home
          if($scope.user.email=='admin@admin.com') {
            $location.path('/admin');
          } else {
            $location.path('/wait');
          }
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
