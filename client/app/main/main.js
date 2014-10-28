'use strict';

angular.module('cacheItApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: 'app/main/main.html'
      });
  });