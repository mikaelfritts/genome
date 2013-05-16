'use strict';

angular.module('GenomeApp')
  .controller('AdminLoginCtrl', function ($scope, apiRequest, localStorageService, $location) {
    apiRequest.get('', function(res) {
      console.log(res);
    }, function(err) {
      console.log(arguments);
    });
    
    $scope.doLogin = function(user) {
      apiRequest.post('login', {email: user.login, password: user.password}, function(res) {
        localStorageService.add('genomeUser', JSON.stringify(res.pkg.data));
        $location.path('/admin');
      }, function(res) {
        localStorageService.remove('genomeUser');
      });
    }
  });
