/*
 * Filename: transaction.service.js
 * Description: Factory that handles push, transfer, and modifying user accounts.
 *              Also contains a Service which acts as a getter/setter service.
 */ 

'use strict';

var mod = angular.module('cacheItApp');
 mod.factory('Transaction', function ($q, $http) {

    return {
      /**
       * Transfer from  and to users
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      transfer: function(fromEmail, toEmail, fromType, toType, fromAmount, toAmount, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        var self = this;
        //JSON variables to store transfer amounts
        var fromJson = {};
        var toJson = {};

        //Select Account Type for FROM user
        switch(angular.lowercase(fromType)) {
          case "checking":
            fromJson = { checking : fromAmount };
            break;
          case "saving":
            fromJson = { saving : fromAmount };
            break;
        }

        //Select Account Type for TO user
        switch(angular.lowercase(toType)) {
          case "checking":
            toJson = { checking : toAmount };
            break;
          case "saving":
            toJson = { saving : toAmount };
            break;
        }
        this.deposit("hi");


      },

      /**
       * Push transaction for a specific user
       *
       * @param  {String}   username - user login aka email
       * @param  {JSON} callback - optional
       * @return {Promise}
       */
       // for checking satatement push
      push: function(username, data , accountType, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        var query = '/api/users/' + username + '/push';
        var self = this;
        var myJson = {};

        switch(accountType) {
          case 1:
            myJson = {
              checkTransactions :
              [{
                description : data.description,
                debit : data.debit,
                credit : data.credit,
                balance : data.balance
              }]
            };
            break;
          case 0:
             myJson = {
              savTransactions :
              [{
                description : data.description,
                debit : data.debit,
                credit : data.credit,
                balance : data.balance
              }]
            };
            break;
          default:
            myJson = {};
            break;
        }

        //Make a http PUT to push a transactionmyJson
        $http.put(query, myJson).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },//End checking statement push
      /**
       * Deposit from user
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      modifyAccount: function(user, action, type, amount, isTransfer, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        var self = this;
        var myJson = {};
        var tranMsg = "";
        var typeNum;

        if(angular.lowercase(action) === 'deposit') {
          console.log("Deposit");
          tranMsg = "Deposited ";
        } else if (angular.lowercase(action) === 'withdraw') {
          amount = -amount;
          tranMsg = "Withdrawed";
        }

        if (isTransfer) {
          tranMsg = 'Transfered';
        }

        switch(angular.lowercase(type)) {
          case 'saving':
            myJson = {
              'saving' : parseFloat(user.saving) + parseFloat(amount)
            }
            typeNum = 0;
            break;
          case 'checking':
            myJson = {
              'checking' : parseFloat(user.checking) + parseFloat(amount)
            }
            typeNum = 1;
            break;
        }

        $http.put('/api/users/' + user._id + '/update', myJson).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log("Success! " + action + "  Sav: " + data.saving + " Chk: " + data.checking);
          var transaction = {};
          if(angular.lowercase(type)=='saving') {
            switch(angular.lowercase(action)) {
              case 'deposit':
                console.log("dep");
                transaction = {
                  credit : amount,
                  balance : parseFloat(data.saving),
                  description : tranMsg
                };
                break;
              case 'withdraw':
                console.log("with");
                transaction = {
                  debit : -amount,
                  balance : parseFloat(data.saving),
                  description : tranMsg
                };
                break;
            }

          } else if (angular.lowercase(type)=='checking') {
            switch(angular.lowercase(action)) {
              case 'deposit':
                console.log("dep");
                transaction = {
                  credit : amount,
                  balance : parseFloat(data.checking),
                  description : tranMsg
                };
                break;
              case 'withdraw':
                console.log("with");
                transaction = {
                  debit : -amount,
                  balance : parseFloat(data.checking),
                  description : tranMsg
                };
                break;
            }
          }
          
          console.log("Transaction: " + angular.toJson(transaction));

          //Make a transaction histroy
          self.push(data.email,transaction,typeNum)
          .then( function(tranData) {
            // console.log("Transaction History: " + angular.toJson(tranData));
          })
          .catch( function(err) {
            console.log("Failed!");
          });
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
            deferred.reject(err);
            return cb(err);
        }.bind(this));
        return deferred.promise;
      }
    };//Return
  });


mod.service('myService', function() {
  var saveName;
  var saveEmail;
  var savePassword;
  var savelastName;

  var saveField = function(name) {
      //savedData.push(newObj);
      saveName = name;
      // savedData[1] = email;
      // savedData[2] = password;
  }
  var getField = function(){
    return saveName;
  }

  var setEmail = function(email) {
    saveEmail = email;
  }
  var getEmail = function(){
    return saveEmail;
  }

  var setPassword = function(password) {
    savePassword = password;
  }
  var getPassword = function(){
    return savePassword;
  }

  var setlastName = function(lastName) {
    savelastName = lastName;
  }
  var getlastName = function(){
    return savelastName;
  }


  return {
    saveField: saveField,
    getField: getField,
    setEmail: setEmail,
    getEmail: getEmail,
    setPassword: setPassword,
    getPassword: getPassword,
    setlastName: setlastName,
    getlastName: getlastName
  };

});
