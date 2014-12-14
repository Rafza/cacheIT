/*
 * Filename: transfer.controller.js
 * Description: 
    Transfer funds for user
 */ 
'use strict';
var myApp = angular.module('cacheItApp');

myApp.controller('TranCtrl', function ($scope, $location, $http, Auth, User, $q, Transaction) {
  $scope.users = User.query();
  // begin same Account added
  $scope.accountType = ["Saving","Checking","Transfer"];
  $scope.tranTypeOptions = ["Same Account","Different Account"];
  $scope.accOptionsFrom=['Checking', 'Saving'];
  $scope.accSelectedFrom = $scope.accOptionsFrom[0];

  $scope.accOptionsTo=['Checking', 'Saving'];
  $scope.accSelectedTo = $scope.accOptionsTo[0];
  // console.log("From checking------: "+$scope.accSelectedFrom);
  // console.log("To saving-----t: "+$scope.accSelectedTo);
  $scope.errorAcc = false;
  $scope.errorAmt = false;
  $scope.errorType = false;
  //finish old Account added
  $scope.errorFlag = false;
  $scope.errorFrom = false;
  $scope.errorTo = false;
  $scope.errorAmount = false;
  $scope.submitted = false;



//
// Begin Same Account
//
 // $scope.confirmAcc = function()
 //  {
 //    $scope.submitted = true;


 //  //  $scope.checkUsers($scope.user.emailFrom, $scope.user.emailTo, function(){});
 //  $q.all([

 //    // begin new added
 //    Auth.checkUser($scope.user.emailAcc, function(result) {
 //       // console.log("checkUser() callback emailAcc: " + result);
 //       $scope.errorAcc = result;
 //     })//finish new added
 //  ]).then(function(data) {

 //    if(!$scope.errorAcc)
 //    {
 //      var from = $scope.accSelectedFrom;
 //      var to = $scope.accSelectedTo;
 //      // console.log("FROM ****"+from)
 //      // console.log("TO ****"+to)
 //      var accID = data[0][0]._id;

 //      var toOldAmt = 0;
 //      var fromOldAmt = 0;

 //      if('Checking' == from && 'Saving' == to){
 //        fromOldAmt = data[0][0].checking;
 //        toOldAmt = data[0][0].saving;
 //      }
 //       else if('Checking' == to && 'Saving' == from) {
 //        fromOldAmt = data[0][0].saving;
 //        toOldAmt = data[0][0].checking;
 //      }

 //      var amount = $scope.user .amountAcc;
 //      console.log("from Amount:-"+fromOldAmt);
 //      console.log("to Amount:- "+toOldAmt);
 //      // console.log("From same Account: "+from);
 //      // console.log("To same Account: "+to);
 //      // console.log("From same Account: "+amount);
 //    }
 //      if(amount <= fromOldAmt && from != to) {
 //        // console.log("data[0] :" + angular.toJson(accID) );
 //        var fromNewAmt = parseFloat(fromOldAmt)-parseFloat(amount);

 //        // BEGIN put function
 //        var sendDataFrom;
 //        var int;
 //        if('Checking' == from && 'Saving' == to) {
 //          sendDataFrom = { checking : fromNewAmt };
 //          int = 1;
 //          console.log("I am here in checking");
 //        }
 //        else if('Checking' == to && 'Saving' == from){
 //          sendDataFrom = { saving  : fromNewAmt };
 //          int = 0;
 //          console.log("I am here in saving");
 //        }
 //        // console.log("New Amount to withdraw: " + sendDataFrom + " | " + fromNewAmt);
 //        $http.put('/api/users/' + accID + '/update', sendDataFrom ).
 //        success(function(data, status, headers, config) {
 //          // calling push fucntion for statement
 //        if( int == 1){
 //          console.log("Trying to print statement! comon man i can do this :) ");
 //          var transaction = { debit : amount , balance : fromNewAmt, description : "Transfer to saving" };
 //          Transaction.push(data.email,transaction,1)
 //          .then( function(data) {
 //            console.log("SUccess! " + data);
 //          })
 //          .catch( function(err) {
 //            console.log("Failed!");
 //          });
 //        }
 //        else if( int == 0){
 //          var transaction = { debit : amount , balance : fromNewAmt, description : "Transfer to checking" };
 //          Transaction.push(data.email,transaction,0)
 //          .then( function(data) {
 //            console.log("SUccess! " + data);
 //          })
 //          .catch( function(err) {
 //            console.log("Failed!");
 //          });
 //        }

 //          // this callback will be called asynchronously
 //          // when the response is available
 //          console.log("Success Withdraw! Returning new saving amount:");
 //          console.log("NEW amount ON FROM C " + data.checking);
 //          console.log("NEW amount ON FROM S " + data.saving);
 //          //$scope.newChecking = data.checking;
 //          // usr.saving = data.saving;
 //          // TODO: return json to update only one row to reduce refreshing effect
 //        }).
 //        error(function(data, status, headers, config) {
 //          // called asynchronously if an error occurs
 //          // or server returns response with an error status.
 //        });
 //        // END put function
 //        // console.log("data[1] :" + angular.toJson(accID) );
 //        var toNewAmt = parseFloat(toOldAmt)+parseFloat(amount);
 //        console.log("Amount after add-------------------------: "+toNewAmt);


 //        var sendDataTo;
 //        var flag;
 //        if('Checking' == from && 'Saving' == to) {
 //          sendDataTo = { saving : toNewAmt };
 //          flag = 0;
 //        }
 //        else if('Checking' == to && 'Saving' == from){
 //          sendDataTo = { checking  : toNewAmt };
 //          flag = 1;
 //        }
 //        // BEGIN put function
 //        $http.put('/api/users/' + accID + '/update', sendDataTo).
 //        success(function(data, status, headers, config) {
 //        // calling push function for statement
 //        if ( flag == 0){
 //          var transaction = { credit : amount , balance : toNewAmt, description : "Received from checking" };
 //          Transaction.push(data.email,transaction,0)
 //          .then( function(data) {
 //            console.log("SUccess! " + data);
 //          })
 //          .catch( function(err) {
 //            console.log("Failed!");
 //          });
 //        }
 //        else if ( flag == 1){
 //          var transaction = { credit : amount , balance : toNewAmt, description : "Received from saving" };
 //          Transaction.push(data.email,transaction,1)
 //          .then( function(data) {
 //            console.log("SUccess! " + data);
 //          })
 //          .catch( function(err) {
 //            console.log("Failed!");
 //          });
 //        }

 //          // this callback will be called asynchronously
 //          // when the response is available
 //          console.log("Success Deposit! Returning new saving amount ***:");
 //          console.log("NEW AMOUNT ON TO "+data.checking);
 //          console.log("NEW AMOUNT ON TO "+data.saving);;
 //          //$scope.newChecking = data.checking;
 //          // usr.saving = data.saving;
 //          // TODO: return json to update only one row to reduce refreshing effect
 //        }).
 //        error(function(data, status, headers, config) {
 //          console.log("Failed Withdraw!: ");
 //          // console.log(data.checking);
 //          // called asynchronously if an error occurs
 //          // or server returns response with an error status.
 //        });
 //        // END put function
 //        $scope.errorType = false;
 //        $scope.errorAmt = false;
 //      }
 //      else if (from == to) {
 //        console.log("Cannot transfer to the same account.");
 //        $scope.errorType = true;
 //      } else {
 //        console.log("Overdrawing fromUser");
 //        $scope.errorAmt = true;
 //      }
 //    console.log("after checking both users: " + $scope.errorAcc + " | " + $scope.errorAcc);
 //  });


 //  };

// Transfer to Different Account
$scope.confirmInternal = function() {
  var transactionError = false;
  $scope.errorAmt = false;
  Auth.checkUser($scope.user.emailAcc, function(result) {
  // console.log("checkUser() callback emailAcc: " + result);
  $scope.errorAcc = result;
  $scope.submitted = true;

  }).then(function(data) {
    if(angular.isUndefined(data[0]._id)){
      return false;
    } 
    var accID = data[0]._id;

    var from = $scope.accSelectedFrom;
    var to = $scope.accSelectedTo;
    
    var amt = $scope.user.amountAcc;
 
    
    if(angular.lowercase(from) === 'saving' &&  data[0].saving < amt) {
      $scope.errorAmt = true;
    } else if (angular.lowercase(from) === 'checking' &&  data[0].checking < amt) {
      $scope.errorAmt = true;
    }

    if ( parseFloat(amt) < 0 || $scope.errorAmt || parseFloat(amt) > 10000) {
        negativeError = true;
    } else {
      Transaction.modifyAccount(data[0],'withdraw', angular.lowercase(from), amt, true,
      function(err){
          transactionError = err;
      }).then(function(myData){   
        Transaction.modifyAccount(data[0],'deposit', angular.lowercase(to), amt, true, function(err) {
          transactionError = err;
        }).then(function() {

        });
      });

    }
  })
}
/*
 *
 * 
 *
 */
 $scope.confirmExternal = function() {
   $scope.errorAmount = false;
   $scope.submitted = true;

    $q.all([
    Auth.checkUser($scope.user.emailFrom.toLowerCase(), function(result) {
       console.log("checkUser() callback emailFrom: " + result);
       $scope.errorFrom = result;
     }),
    Auth.checkUser($scope.user.emailTo.toLowerCase(), function(result) {
       console.log("checkUser() callback emailTo: " + result);
       $scope.errorTo = result;
     })
  ]).then(function(data) { 
    if(!$scope.errorFrom && !$scope.errorTo)
    {
      var fromID = data[0][0]._id;
      var toID = data[1][0]._id;

      var fromExt = $scope.accSelectedFrom;
      var toExt = $scope.accSelectedTo;
    
      console.log('From ' + fromExt + ' hi to ' + toExt);   
      var amt = $scope.user.amount;

      if(angular.lowercase(fromExt) === 'saving' &&  data[0][0].saving < amt) {
        $scope.errorAmount = true;
      } else if (angular.lowercase(fromExt) === 'checking' &&  data[0][0].checking < amt) {
        $scope.errorAmount = true;
      }
 
      if ( parseFloat(amt) < 0 || $scope.errorAmount ) {
          negativeError = true;
      } else {
        Transaction.modifyAccount(data[0][0],'withdraw', angular.lowercase(fromExt), amt, true,
        function(err){
           //Something
        }).then(function(myData){   
          Transaction.modifyAccount(data[1][0],'deposit', angular.lowercase(toExt), amt, true, function(err) {
           //Something
          }).then(function() {

          });
        });

      }
     

    }
  });
 }









  // $scope.confirm = function()
  // {
  //   $scope.submitted = true;


  // //  $scope.checkUsers($scope.user.emailFrom, $scope.user.emailTo, function(){});
  // $q.all([
  //   Auth.checkUser($scope.user.emailFrom.toLowerCase(), function(result) {
  //      console.log("checkUser() callback emailFrom: " + result);
  //      $scope.errorFrom = result;
  //    }),
  //   Auth.checkUser($scope.user.emailTo.toLowerCase(), function(result) {
  //      console.log("checkUser() callback emailTo: " + result);
  //      $scope.errorTo = result;
  //    })

  // ]).then(function(data) {

  //   if(!$scope.errorFrom && !$scope.errorTo)
  //   {
  //     var fromID = data[0][0]._id;
  //     var fromOldAmt = data[0][0].checking;

  //     var toID = data[1][0]._id;
  //     var toOldAmt = data[1][0].checking;
  //     var amount = $scope.user.amount;
  //     // var overdraw = false;

  //     if(amount <= fromOldAmt)
  //     {
  //       console.log("data[0] :" + angular.toJson(fromID) );
  //       var fromNewAmt = parseFloat(fromOldAmt)-parseFloat(amount);

  //       // BEGIN put function
  //       $http.put('/api/users/' + fromID + '/update',  { checking : fromNewAmt } ).
  //       success(function(data, status, headers, config) {
  //       var transaction = { debit : amount , balance : fromNewAmt, description : "Transfered"};
  //       Transaction.push(data.email,transaction,1)
  //       .then( function(data) {
  //         console.log("SUccess! " + data);
  //       })
  //       .catch( function(err) {
  //         console.log("Failed!");
  //       });
  //         // this callback will be called asynchronously
  //         // when the response is available
  //         console.log("Success Withdraw! Returning new saving amount:");
  //         console.log(data.checking);
  //         //$scope.newChecking = data.checking;
  //         // usr.saving = data.saving;
  //         // TODO: return json to update only one row to reduce refreshing effect
  //       }).
  //       error(function(data, status, headers, config) {
  //         // called asynchronously if an error occurs
  //         // or server returns response with an error status.
  //       });
  //       // END put function
  //       console.log("data[1] :" + angular.toJson(toID) );
  //       var toNewAmt = parseFloat(toOldAmt)+parseFloat(amount);

  //       // BEGIN put function
  //       $http.put('/api/users/' + toID + '/update',  { checking : toNewAmt } ).
  //       success(function(data, status, headers, config) {
  //       //pushing transfer in database for statement
  //       var transaction = { credit : amount , balance : toNewAmt, description : "Transfered" };
  //       Transaction.push(data.email,transaction,1)
  //       .then( function(data) {
  //         console.log("SUccess! " + data);
  //       })
  //       .catch( function(err) {
  //         console.log("Failed!");
  //       });
  //         // this callback will be called asynchronously
  //         // when the response is available
  //         console.log("Success Deposit! Returning new saving amount:");
  //         console.log(data.checking);
  //         //$scope.newChecking = data.checking;
  //         // usr.saving = data.saving;
  //         // TODO: return json to update only one row to reduce refreshing effect
  //       }).
  //       error(function(data, status, headers, config) {
  //         console.log("Failed Withdraw!: ");
  //         // console.log(data.checking);
  //         // called asynchronously if an error occurs
  //         // or server returns response with an error status.
  //       });
  //       // END put function

  //       $scope.errorAmount = false;
  //     }
  //     else
  //     {
  //       console.log("Overdrawing fromUser");
  //       $scope.errorAmount = true;
  //     }

  //   }
  //   console.log("after checking both users: " + $scope.errorFrom + " | " + $scope.errorTo);
  // });


  // };

  $scope.getTime = function() {

    return $scope.date = new Date();
  };



  $scope.updateUsers = function() {
    $scope.users = User.query();
    console.log(users);
  }


});
