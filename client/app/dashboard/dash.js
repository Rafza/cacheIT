// dash.js
'use strict';

angular.module('cacheItApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dash', {
        url: '/',
        templateUrl: 'app/dashboard/dash.html',
        controller: 'DashCtrl'
    });
});