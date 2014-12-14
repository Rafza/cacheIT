/*
 * Filename: account.js
 * Description: Handles account routing.
 */ 

'use strict';

angular.module('cacheItApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('recovery', {
        url: '/recovery',
        templateUrl: 'app/account/recovery/recovery.html',
        controller: 'RecoveryCtrl',
      });

  });
