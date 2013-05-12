'use strict';

describe('Controller: OriginalsCtrl', function () {

  // load the controller's module
  beforeEach(module('GenomeApp'));

  var OriginalsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OriginalsCtrl = $controller('OriginalsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
