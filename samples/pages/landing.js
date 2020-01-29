(function (angular, _) {
    'use strict';

    var thisModule = angular.module('appLanding', []);

    thisModule.controller('appLandingController',
        function ($scope, $state) {
            $scope.title = 'Shell';
            $scope.onSignIn = function () {
                $state.go('signin', null);
            }
        }
    );

})(window.angular, window._);
