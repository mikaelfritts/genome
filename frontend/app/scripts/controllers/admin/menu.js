'use strict';

angular.module('GenomeApp')
  .controller('AdminMenuCtrl', function ($scope, $location) {
    $scope.menuItems = [
      {name: 'DashBoard', class: 'admin-dash', url: '#/admin'},
      {name: 'Products', class: 'admin-products', url: '#/admin/products'},
      {name: 'Artists', class: 'admin-artists', url: '#/admin/artists'},
      {name: 'Projects', class: 'admin-projects', url: '#/admin/projects'},
      {name: 'Settings', class: 'admin-settings', url: '#/admin/settings'}
    ];
    
    $scope.checkActiveClass = function(path) {
      path = path.substr(1, path.length);
      if ($location.path().substr(0, $location.length) === path) {
        return "active";
      } else {
        return "";
      }
    }
  });
