'use strict';

var mod = angular.module('cacheItApp');
 mod.factory('Transaction', function ($q, $http) {
    // var currentUser = {};
    // if($cookieStore.get('token')) {
    //   currentUser = User.get();

    // }



    return {
      /**
       * Withdraw from user
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      withdraw: function(email, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
      },
      transfer: function(fromEmail, toEmail, fromType, toType, fromAmount, toAmount, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

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
        // //User to transfer FROM
        // $http.put('/api/users/' + accID + '/update', fromJson ).
        // success(function(data, status, headers, config) {
        //   // this callback will be called asynchronously
        //   // when the response is available
        //   console.log("Success Withdraw! Returning new saving amount:");
        //   console.log("NEW amount ON FROM C " + data.checking);
        //   console.log("NEW amount ON FROM S " + data.saving);
        //   //$scope.newChecking = data.checking;
        //   // usr.saving = data.saving;
        //   // TODO: return json to update only one row to reduce refreshing effect
        // }).
        // error(function(data, status, headers, config) {
        //   // called asynchronously if an error occurs
        //   // or server returns response with an error status.
        // });
        //
        // //User to transfer TO
        // $http.put('/api/users/' + accID + '/update', toJson ).
        // success(function(data, status, headers, config) {
        //   // this callback will be called asynchronously
        //   // when the response is available
        //   console.log("Success Withdraw! Returning new saving amount:");
        //   console.log("NEW amount ON FROM C " + data.checking);
        //   console.log("NEW amount ON FROM S " + data.saving);
        //   //$scope.newChecking = data.checking;
        //   // usr.saving = data.saving;
        //   // TODO: return json to update only one row to reduce refreshing effect
        // }).
        // error(function(data, status, headers, config) {
        //   // called asynchronously if an error occurs
        //   // or server returns response with an error status.
        // });

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
      deposit: function(user, type, amount, setHistory, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        var self = this;
        var myJson = {};

        console.log("deposit()");
        switch(angular.lowercase(type)) {
          case 'saving':
            myJson = {
              'saving' : amount + user.saving
            }
            break;
          case 'checking':
            myJson = {
              'checking' : amount + user.checking
            }
            break;
        }

        $http.put('/api/users/' + user._id + '/update', myJson).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available

          if(setHistory){
            var transaction = {
              credit : amount,
              balance : parseFloat(data.saving) + parseFloat(data.checking),
              description : "Deposit"
              };
            //Make a transaction histroy
            self.push(data.email,transaction,0)
            .then( function(data) {
              console.log("Success! " + data);
            })
            .catch( function(err) {
              console.log("Failed!");
            });
          }

          console.log("Success Deposit!");
          console.log(data.saving);

          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
            deferred.reject(err);
            return cb(err);
        }.bind(this));

        //Make a http PUT to push a transactionmyJson
        // $http.put(query, myJson).
        // success(function(data) {
        //   deferred.resolve(data);
        //   return cb();
        // }).
        // error(function(err) {
        //   deferred.reject(err);
        //   return cb(err);
        // }.bind(this));

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
