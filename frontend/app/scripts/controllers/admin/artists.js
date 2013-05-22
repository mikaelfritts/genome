'use strict';

angular.module('GenomeApp')
  .controller('AdminArtistsCtrl', function ($scope, apiRequest, localStorageService) {
    $scope.userData = JSON.parse(localStorageService.get('genomeUser'));
    $scope.alerts = [];
    
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
    
    $scope.formFields = [
      {title: 'Artist ID', name: 'id', type: 'hidden'},
      {title: 'Artist REV', name: 'rev', type: 'hidden'},
      {title: 'Artist Name', name: 'name', type: 'text', required: true, listDisplay: true},
      {title: 'Artist Location', name: 'location', type: 'text', required: true, listDisplay: true},
      {title: 'Artist Phone', name: 'phone', type: 'text', required: false},
      {title: 'Artist Email', name: 'email', type: 'email', required: true},
      {title: 'Artist Description', name: 'description', type: 'textarea', required: true},
      {title: 'Active Artist', name: 'active', type: 'checkbox', required: false},
      {title: 'Featured Artist', name: 'featured', type: 'checkbox', required: false}
      /*
      {title: 'Sample Radios', name: 'sample_radios', type: 'radio', options: [
        'One',
        'Two',
        'Three'
      ]}
      */
      /*
      {title: 'Sample Selection', name: 'sample_select', type: 'select', options: [
        {name: 'Test 1', value: 'test1'},
        {name: 'Test 2', value: 'test2'},
        {name: 'Test 3', value: 'test3'}
      ]}
      */
    ];
    
    $scope.apiData = {
      url: 'artists',
      methods: [
        'add',
        'edit',
        'delete',
        'list'
      ],
      defaultMethod: 'list',
      data: [],
      page: 1,
      dataPerPage: 10,
      currentMethod: 'list'
    };
    
    $scope.goAction = function(action, id) {
      switch(action) {
        case 'add':
          $scope.apiData.currentMethod = action;
        break;
        case 'edit':
          $scope.apiData.currentMethod = action;
          var params = {
            authenticationKey: $scope.userData.authenticationKey,
            id: id
          };
          apiRequest.post('admin/artists', params, function(res) {
            console.log(res);
            $scope.formFields.forEach(function(field) {
              field.value = res.pkg.data[field.name];
            });
          }, function(res) {
            $scope.alerts.push({msg: 'An error occurred deleting the artist'});
          });
        break;
        case 'delete':
          $scope.apiData.currentMethod = action;
          var c = confirm("Are you sure you would like to delete: " + id);
          if(c === true) {
            var params = {
              authenticationKey: $scope.userData.authenticationKey,
              _id: id
            };
            apiRequest.post('delete/artist', params, function(res) {
              console.log(res);
              $scope.goAction('list');
            }, function(res) {
              $scope.alerts.push({msg: 'An error occurred deleting the artist'});
            });
          } else {
            $scope.goAction('list');
          }
        break;
        case 'list':
          $scope.apiData.currentMethod = action;
          
          var params = {
            authenticationKey: $scope.userData.authenticationKey,
            limit: $scope.apiData.dataPerPage
          };
          apiRequest.post('admin/artists', params, function(res) {
            console.log('Artists');
            console.log(res);
            $scope.apiData.data = res.pkg.data;
          }, function(res) {
            $scope.alerts.push({msg: 'An error occurred getting the artists'});
          });
        break;
      }
    }
        
    $scope.submitForm = function(data) {
      console.log(data);
      var params = {
        authenticationKey: $scope.userData.authenticationKey
      };
      for(var i = 0; i < data.length; i++) {
        params[data[i].name] = data[i].value;
      }
      apiRequest.post('post/artist', params, function(res) {
        console.log(res);
        $scope.goAction('list');
        $scope.formFields.forEach(function(field) {
          field.value = undefined;
        });
      }, function(res) {
        $scope.alerts.push({msg: 'An error occurred posting the artist'});
      });
    };
    
    $scope.init = function(action) {
      if(action === undefined) {
        action = $scope.apiData.defaultMethod;
      }
      
      $scope.goAction(action);
    }
  });
