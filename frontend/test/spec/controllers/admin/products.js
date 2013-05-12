'use strict';

describe('Controller: AdminProductsCtrl', function () {

  // load the controller's module
  beforeEach(module('GenomeApp'));

  var AdminProductsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminProductsCtrl = $controller('AdminProductsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
