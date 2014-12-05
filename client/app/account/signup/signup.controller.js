'use strict';

angular.module('cacheItApp')
  .controller('SignupCtrl', function ($scope, $location, $http ,Auth, User,Transaction) {
    $scope.user = {};
    $scope.errors = {};


    $scope.register = function(form) {
      $scope.submitted = true;
      console.log("register(): " + form.$valid);
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
