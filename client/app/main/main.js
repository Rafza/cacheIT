/*
 * Filename: main.js
 * Description: Main (folder) routing.
 */ 

'use strict';

angular.module('cacheItApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html'
      });
  });
