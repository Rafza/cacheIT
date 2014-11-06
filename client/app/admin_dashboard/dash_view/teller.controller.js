// dash.controller.js
'use strict';
angular.module('cacheItApp')
.controller('TellerCtrl', function ($scope, $location, $http ,Auth, User) {
  $scope.users = User.query();
  $scope.accountType = ["Saving","Checking","Transfer"];

  $scope.getTime = function() {
    return $scope.date = new Date();
  };

  $scope.depositAmt = function(usr, amt, type) {
    var userID = usr._id;
    var chk = usr.checking;
    var sav = usr.saving;
    var trans = usr.transactions;


    console.log("Called Deposit.");
    if( type == 'Saving' ) {
      var newAmount = parseFloat(sav)+parseFloat(amt);
      console.log("Deposit to Saving: " + amt + " Sav + Amt: " + newAmount);


      // trans = trans.concat([{
      //   date : $scope.getTime(),
      //   description : 'Deposit to Saving',
      //   debit : 0 ,
      //   credit : amt ,
      //   balance : newAmount
      // }]);
      //
      // console.log(  angular.toJson(trans));
      $http.put('/api/users/' + userID + '/update', { saving : newAmount     });
    } else if (type == 'Checking') {
      var newAmount = parseFloat(chk)+parseFloat(amt);
      console.log("Deposit from Checking: " + amt + " Chk + Amt: " + newAmount);
      $http.put('/api/users/' + userID + '/update', { checking : newAmount} );
    }
    $scope.updateUsers();
    };

    $scope.withdrawAmt = function(usr, amt, type) {
      var userID = usr._id;
      var chk = usr.checking;
      var sav = usr.saving;
      var trans = usr.transactions;

      console.log("Called Deposit.");
      if( type == 'Saving' && sav-amt >= 0 ) {

        var newAmount = sav-amt;
        console.log("Withdraw Saving: " + amt + " Sav - Amt: " + newAmount + "Date: " + $scope.getTime() );
        $http.put('/api/users/' + userID + '/update', { saving : newAmount, transactions : {$push: { date : "10/30/2025" }} } );

      } else if (type == 'Checking' && chk-amt >= 0 ) {
        var newAmount = chk-amt;
        console.log("Withdraw from Checking: " + amt + " Chk - Amt: " + newAmount);
        $http.put('/api/users/' + userID + '/update', { checking : newAmount});
      }
      $scope.updateUsers();
    };

    $scope.updateUsers = function() {
      $scope.users = User.query();
    }


    $scope.setTrans = function(trans) {
      console.log(trans);
      $scope.currentTrans = trans;
      // $scope.currentTrans = trans.concat([{
      //                          date : $scope.getTime(),
      //                          description : 'Deposit to Saving',
      //                          debit : 0,
      //                          credit : 12 ,
      //                          balance : 12
      //                      }]);
    }


  });
