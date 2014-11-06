'use strict';

angular.module('cacheItApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      withdrawAmount: {
        method: 'PUT',
        params: {
          controller:'withdraw'
        }
      }
	  });
  });
