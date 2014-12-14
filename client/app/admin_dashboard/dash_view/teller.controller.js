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
  //$scope.accountType = ["Saving","Checking","Transfer"];
  $scope.accOptions=['Checking', 'Saving'];
  $scope.accSelected = $scope.accOptions[0];
  $scope.newChecking;
  $scope.newSaving;
  $scope.currentUser;

  /*
   * Get the latest data for a single user
   */
  $scope.updateCurrentUser = function(user) {
    console.log("What");
    $http.get('/api/users/' + user.email + '/email')
    .success(function(data) {
      $scope.currentUser = data[0];
      user = data[0];
    });
  }
//deletes the user
  $scope.delete = function(user) {
    User.remove({ id: user._id });
    angular.forEach($scope.users, function(u, i) {
      if (u === user) {
        $scope.users.splice(i, 1);
      }
    });
  };
/*
 * Function: closeAccount()
 * Parameters: Object  usr   --  user data
 *             String  type  --  account type to close
 * Description: closes account type cheking and saving and closes
 *              account as a whole.
 * 
 */
  $scope.closeAccount = function(user, accType) {
    var usr = $scope.currentUser;
    var myData;
    if(usr.accountType === 'none') {
      console.log("none...exiting");
      return false;
    }
    if(accType=='both') {
      $scope.delete(usr);
      $scope.users = User.query();
    } else {
      console.log("Current AccountType: " + angular.toJson(user.accountType));
      switch(accType) {
        case 'checking':
          if(user.accountType === 'checking') {
            myData = { checking : null, accountType : 'none'};
            console.log("None");
          } else {
            myData = {checking : null, accountType : 'saving' };
            console.log("removing saving");
          }
          break;
        case 'saving':
          if(user.accountType === 'saving') {
            myData = { saving : null, accountType : 'none' };
            console.log("None");
          } else {
            console.log("removing saving");
            myData = { saving : null, accountType : 'checking' };
          }
          break;
      }



      //Updating the database
      $http.put('/api/users/' + usr._id + '/update',  myData ).
      success(function(data, status, headers, config) {
        usr.checking = data.checking;
        usr.saving = data.saving;
        $scope.users = User.query();
      }).
      error(function(data, status, headers, config) {
        console.log("error!");
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
      // END put function
    }
    alert("Money will be sent to your address!!");


  }

  $scope.getTime = function() {
    return $scope.date = new Date();
  };

/*
 * Description: Deposit to an account
 * Function: depositAmt()
 * Parameters: Object  usr   --  user data
 *             Float   amt   --  amount to deposit
 *             String  type  --  account type to deposit
 */
  $scope.depositAmt = function(usr, amt, type) {

    console.log("Inside depositAmt()..." + amt);
    var negativeError = false;
    var transactionError = false;
    if ( parseFloat(amt) < 0 ) {
        negativeError = true;
    } else {
      Transaction.modifyAccount(usr,'deposit', type, amt, false,
      function(err){
          transactionError = err;
      }).then(function(data){
          usr.checking = data.checking;
          usr.saving = data.saving;

          //Get new users
          $scope.updateUsers();
      });
    }

  }

  $scope.withdrawError = {};
  /*
   * Description: Withdraw from an account
   * Function: withdrawAmt()
   * Parameters: Object  usr   --  user data
   *             Float   amt   --  amount to withdraw
   *             String  type  --  account type to withdraw
   */
  $scope.withdrawAmt = function(usr, amt, type) {
    console.log("Inside withdrawAmt()...A " + amt + " T" + type);

    var withdrawErr = {}
    withdrawErr.neg = false;
    withdrawErr.trans = false;
    withdrawErr.overdraw = false;

    if(angular.lowercase(type) === 'saving' && usr.saving < amt) {
      withdrawErr.overdraw = true;
    } else if (angular.lowercase(type) === 'checking' && usr.checking < amt) {
      withdrawErr.overdraw = true;
    }

    if( amt <= 0 ) {
        withdrawErr.neg = true;
    } else if (!withdrawErr.overdraw) {
      Transaction.modifyAccount(usr,'withdraw', type, amt, false,
      function(err){
          withdrawErr.trans = err;
      }).then(function(data){
          usr.checking = data.checking;
          usr.saving = data.saving;

          //Get new users
          $scope.updateUsers();
      });
    } else {
      console.log("Transaction not completed. Error Occured!");
    }
    $scope.withdrawError = withdrawErr;

  }
//update all users
  $scope.updateUsers = function() {
    $scope.users = User.query();
  }
  //updates current user
  $scope.updateOne = function(id) {
    $scope.currentUser;
  }

  $scope.setTrans = function(trans) {
    console.log(checkTrans);
    console.log(savTrans);

    $scope.currentTrans = checkTrans;
    $scope.currentTrans = savTrans;
  }


});
