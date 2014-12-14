/*
 * Filename: dash.controller.js
 * Description: Contains logic for Dash redirects, and also dealing with login status.
 */ 

// dash.controller.js
'use strict';
angular.module('cacheItApp')
  .controller('AdminDashCtrl', function ($scope, $location, Auth) {
    $scope.items = ['teller','transfer'];
    $scope.selection = $scope.items[0];

    // Menu options
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.checkLogin = function() {
      //console.log("User is: " + $scope.isLoggedIn());
      //console.log($scope.isActive('/logout'));
      if($scope.isActive('/login') == false)
      {
          console.log( 'Logged Out' );
          //$location.path('/');
          return true;
      }
      return true;
    };

    // Logs user out and redirects to marketing page
    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    };

    // Check if route is loaded
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
