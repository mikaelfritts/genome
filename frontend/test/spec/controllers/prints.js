'use strict';

describe('Controller: PrintsCtrl', function () {

  // load the controller's module
  beforeEach(module('GenomeApp'));

  var PrintsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrintsCtrl = $controller('PrintsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
