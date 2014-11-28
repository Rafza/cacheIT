'use strict';

angular.module('cacheItApp')
  .factory('Transaction', function ($q, $http) {
    // var currentUser = {};
    // if($cookieStore.get('token')) {
    //   currentUser = User.get();
    // }

    return {
      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      // login: function(user, callback) {
      //   var cb = callback || angular.noop;
      //   var deferred = $q.defer();
      //
      //   $http.post('/auth/local', {
      //     email: user.email,
      //     password: user.password
      //   }).
      //   success(function(data) {
      //     $cookieStore.put('token', data.token);
      //     currentUser = User.get();
      //     deferred.resolve(data);
      //     return cb();
      //   }).
      //   error(function(err) {
      //     this.logout();
      //     deferred.reject(err);
      //     return cb(err);
      //   }.bind(this));
      //
      //   return deferred.promise;
      // }

      /**
       * Push transaction for a specific user
       *
       * @param  {String}   username - user login aka email
       * @param  {JSON} callback - optional
       * @return {Promise}
       */
       // for checking satatement push
      push: function(username, data , int, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        var query = '/api/users/' + username + '/push';

        //var newBalance = parseFloat(data.debit) + parseFloat(data.credit);
        if (int == 1) {
          var checkJson = {
            checkTransactions :
            [{
              description : data.description,
              debit : data.debit,
              credit : data.credit,
              balance : data.balance
            }]
          };
        $http.put(query, checkJson).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
        }
        else if(int ==0){
          var savJson = {
            savTransactions :
            [{
              description : data.description,
              debit : data.debit,
              credit : data.credit,
              balance : data.balance
            }]
          };
        $http.put(query, savJson).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
        }
      }//End checking statement push
    };//Return
  });
