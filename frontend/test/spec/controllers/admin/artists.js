'use strict';

describe('Controller: AdminArtistsCtrl', function () {

  // load the controller's module
  beforeEach(module('GenomeApp'));

  var AdminArtistsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminArtistsCtrl = $controller('AdminArtistsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
