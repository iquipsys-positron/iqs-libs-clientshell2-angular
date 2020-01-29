(function (angular, _) {
    'use strict';

    var thisModule = angular.module('appHomeTabs', []);

    thisModule.controller('appHomeTabs',
        function ($scope, $state) {
           
            this.tabIndex = 0;

            this.tabs = [{
                title: 'title1',
                state: 'new'
            }, {title: 'title2', state: 'new2'}]
             this.showTabs = function () {
                return true;
            }
            
        }
    );

})(window.angular, window._);
