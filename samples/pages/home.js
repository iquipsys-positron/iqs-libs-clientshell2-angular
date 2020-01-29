(function (angular, _) {
    'use strict';

    var thisModule = angular.module('appHome', ['pipLayout']);

    thisModule.controller('appHomeController',
        function ($scope, $state, pipAuxPanel) {
            $scope.pages = [{
                Name: "Sample Name",
                Items: [{
                    Name: 'Name1',
                    State: 'State1',
                    Color: 'bg-color-8'
                }, {
                    Name: 'Name2',
                    State: 'State2',
                    Color: 'bg-color-8'
                }, {
                    Name: 'Name3',
                    State: 'State3',
                    Color: 'bg-color-8'
                }]
            }, ];
            $scope.openPanel = function() {
                pipAuxPanel.open();
            }
            $scope.closePanel = function() {
                pipAuxPanel.close();
            }
        }
    );

})(window.angular, window._);
