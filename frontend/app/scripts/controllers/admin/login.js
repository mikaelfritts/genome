'use strict';

angular.module('GenomeApp')
  .controller('AdminLoginCtrl', function ($scope, apiRequest, localStorageService, $location) {
    $scope.alerts = [];
    
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
    
    $scope.doLogin = function(user) {
      apiRequest.post('login', {email: user.login, password: user.password}, function(res) {
        localStorageService.add('genomeUser', JSON.stringify(res.pkg.data));
        $location.path('/admin');
      }, function(res) {
        console.log(res);
        $scope.alerts.push({type: 'error', msg: res.pkg.statusMessage});
        localStorageService.remove('genomeUser');
      });
    }
  });
