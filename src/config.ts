import './common';
import './modules';
import './states';
import './rest/index';

export const ShellStateName = 'shell';

export const ClientConfiguration = {
    AddOrganizationNav: true,
    AddOrganizationLanding: true,
    RemoveOrganizationNav: true,
    AddToDemo: true
};

(() => {
    const serverUrls: any = {
        production: 'https://facade.positron.iquipsys.net',
        stage: 'http://api.positron.stage.iquipsys.net:30018',
        local: 'http://localhost:8080'
    };

    function iqsShellConfig(
        $mdDateLocaleProvider: angular.material.IDateLocaleProvider,
        $mdIconProvider: angular.material.IIconProvider,
        $stateProvider: ng.ui.IStateProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        pipActionsProvider: pip.nav.IActionsProvider,
        pipAnalyticsProvider: pip.support.IAnalyticsProvider,
        pipAuthStateProvider: pip.rest.IAuthStateProvider,
        pipAvatarDataProvider: pip.pictures.IAvatarDataProvider,
        pipEntryProvider: pip.entry.IEntryProvider,
        pipErrorPageConfigServiceProvider: pip.errors.IErrorPageConfigProvider,
        pipPictureDataProvider: pip.pictures.IPictureDataProvider,
        pipRestProvider: pip.rest.IRestProvider,
    ) {
        // Resigter icons for application
        $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);
        $mdIconProvider.iconSet('iqs', 'images/iqs.svg', 512);
        $mdIconProvider.iconSet('webui-icons', 'images/webui-icons.svg', 512);

        pipActionsProvider.primaryGlobalActions = [
            { name: 'global.emergency', icon: 'iqs:emergency', count: 0, event: 'iqsEmergencyPlan' },
            // { name: 'global.incidents', icon: 'icons:bell', count: 0, event: 'iqsIncidentsOpen' },
            { name: 'global.help', icon: 'icons:help', count: 0, event: 'iqsGlobalHelp' }
        ];

        pipActionsProvider.secondaryGlobalActions = [
            { name: 'global.settings', title: 'User settings', /* state: 'settings.user' */ event: 'iqsUserSettings' },
            { name: 'global.signout', title: 'Sign out', state: 'signout' }
        ];

        pipEntryProvider.appbarTitle = 'iQuipsys Positron';
        pipEntryProvider.showIcon = true;
        pipEntryProvider.appbarIcon = 'iqs:iquipsys';
        pipEntryProvider.passwordExpire = true;
        pipEntryProvider.isPostSignup = false;
        pipEntryProvider.useEmailAsLogin = true;
        pipEntryProvider.entryHideObject = {
            changePwdSubTitle: true,
            agreement: true,
            hint: true
        };
        pipEntryProvider.fixedServerUrl = false;

        // Configure REST
        pipRestProvider.lockServerUrl = true;
        pipRestProvider.serverUrl = serverUrls.production;
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state(ShellStateName, {
                url: '/',
                abstract: true
            });

        // Configure auth states
        pipAuthStateProvider.unauthorizedState = 'landing';
        pipAuthStateProvider.authorizedState = 'app';

        // Configure BLOB paths
        pipAvatarDataProvider.DefaultInitial = '?';
        pipAvatarDataProvider.AvatarRoute = '/api/v1/blobs';
        pipPictureDataProvider.PictureRoute = '/api/v1/blobs';

        // Configure error page provider
        pipErrorPageConfigServiceProvider.configs.NoConnection.RedirectSateDefault = pipAuthStateProvider.authorizedState;
        pipErrorPageConfigServiceProvider.configs.NoConnection.StateIgnored = [pipAuthStateProvider.signinState, pipAuthStateProvider.unauthorizedState];
        pipErrorPageConfigServiceProvider.configs.Unsupported.Active = false;
        // pipErrorPageConfigServiceProvider.configs.Unsupported.Params.supported = {
        //     edge: 12,
        //     firefox: 47,
        //     chrome: 56,
        //     safari: 600
        // };

        // Configure Google analytics
        pipAnalyticsProvider.enable('UA-120239019-2');

        // Configure date localization
        $mdDateLocaleProvider.formatDate = function (date) {
            var m = moment(date);
            return m.isValid() ? m.format('L') : '';
        };
    }

    angular
        .module('iqsShell.Config', [
            // lib
            'ngCookies',

            // suite
            'pipEntry', 'pipCommonRest', 'pipPictures', 'pipDocuments', 'pipMaps',

            // webui
            'iqsTheme', 'pipTheme',

            'pipLayout', 'pipNav', 'pipDialogs', 'pipBehaviors', 'pipControls',
            'pipSettings', 'pipButtons', 'pipDates', 'pipErrors', 'pipFiles',
            'pipLists', 'pipLocations', 'pipServices', 'pipGuidance', 'pipComposite',
            'pipPictures', 'pipDates', 'pipLocations', 'pipSupport',
            'pipErrors.Unauthorized',

            // States
            'iqsDemo',
            'iqsLanding',

            // Complete data/models/services/resources for each object
            'iqsModules',
            'iqsRest',

            'iqsHttpResponseInterceptor',
            'iqsLoading',
            'iqsEmergencyPlansAux',
            'iqsGlobalHelp'
        ])
        .config(iqsShellConfig);
})();