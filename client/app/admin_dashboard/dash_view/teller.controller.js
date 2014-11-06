// dash.controller.js
'use strict';
angular.module('cacheItApp')
  .controller('TellerCtrl', function ($scope, $location, $http ,Auth, User) {
    $scope.users = User.query();
    $scope.accountType = ["Saving","Checking","Transfer"];

    $scope.depositAmt = function(userID, chk, sav, amt, type) {
      console.log("Called Deposit.");
      if( type == 'Saving' ) {
        var newAmount = parseFloat(sav)+parseFloat(amt);
        console.log("Deposit from Saving: " + amt + " Sav + Amt: " + newAmount);
        $http.put('/api/users/' + userID + '/update', { saving : newAmount } );
      } else if (type == 'Checking') {
        var newAmount = parseFloat(chk)+parseFloat(amt);
        console.log("Deposit from Checking: " + amt + " Chk + Amt: " + newAmount);
        $http.put('/api/users/' + userID + '/update', { checking : newAmount } );
      }
      $scope.updateUsers();
    };

    $scope.withdrawAmt = function(userID, chk, sav, amt, type) {
      console.log("Called Deposit.");
      if( type == 'Saving' ) {

        var newAmount = sav-amt;
        console.log("Withdraw from Saving: " + amt + " Sav - Amt: " + newAmount);
        $http.put('/api/users/' + userID + '/update', { saving : newAmount } );

      } else if (type == 'Checking') {
        var newAmount = chk-amt;
        console.log("Withdraw from Checking: " + amt + " Chk - Amt: " + newAmount);
        $http.put('/api/users/' + userID + '/update', { checking : newAmount } );
      }
      $scope.updateUsers();
    };

    $scope.updateUsers = function() {
      $scope.users = User.query();
    }
  });
