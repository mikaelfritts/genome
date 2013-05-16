'use strict';

angular.module('GenomeApp')
  .factory('apiRequest', function ($http) {
    var baseUrl = 'http://0.0.0.0:3458/';

    return {
      get: function (path, successCallback, errorCallback) {
        $http.get(baseUrl + path).success(successCallback).error(errorCallback);
      },
      post: function(path, data, successCallback, errorCallback) {
        $http.post(baseUrl + path, data).success(successCallback).error(errorCallback);
      }
    };
  });
