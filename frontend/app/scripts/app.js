'use strict';

angular.module('GenomeApp', ['LocalStorageModule'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin/main.html',
        controller: 'AdminCtrl'
      })
      .when('/originals', {
        templateUrl: 'views/originals.html',
        controller: 'OriginalsCtrl'
      })
      .when('/prints', {
        templateUrl: 'views/prints.html',
        controller: 'PrintsCtrl'
      })
      .when('/artists', {
        templateUrl: 'views/artists.html',
        controller: 'ArtistsCtrl'
      })
      .when('/projects', {
        templateUrl: 'views/projects.html',
        controller: 'ProjectsCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/originals', {
        templateUrl: 'views/originals.html',
        controller: 'OriginalsCtrl'
      })
      .when('/prints', {
        templateUrl: 'views/prints.html',
        controller: 'PrintsCtrl'
      })
      .when('/artists', {
        templateUrl: 'views/artists.html',
        controller: 'ArtistsCtrl'
      })
      .when('/projects', {
        templateUrl: 'views/projects.html',
        controller: 'ProjectsCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/admin/products', {
        templateUrl: 'views/admin/main.html',
        controller: 'AdminCtrl'
      })
      .when('/admin/artists', {
        templateUrl: 'views/admin/main.html',
        controller: 'AdminCtrl'
      })
      .when('/admin/projects', {
        templateUrl: 'views/admin/main.html',
        controller: 'AdminCtrl'
      })
      .when('/admin/settings', {
        templateUrl: 'views/admin/main.html',
        controller: 'AdminCtrl'
      })
      .when('/admin/login', {
        templateUrl: 'views/admin/login.html',
        controller: 'AdminLoginCtrl'
      })
      .when('/account/main', {
        templateUrl: 'views/account/main.html',
        controller: 'AccountMainCtrl'
      })
      .when('/account/login', {
        templateUrl: 'views/account/login.html',
        controller: 'AccountLoginCtrl'
      })
      .when('/account/register', {
        templateUrl: 'views/account/register.html',
        controller: 'AccountRegisterCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
