// dash.controller.js
'use strict';
var myApp = angular.module('cacheItApp');

// myApp.directive('ngFocus', [function() {
//   var FOCUS_CLASS = "ng-focused";
//   return {
//     restrict: 'A',
//     require: 'ngModel',
//     link: function(scope, element, attrs, ctrl) {
//       ctrl.$focused = false;
//       element.bind('focus', function(evt) {
//         element.addClass(FOCUS_CLASS);
//         scope.$apply(function() {ctrl.$focused = true;});
//       }).bind('blur', function(evt) {
//         element.removeClass(FOCUS_CLASS);
//         scope.$apply(function() {ctrl.$focused = false;});
//       });
//     }
//   }
// }]);

myApp.controller('TranCtrl', function ($scope, $location, $http ,Auth, User, $q) {
  $scope.users = User.query();
  // begin same Account added
  $scope.accountType = ["Saving","Checking","Transfer"];
  $scope.accOptionsFrom=['Checking', 'Saving'];
  $scope.accSelectedFrom = $scope.accOptionsFrom[0];

  $scope.accOptionsTo=['Checking', 'Saving'];
  $scope.accSelectedTo = $scope.accOptionsTo[0];
  console.log("From checking------: "+$scope.accSelectedFrom);
  console.log("To saving-----t: "+$scope.accSelectedTo);
  $scope.errorAcc = false;
  $scope.errorAmt = false;
  //finish old Account added
  $scope.errorFlag = false;
  $scope.errorFrom = false;
  $scope.errorTo = false;
  $scope.errorAmount = false;
  $scope.submitted = false;
// 
// Begin Same Account
// 
 $scope.confirmAcc = function() 
  {
    $scope.submitted = true;


  //  $scope.checkUsers($scope.user.emailFrom, $scope.user.emailTo, function(){});
  $q.all([

    // begin new added 
    Auth.checkUser($scope.user.emailAcc, function(result) {
       console.log("checkUser() callback emailAcc: " + result);
       $scope.errorAcc = result;
     })//finish new added
  ]).then(function(data) {

    if(!$scope.errorAcc)
    {
      var a = "checking";
      var b = "saving";
      var from = $scope.accSelectedFrom;
      var to = $scope.accSelectedTo;
      console.log("FROM ****"+from)
      console.log("TO ****"+to)
      var accID = data[0][0]._id;
      if(a === from)
      {
      var fromOldAmt = data[0][0].checking;
      var toOldAmt = data[0][0].Saving;
      }
      else 
      {
        console.log("didnt work man!!");
      }

      var amount = $scope.user.amountAcc;
      console.log("from Amount"+fromOldAmt);
      console.log("to Amount"+toOldAmt);
      // console.log("From same Account: "+from);
      // console.log("To same Account: "+to);
      // console.log("From same Account: "+amount);
    }
      if(amount <= fromOldAmt) 
      {
        console.log("data[0] :" + angular.toJson(accID) );
        var fromNewAmt = parseFloat(fromOldAmt)-parseFloat(amount);

        // BEGIN put function
        $http.put('/api/users/' + accID + '/update',  {from : fromNewAmt } ).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log("Success Withdraw! Returning new saving amount:");
          console.log("NEW amount ON FROM"+data.from);
          //$scope.newChecking = data.checking;
          // usr.saving = data.saving;
          // TODO: return json to update only one row to reduce refreshing effect
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        // END put function
        console.log("data[1] :" + angular.toJson(accID) );
        var toNewAmt = parseFloat(toOldAmt)+parseFloat(amount);

        // BEGIN put function
        $http.put('/api/users/' + accID + '/update',  { to : toNewAmt}).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log("Success Deposit! Returning new saving amount:");
          console.log("NEW AMOUNT ON TO "+data.to);
          //$scope.newChecking = data.checking;
          // usr.saving = data.saving;
          // TODO: return json to update only one row to reduce refreshing effect
        }).
        error(function(data, status, headers, config) {
          console.log("Failed Withdraw!: ");
          // console.log(data.checking);
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        // END put function

        $scope.errorAmt = false;
      } 
      else 
      {
        console.log("Overdrawing fromUser");
        $scope.errorAmt = true;
      }
    console.log("after checking both users: " + $scope.errorAcc + " | " + $scope.errorAcc);
  });


  };
// 
// End same Account
// 
  $scope.confirm = function() 
  {
    $scope.submitted = true;


  //  $scope.checkUsers($scope.user.emailFrom, $scope.user.emailTo, function(){});
  $q.all([
    Auth.checkUser($scope.user.emailFrom, function(result) {
       console.log("checkUser() callback emailFrom: " + result);
       $scope.errorFrom = result;
     }),
    Auth.checkUser($scope.user.emailTo, function(result) {
       console.log("checkUser() callback emailTo: " + result);
       $scope.errorTo = result;
     })

  ]).then(function(data) {

    if(!$scope.errorFrom && !$scope.errorTo) 
    {
      var fromID = data[0][0]._id;
      var fromOldAmt = data[0][0].checking;

      var toID = data[1][0]._id;
      var toOldAmt = data[1][0].checking;
      var amount = $scope.user.amount;
      // var overdraw = false;

      if(amount <= fromOldAmt) 
      {
        console.log("data[0] :" + angular.toJson(fromID) );
        var fromNewAmt = parseFloat(fromOldAmt)-parseFloat(amount);

        // BEGIN put function
        $http.put('/api/users/' + fromID + '/update',  { checking : fromNewAmt } ).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log("Success Withdraw! Returning new saving amount:");
          console.log(data.checking);
          //$scope.newChecking = data.checking;
          // usr.saving = data.saving;
          // TODO: return json to update only one row to reduce refreshing effect
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        // END put function
        console.log("data[1] :" + angular.toJson(toID) );
        var toNewAmt = parseFloat(toOldAmt)+parseFloat(amount);

        // BEGIN put function
        $http.put('/api/users/' + toID + '/update',  { checking : toNewAmt } ).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log("Success Deposit! Returning new saving amount:");
          console.log(data.checking);
          //$scope.newChecking = data.checking;
          // usr.saving = data.saving;
          // TODO: return json to update only one row to reduce refreshing effect
        }).
        error(function(data, status, headers, config) {
          console.log("Failed Withdraw!: ");
          // console.log(data.checking);
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        // END put function

        $scope.errorAmount = false;
      } 
      else 
      {
        console.log("Overdrawing fromUser");
        $scope.errorAmount = true;
      }

    }
    console.log("after checking both users: " + $scope.errorFrom + " | " + $scope.errorTo);
  });


  };

  $scope.getTime = function() {

    return $scope.date = new Date();
  };



  $scope.updateUsers = function() {
    $scope.users = User.query();
    console.log(users);
  }


});
