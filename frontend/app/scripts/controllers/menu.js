'use strict';

angular.module('GenomeApp')
  .controller('MenuCtrl', function ($scope, $location) {
    $scope.menuItems = [
      {name: 'Genome', class: 'logo', url: '#/'},
      {name: 'Originals', class: 'originals', url: '#/originals'},
      {name: 'Prints', class: 'prints', url: '#/prints'},
      {name: 'Artists', class: 'artists', url: '#/artists'},
      {name: 'Projects', class: 'projects', url: '#/projects'},
      {name: 'Contact', class: 'contact', url: '#/contact'}
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
