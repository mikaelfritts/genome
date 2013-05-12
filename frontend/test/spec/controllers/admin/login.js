'use strict';

describe('Controller: AdminLoginCtrl', function () {

  // load the controller's module
  beforeEach(module('GenomeApp'));

  var AdminLoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminLoginCtrl = $controller('AdminLoginCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
