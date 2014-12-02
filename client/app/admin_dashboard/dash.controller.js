// dash.controller.js
'use strict';
angular.module('cacheItApp')
  .controller('AdminDashCtrl', function ($scope, $location, Auth) {
    $scope.items = ['teller','transfer'];//TODO: Change back to teller first
    $scope.selection = $scope.items[0];

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.checkLogin = function() {
    //  console.log("User is: " + $scope.isLoggedIn());
      //console.log($scope.isActive('/logout'));
      if($scope.isActive('/login') == false)
      {
          console.log( 'Logged Out' );
          //$location.path('/');
          return true;
      }
      return true;
    };


    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
