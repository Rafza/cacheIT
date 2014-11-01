'use strict';

describe('Controller: VideoCtrl', function () {

  // load the controller's module
  beforeEach(module('cacheItApp'));

  var VideoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideoCtrl = $controller('VideoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
