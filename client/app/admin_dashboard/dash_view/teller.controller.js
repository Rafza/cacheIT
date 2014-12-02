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

myApp.controller('TellerCtrl', function ($scope, $location, $http ,Auth, User,Transaction) {
  $scope.users = User.query();
  $scope.accountType = ["Saving","Checking","Transfer"];
  $scope.accOptions=['Checking', 'Saving'];
  $scope.accSelected = $scope.accOptions[0];
  $scope.newChecking;
  $scope.newSaving;
  $scope.currentUser;

  //Transaction Modal Function
  $scope.updateCurrentUser = function(myUser) {
    $scope.currentUser = myUser;
  }

  $scope.delete = function(user) {
    User.remove({ id: user._id });
    angular.forEach($scope.users, function(u, i) {
      if (u === user) {
        $scope.users.splice(i, 1);
      }
    });
  };

  $scope.closeAccount = function(accType) {
    var usr = $scope.currentUser;
    var myData;
    if(accType=='both') {
      $scope.delete(usr);
      $scope.users = User.query();
    } else {
      switch(accType) {
        case 'checking':
          myData = { checking : null, accountType : 'saving' };
          break;
        case 'saving':
          myData = { saving : null, accountType : 'checking' };
          break;
      }


      console.log(myData);


      $http.put('/api/users/' + usr._id + '/update',  myData ).
      success(function(data, status, headers, config) {
        usr.checking = data.checking;
        usr.saving = data.saving;

        console.log("Success Delete!");
      }).
      error(function(data, status, headers, config) {

        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
      // END put function
    }


  }

  $scope.getTime = function() {
    return $scope.date = new Date();
  };

  $scope.depositAmt = function(usr, amt, type) {
    var userID = usr._id;
    var chk = usr.checking;
    var sav = usr.saving;
    //var trans = usr.transactions;    
    var checkTrans = usr.checkTransactions;
    var savTrans = usr.savTransactions;


    console.log("Called Deposit.");
    if( type == 'Saving' ) {
      var newAmount = parseFloat(sav)+parseFloat(amt);
      // console.log("Deposit to Saving: " + amt + " Sav + Amt: " + newAmount);
      //
      // trans.forEach(function(entry){
      //   delete entry._id;
      // });
      //
      // trans = trans.concat([{
      //   date : $scope.getTime(),
      //   description : 'Deposit to Saving',
      //   debit : 0 ,
      //   credit : amt ,
      //   balance : newAmount
      // }]);
      // var myVar = angular.toJson(trans, true);
      // console.log( myVar  );


      // var myData = { saving : newAmount, transactions : trans};


      // console.log("My Data: " + angular.toJson(myData) );
      // BEGIN put function
      $http.put('/api/users/' + userID + '/update',  { saving : newAmount } ).
      success(function(data, status, headers, config) {
        var transaction = { credit : amt , balance : newAmount, description : "Deposit" };
        Transaction.push(data.email,transaction,0)
        .then( function(data) {
          console.log("SUccess! " + data);
        })
        .catch( function(err) {
          console.log("Failed!");
        });


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
        var transaction = { credit : amt , balance : newAmount, description : "Deposit" };
        Transaction.push(data.email,transaction,1)
        .then( function(data) {
          console.log("Success! " + data);
        })
        .catch( function(err) {
          console.log("Failed!");
        });
        //var transaction = { debit : , credit : amt, description : "Deposit" };
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
    //var trans = usr.transactions;
    var checkTrans = usr.checkTransactions;
    var savTrans = usr.savTransactions;

    // console.log("Called Withdraw.");
    if( type == 'Saving' && sav-amt >= 0 ) {
      var newAmount = sav-amt;
      // console.log("Withdraw Saving: " + amt + " Sav - Amt: " + newAmount + "Date: " + $scope.getTime() );
      $http.put('/api/users/' + userID + '/update', { saving : newAmount } ).
      success(function(data, status, headers, config) {


        var transaction = { debit : amt, balance : newAmount, description : "Withdraw" };
        Transaction.push(data.email,transaction,0)
        .then( function(data) {
          console.log("Success! " + data);
        })
        .catch( function(err) {
          console.log("Failed!");
        });


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

        var transaction = { debit : amt, balance : newAmount, description : "Withdraw" };
        Transaction.push(data.email,transaction,1)
        .then( function(data) {
          console.log("Success! " + data);
        })
        .catch( function(err) {
          console.log("Failed!");
        });
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
    //console.log(trans);
    console.log(checkTrans);
    console.log(savTrans);
    //$scope.currentTrans = trans;
    $scope.currentTrans = checkTrans;
    $scope.currentTrans = savTrans;
    // $scope.currentTrans = trans.concat([{
    //                          date : $scope.getTime(),
    //                          description : 'Deposit to Saving',
    //                          debit : 0,
    //                          credit : 12 ,
    //                          balance : 12
    //                      }]);
  }


});
