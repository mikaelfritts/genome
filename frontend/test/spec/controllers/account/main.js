'use strict';

describe('Controller: AccountMainCtrl', function () {

  // load the controller's module
  beforeEach(module('GenomeApp'));

  var AccountMainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountMainCtrl = $controller('AccountMainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
