/*
 * transfer.controller.js
 * Description: Handles the transfer.html view, which allows for 
 *              user to perform internal and external transfers.
 */ 

'use strict';
var myApp = angular.module('cacheItApp');

myApp.controller('UserTranCtrl', function ($scope, $location, $http ,Auth, User, $q, Transaction) {
  //User data
  $scope.getCurrentUser = Auth.getCurrentUser;
  $scope.fromEmail =  Auth.getCurrentUser().email;
  $scope.users = User.query();

  // Account variables
  $scope.accountType = ["Saving","Checking","Transfer"];
  $scope.tranTypeOptions = ["Same Account","Different Account"];
  $scope.accOptionsFrom=['Checking', 'Saving'];
  $scope.accSelectedFrom = $scope.accOptionsFrom[0];

  $scope.accOptionsTo=['Checking', 'Saving'];
  $scope.accSelectedTo = $scope.accOptionsTo[0];

  //Error Flag for Forms
  $scope.errorAcc = false;
  $scope.errorAmt = false;
  $scope.errorType = false;
  $scope.errorFlag = false;
  $scope.errorFrom = false;
  $scope.errorTo = false;
  $scope.errorAmount = false;
  $scope.submitted = false;

   /*
   * Description: Perform internal transfer
   * Function: confirmAcc()
   */
 $scope.confirmAcc = function()
  {
    $scope.submitted = true;
    $scope.fromEmail =  Auth.getCurrentUser().email;

  //Async check users using promise and do transaction if the user exist
  $q.all([
    //Check user
    Auth.checkUser($scope.fromEmail, function(result) {
       $scope.errorAcc = result;
     })
  ]).then(function(data) {

    if(!$scope.errorAcc)
    {
      var from = $scope.accSelectedFrom;
      var to = $scope.accSelectedTo;
      var accID = data[0][0]._id;

      var toOldAmt = 0;
      var fromOldAmt = 0;

      if('Checking' == from && 'Saving' == to){
        fromOldAmt = data[0][0].checking;
        toOldAmt = data[0][0].saving;
      }
       else if('Checking' == to && 'Saving' == from) {
        fromOldAmt = data[0][0].saving;
        toOldAmt = data[0][0].checking;
      }

      var amount = $scope.user .amountAcc;
      console.log("from Amount:-"+fromOldAmt);
      console.log("to Amount:- "+toOldAmt);
    }
      if(amount <= fromOldAmt && from != to) {
        var fromNewAmt = parseFloat(fromOldAmt)-parseFloat(amount);

        //check account type
        var sendDataFrom;
        var int;
        if('Checking' == from && 'Saving' == to) {
          sendDataFrom = { checking : fromNewAmt };
          int = 1;
          console.log("I am here in checking");
        }
        else if('Checking' == to && 'Saving' == from){
          sendDataFrom = { saving  : fromNewAmt };
          int = 0;
          console.log("I am here in saving");
        }
        // console.log("New Amount to withdraw: " + sendDataFrom + " | " + fromNewAmt);
        $http.put('/api/users/' + accID + '/update', sendDataFrom ).
        success(function(data, status, headers, config) {

        // calling push fucntion for statement
        if( int == 1){
          console.log("Trying to print statement! comon man i can do this :) ");
          var transaction = { debit : amount , balance : fromNewAmt, description : "Transfer to saving" };
          Transaction.push(data.email,transaction,1)
          .then( function(data) {
            console.log("SUccess! " + data);
          })
          .catch( function(err) {
            console.log("Failed!");
          });
        }
        else if( int == 0){
          var transaction = { debit : amount , balance : fromNewAmt, description : "Transfer to checking" };
          Transaction.push(data.email,transaction,0)
          .then( function(data) {
            console.log("SUccess! " + data);
          })
          .catch( function(err) {
            console.log("Failed!");
          });
        }
          // this callback will be called asynchronously
          // when the response is available
          console.log("Success Withdraw! Returning new saving amount:");
          console.log("NEW amount ON FROM C " + data.checking);
          console.log("NEW amount ON FROM S " + data.saving);
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        //calculate new amount
        var toNewAmt = parseFloat(toOldAmt)+parseFloat(amount);
        console.log("Amount after add-------------------------: "+toNewAmt);


        var sendDataTo;
        var flag;

        //check account type
        if('Checking' == from && 'Saving' == to) {
          sendDataTo = { saving : toNewAmt };
          flag = 0;
        }
        else if('Checking' == to && 'Saving' == from){
          sendDataTo = { checking  : toNewAmt };
          flag = 1;
        }
        
        //call REST API
        $http.put('/api/users/' + accID + '/update', sendDataTo).
        success(function(data, status, headers, config) {
        
        //format json for transaction history
        if ( flag == 0){
          //Push the history
          var transaction = { credit : amount , balance : toNewAmt, description : "Received from checking" };
          Transaction.push(data.email,transaction,0)
          .then( function(data) {
            console.log("SUccess! " + data);
          })
          .catch( function(err) {
            console.log("Failed!");
          });
        }
        else if ( flag == 1){
          //Push the history
          var transaction = { credit : amount , balance : toNewAmt, description : "Received from saving" };
          Transaction.push(data.email,transaction,1)
          .then( function(data) {
            console.log("SUccess! " + data);
          })
          .catch( function(err) {
            //Failed to add transaction history
            //do not do anything
            console.log("Failed!");
          });
        }
          // this callback will be called asynchronously
          // when the response is available
          console.log("Success Deposit! Returning new saving amount ***:");
          console.log("NEW AMOUNT ON TO "+data.checking);
          console.log("NEW AMOUNT ON TO "+data.saving);;
          
        }).
        error(function(data, status, headers, config) {
          console.log("Failed Withdraw!: ");
          // console.log(data.checking);
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        
        //Set flags to indicate no error has occured
        $scope.errorType = false;
        $scope.errorAmt = false;
      }
      else if (from == to) {
        //do not allow same account transfer
        console.log("Cannot transfer to the same account.");
        $scope.errorType = true;
      } else {
        //Prevent overdraw
        console.log("Overdrawing fromUser");
        $scope.errorAmt = true;
      }
    console.log("after checking both users: " + $scope.errorAcc + " | " + $scope.errorAcc);
    });
  };
  /* 
   * Function: confirmExternal()
   * Description: submits the fields for external transfer
   */
 $scope.confirmExternal = function() {
   $scope.fromEmail =  Auth.getCurrentUser().email;
   $scope.errorAmount = false;
   $scope.submitted = true;
   var negativeError;
    //Do an async check of users using promise before actually transfering.
    $q.all([
    Auth.checkUser(angular.lowercase($scope.fromEmail), function(result) {
       console.log("checkUser() callback emailFrom: " + result);
       $scope.errorFrom = result;
     }),
    Auth.checkUser(angular.lowercase($scope.user.emailTo), function(result) {
       console.log("checkUser() callback emailTo: " + result);
       $scope.errorTo = result;
     })
  ]).then(function(data) { 
    if(!$scope.errorFrom && !$scope.errorTo)
    {

      //Variables to perform transfer
      var fromID = data[0][0]._id;
      var toID = data[1][0]._id;

      var fromExt = $scope.accSelectedFrom;
      var toExt = $scope.accSelectedTo;
    
      console.log('From ' + fromExt + ' hi to ' + toExt);   
      var amt = $scope.user.amount;

      //Check if amount balance is less than the amount to transfer to set an error flag
      if(angular.lowercase(fromExt) === 'saving' &&  data[0][0].saving < amt) {
        $scope.errorAmount = true;
      } else if (angular.lowercase(fromExt) === 'checking' &&  data[0][0].checking < amt) {
        $scope.errorAmount = true;
      }

      //Check check flag for amount balance and do not allow negative amounts
      if ( parseFloat(amt) < 0 || $scope.errorAmount ) {
          negativeError = true;
      } else {
        Transaction.modifyAccount(data[0][0],'withdraw', angular.lowercase(fromExt), amt, true,
        function(err){
           //For Transaction Error
        }).then(function(myData){   
          Transaction.modifyAccount(data[1][0],'deposit', angular.lowercase(toExt), amt, true, function(err) {
           //For Transaction Error
          }).then(function() {

          });
        });
      }

    }
  });
 }
  /* 
   * Function: getTime()
   * Description: get the current time
   */
  $scope.getTime = function() {

    return $scope.date = new Date();
  };


  /* 
   * Function: updateUsers()
   * Description: update all users
   */
  $scope.updateUsers = function() {
    $scope.users = User.query();
    console.log(users);
  }
  
});
