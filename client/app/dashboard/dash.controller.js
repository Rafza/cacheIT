// dash.controller.js
'use strict';
angular.module('cacheItApp')
  .controller('DashCtrl', function ($scope, $location, Auth, User) {

    //This method is used to check the user authentication by performing
    //an action that a logged in user can execute. The user authentication
    //automatically handles this causing it to act as login check.
    //User.get();

    $scope.items = ['myaccount', 'transfer', 'setting', 'teller'];
    $scope.selection = $scope.items[0];

    $scope.testVal = 111333;

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;


    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
