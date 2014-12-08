'use strict';

angular.module('cacheItApp')
  .controller('AdminCtrl', function ($scope, Modal, $location, $http, Auth, User, Transaction) {

    //Check LoginIn with callback redirect -- Alex
    // Auth.isLoggedInAsync(function(loggedIn) {
    // if (next.authenticate && !loggedIn) {
    // $location.path('/'); }
    // });

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    //$scope.users;

    // $scope.delete = function(user) {
    //   User.remove({ id: user._id });
    //   angular.forEach($scope.users, function(u, i) {
    //     if (u === user) {
    //       $scope.users.splice(i, 1);
    //     }
    //   });
    // };
    // Modal.confirm.delete returns a function that will open a modal when ran
    // We use closure to define the callback for the modal's confirm action here in the controller
    $scope.delete = Modal.confirm.delete(function(user) { // callback when modal is confirmed
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    });

    $scope.add = function(user, amt) {
      User.where({ id: user._id }).update({ checking: 3939 }, callback);
    };
    // Function: sendData()
    // Paramater:
    // user - the email for the user you want to update
    // transaction = {
    //   description : String,
    //   debit : Number,
    //   credit : Number,
    // }
    // ex. var transaction = { debit : 3333, credit : 4444, description : "Hi" };
    // Returns: void
    $scope.sendData = function(user, transaction) {
      Transaction.push(user, transaction)
      .then( function(data) {
        console.log("SUccess! " + data);
      })
      .catch( function(err) {
        console.log("Failed!");
      });eter
    }
    //function(email, type, amount, setHistory, callback)
    //callback(err)
    $scope.sendData2 = function(user) {
      Transaction.deposit(user, "saving", 100, true, function(err){

      }).then(function(data){
        
      });
    }
  });
