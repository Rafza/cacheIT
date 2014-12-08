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
      // setPassword: {
      //   method: 'PUT',
      //   params: {
      //     controller:'setPassword'
      //   }
      // },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
