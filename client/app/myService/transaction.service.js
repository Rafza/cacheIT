'use strict';

angular.module('cacheItApp')
  .factory('Transaction', function ($q, $http) {
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
