'use strict';

angular.module('GenomeApp')
  .controller('AdminCtrl', function ($scope, apiRequest, localStorageService, $location) {
    $scope.userData = localStorageService.get('genomeUser');
    if($scope.userData === null) {
      $location.path('/admin/login');
      return;
    }
    
    $scope.userData = JSON.parse($scope.userData);
    // else we attempt to get user info
    apiRequest.get('account/' + $scope.userData.authenticationKey, function(res) {
      $scope.userData = res.pkg.data;
      localStorageService.add('genomeUser', JSON.stringify(res.pkg.data));
      gotoAdminPage();
    }, function(res) {
      localStorageService.remove('genomeUser');
      $location.path('/admin/login');
      return;
    });

    function gotoAdminPage() {
      switch($location.path().substr(0, $location.length)) {
        case '/admin':
          $scope.adminTemplate = 'views/admin/index.html';
        break;
        case '/admin/artists':
          $scope.adminTemplate = 'views/admin/artists.html';
        break;
        case '/admin/products':
          $scope.adminTemplate = 'views/admin/products.html';
        break;
        case '/admin/projects':
          $scope.adminTemplate = 'views/admin/projects.html';
        break;
        case '/admin/settings':
          $scope.adminTemplate = 'views/admin/settings.html';
        break;
        case '/admin/logout':
          var status = localStorageService.clearAll();
          $location.path('/admin/login');
        break;
      }
    }
  });
