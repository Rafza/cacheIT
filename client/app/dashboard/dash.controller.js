// dash.controller.js
'use strict';
angular.module('cacheItApp')
  .controller('DashCtrl', function ($scope, $location, Auth) {
    $scope.items = ['myaccount', 'transfer', 'setting'];
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

    $scope.checkLogin = function() {
      console.log("User is: " + $scope.isLoggedIn());
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
