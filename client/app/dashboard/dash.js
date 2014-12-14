// Filename: dash.js
// Angular URL Router
'use strict';

angular.module('cacheItApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dash', {
        url: '/dash',
        templateUrl: 'app/dashboard/dash.html',
        controller: 'DashCtrl'
    });
});
