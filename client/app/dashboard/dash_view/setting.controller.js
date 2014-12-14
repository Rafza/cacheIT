/*
 * Filename: setting.controller.js
 * Description: Handles the setting.html view, which performs settings
 */ 
'use strict';

angular.module('cacheItApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

   /*
    * Description: Changes the users passwords
    * Function: changePassword()
    */
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
