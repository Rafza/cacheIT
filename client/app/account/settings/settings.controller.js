/*
 * Filename: setting.controller.js
 * Description: Changes password.
 */ 

'use strict';

angular.module('cacheItApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    // Changes password
    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });
