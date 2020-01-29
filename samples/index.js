(function (angular, _) {
    'use strict';

    var thisModule = angular.module('appSamples',
        [
            // 3rd Party Modules
            'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ngMaterial', 'wu.masonry', 'LocalStorageModule', 'angularFileUpload', 'ngAnimate',
            // Application Configuration must go first
            'pipSampleConfig',
            // Modules from WebUI Framework
            'pipNav', 'pipCommonRest', 'pipPictures', 'pipDocuments',

            // webui modules
            'pipLayout', 'pipNav', 'pipTheme.Default', 'pipTheme', 'pipDialogs', 'pipBehaviors', 'pipControls',
            'pipSettings', 'pipButtons', 'pipDates', 'pipErrors', 'pipFiles',
            'pipLists', 'pipLocations', 'pipServices' //'pipEntry', 

        ]
    );

    thisModule.controller('pipSampleController',
        function ($scope, $rootScope, $state, $mdSidenav, pipTranslate, pipRest, pipToasts,
            pipSession, $mdTheming, $timeout, pipIdentity) {

            this.identity = {};
            // hak for restore session
            $rootScope.$on(pip.services.IdentityChangedEvent, () => {
                this.identity = pipIdentity.identity;
            });

            this.isAuth = () => {
                return $state.current.auth;
            };

            this.isEntryPage = () => {
                return $state.current.name === 'signin' || $state.current.name === 'signup' ||
                    $state.current.name === 'recover_password' || $state.current.name === 'post_signup';
            };
            $rootScope.$on('iqtOrganizationEventChanged', () => {
                console.log('organization changed');
            });
        }
    );

})(window.angular, window._);
