// dash.js
'use strict';

angular.module('cacheItApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin_dash', {
        url: '/admin_dash',
        templateUrl: 'app/admin_dashboard/dash.html',
        controller: 'AdminDashCtrl',
        authenticate: true
    });
});
