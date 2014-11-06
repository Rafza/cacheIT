// dash.controller.js
'use strict';
var myApp = angular.module('cacheItApp');

myApp.directive('ngFocus', [function() {
  var FOCUS_CLASS = "ng-focused";
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      ctrl.$focused = false;
      element.bind('focus', function(evt) {
        element.addClass(FOCUS_CLASS);
        scope.$apply(function() {ctrl.$focused = true;});
      }).bind('blur', function(evt) {
        element.removeClass(FOCUS_CLASS);
        scope.$apply(function() {ctrl.$focused = false;});
      });
    }
  }
}]);

myApp.controller('TellerCtrl', function ($scope, $location, $http ,Auth, User) {
  $scope.users = User.query();
  $scope.accountType = ["Saving","Checking","Transfer"];
  $scope.accOptions=['Checking', 'Saving'];
  $scope.accSelected = $scope.accOptions[0];
  $scope.newChecking;
  $scope.newSaving;
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
      // console.log("Deposit to Saving: " + amt + " Sav + Amt: " + newAmount);


      // trans = trans.concat([{
      //   date : $scope.getTime(),
      //   description : 'Deposit to Saving',
      //   debit : 0 ,
      //   credit : amt ,
      //   balance : newAmount
      // }]);
      //
      // console.log(  angular.toJson(trans));


      // BEGIN put function
      $http.put('/api/users/' + userID + '/update', { saving : newAmount     }).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("Success Deposit! Returning new saving amount:");
        console.log(data.saving);
        //$scope.newChecking = data.checking;
        usr.saving = data.saving;
        // TODO: return json to update only one row to reduce refreshing effect
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.

      });
      // END put function


    } else if (type == 'Checking') {
      var newAmount = parseFloat(chk)+parseFloat(amt);
      // console.log("Deposit from Checking: " + amt + " Chk + Amt: " + newAmount);

      // BEGIN put function
      $http.put('/api/users/' + userID + '/update', { checking : newAmount} ).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("Success Deposit! Returning new checking amount:");
        console.log(data.checking);
        //$scope.newChecking = data.checking;
        usr.checking = data.checking;
        // TODO: return json to update only one row to reduce refreshing effect
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.

      });
      // END put function

    }
    //$scope.updateUsers();
    return usr;
  };

  // Function: withdrawAmt
  // Description: Used to withdraw money from users account
  // TODO: validation checks
  $scope.withdrawAmt = function(usr, amt, type) {
    var userID = usr._id;
    var chk = usr.checking;
    var sav = usr.saving;
    var trans = usr.transactions;

    // console.log("Called Withdraw.");
    if( type == 'Saving' && sav-amt >= 0 ) {
      var newAmount = sav-amt;
      // console.log("Withdraw Saving: " + amt + " Sav - Amt: " + newAmount + "Date: " + $scope.getTime() );
      $http.put('/api/users/' + userID + '/update', { saving : newAmount, transactions : {$push: { date : "10/30/2025" }} } ).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("Success Withdraw! Returning new saving amount:");
        console.log(data.checking);
        //$scope.newChecking = data.checking;
        usr.saving = data.saving;
        // TODO: return json to update only one row to reduce refreshing effect
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.

      });

    } else if (type == 'Checking' && chk-amt >= 0 ) {
      var newAmount = chk-amt;
      // console.log("Withdraw from Checking: " + amt + " Chk - Amt: " + newAmount);
      $http.put('/api/users/' + userID + '/update', { checking : newAmount}).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("Success Withdraw! Returning new checking amount:");
        console.log(data.checking);
        //$scope.newChecking = data.checking;
        usr.checking = data.checking;
        // TODO: return json to update only one row to reduce refreshing effect
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.

      });
    }
    //$scope.updateUsers();
    return usr;
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
