'use strict';

angular.module('GenomeApp')
  .controller('AdminCtrl', function ($scope, localStorageService, $location) {
    console.log(localStorageService);
    
    if(localStorageService.get('genomeLogged') !== true) {
      $location.path('/admin/login');
      return;
    }

    switch($location.path().substr(0, $location.length)) {
      case '/admin/products':
        console.log('loaded admin products');
      break;
    }
  });
