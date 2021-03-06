'use strict';

describe('Controller: AccountRegisterCtrl', function () {

  // load the controller's module
  beforeEach(module('GenomeApp'));

  var AccountRegisterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountRegisterCtrl = $controller('AccountRegisterCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
