'use strict';

angular.module('cacheItApp')
  .controller('AdminCtrl', function ($scope,$location, $http, Auth, User) {

    //Check LoginIn with callback redirect -- Alex
    // Auth.isLoggedInAsync(function(loggedIn) {
    // if (next.authenticate && !loggedIn) {
    // $location.path('/'); }
    // });

    // Use the User $resource to fetch all users
    //$scope.users = User.query();
    //$scope.users;

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.add = function(user, amt) {
      User.where({ id: user._id }).update({ checking: 3939 }, callback);
    };
  });
