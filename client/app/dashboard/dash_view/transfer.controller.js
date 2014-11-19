








//
//
//
//
//
//
//
//
//
//
//




// // dash.controller.js
// 'use strict';
// var myApp = angular.module('cacheItApp');
//
// // myApp.directive('ngFocus', [function() {
// //   var FOCUS_CLASS = "ng-focused";
// //   return {
// //     restrict: 'A',
// //     require: 'ngModel',
// //     link: function(scope, element, attrs, ctrl) {
// //       ctrl.$focused = false;
// //       element.bind('focus', function(evt) {
// //         element.addClass(FOCUS_CLASS);
// //         scope.$apply(function() {ctrl.$focused = true;});
// //       }).bind('blur', function(evt) {
// //         element.removeClass(FOCUS_CLASS);
// //         scope.$apply(function() {ctrl.$focused = false;});
// //       });
// //     }
// //   }
// // }]);
//
// myApp.controller('UserTranCtrl', function ($scope, $location, $http ,Auth, User, $q) {
//   // $scope.user.emailFrom = "test0@test.com";
//   // $scope.user.emailTo = "test1@test.com";
//   // $scope.user.amount = 10;
//   // $scope.users = User.query();
//   $scope.getCurrentUser = Auth.getCurrentUser;
//   $scope.fromEmail =  Auth.getCurrentUser().email;
//   $scope.errorFlag = false;
//   $scope.errorFrom = false;
//   $scope.errorTo = false;
//   $scope.errorAmount = false;
//   $scope.submitted = false;
//   $scope.confirm = function() {
//     $scope.submitted = true;
//
//
//   //  $scope.checkUsers($scope.user.emailFrom, $scope.user.emailTo, function(){});
//   $q.all([
//     Auth.checkUser($scope.fromEmail, function(result) {
//        console.log("checkUser() callback emailFrom: " + result);
//        $scope.errorFrom = result;
//      }),
//     Auth.checkUser($scope.user.emailTo, function(result) {
//        console.log("checkUser() callback emailTo: " + result);
//        $scope.errorTo = result;
//      })
//   ]).then(function(data) {
//
//     if(!$scope.errorFrom && !$scope.errorTo) {
//       var fromID = data[0][0]._id;
//       var fromOldAmt = data[0][0].checking;
//
//       var toID = data[1][0]._id;
//       var toOldAmt = data[1][0].checking;
//
//       var amount = $scope.user.amount;
//       // var overdraw = false;
//
//       if(amount <= fromOldAmt) {
//         console.log("data[0] :" + angular.toJson(fromID) );
//         var fromNewAmt = parseFloat(fromOldAmt)-parseFloat(amount);
//
//         // BEGIN put function
//         $http.put('/api/users/' + fromID + '/update',  { checking : fromNewAmt } ).
//         success(function(data, status, headers, config) {
//           // this callback will be called asynchronously
//           // when the response is available
//           console.log("Success Withdraw! Returning new saving amount:");
//           console.log(data.checking);
//           //$scope.newChecking = data.checking;
//           // usr.saving = data.saving;
//           // TODO: return json to update only one row to reduce refreshing effect
//         }).
//         error(function(data, status, headers, config) {
//           console.log("Failed Withdraw!: ");
//           // console.log(data.checking);
//           // called asynchronously if an error occurs
//           // or server returns response with an error status.
//         });
//         // END put function
//         console.log("data[1] :" + angular.toJson(toID) );
//         var toNewAmt = parseFloat(toOldAmt)+parseFloat(amount);
//
//         // BEGIN put function
//         $http.put('/api/users/' + toID + '/update',  { checking : toNewAmt } ).
//         success(function(data, status, headers, config) {
//           // this callback will be called asynchronously
//           // when the response is available
//           console.log("Success Deposit! Returning new saving amount:");
//           console.log(data.checking);
//           //$scope.newChecking = data.checking;
//           // usr.saving = data.saving;
//           // TODO: return json to update only one row to reduce refreshing effect
//         }).
//         error(function(data, status, headers, config) {
//           console.log("Failed Withdraw!: ");
//           // console.log(data.checking);
//           // called asynchronously if an error occurs
//           // or server returns response with an error status.
//         });
//         // END put function
//
//         $scope.errorAmount = false;
//       } else {
//         console.log("Overdrawing fromUser");
//         $scope.errorAmount = true;
//       }//END if-else
//     }//End if(!$scope.errorFrom && !$scope.errorTo)
//     console.log("after checking both users: " + $scope.errorFrom + " | " + $scope.errorTo);
//   });//End .then()
//
//
//   };
//
//   $scope.getTime = function() {
//
//     return $scope.date = new Date();
//   };
//
//
//
//   $scope.updateUsers = function() {
//     $scope.users = User.query();
//     console.log(users);
//   }
//
//
// });
