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
      /**
       * Deposit from user
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      deposit: function(email, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
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
      }//End checking statement push
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