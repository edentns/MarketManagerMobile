'use strict';

angular.
module('core.mall').
factory('MallStatus', ['$resource',
  function($resource) {
    return $resource('malls/mallStatusList.json', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: true
      }
    });
  }
]);

angular.
module('core.mall').
factory('MallConfiguration', ['$resource',
  function($resource) {
    return $resource('malls/mallConfigurationList.json', {}, {
      get: {
        method: 'GET',
        params: {}
      }
    });
  }
]);

angular.
module('core.mall').
factory('MallList', ['$resource',
  function($resource) {
    return $resource('malls/mallList.json', {}, {
      get: {
        method: 'GET',
        params: {}
      }
    });
  }
]);