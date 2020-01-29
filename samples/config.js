

(() => {
    'use strict';

    var thisModule = angular.module('pipSampleConfig',
        ['iqtShell', 'pipEntry', 'pipLayout', 'pipNav', 'appLanding', 'appHome', 'appHomeTabs']); //'pipRest.State', 'pipSideNav', 'pipAppBar', 

    // Configure application services before start
    thisModule.config(
        function ($mdIconProvider, $urlRouterProvider, pipAuthStateProvider, $stateProvider, iqtShellProvider,
            pipTranslateProvider, pipSideNavProvider, pipNavMenuProvider, pipRestProvider) { //pipSideNavProvider, pipAppBarProvider,  

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);
            iqtShellProvider.hideNav = ['landing', 'signin', 'signup', 'post_signup', 'recover_password', 'reset_password', 'change_password'];
            iqtShellProvider.hideBar = ['landing'];

            pipNavMenuProvider.sections = [
                {
                    title: 'About',
                    icon: 'icons:goal',
                    links: [
                        { title: 'ABOUT_ME', tooltipText: 'a', url: '/about_me', icon: 'icons:pen' },

                        { title: 'Home', url: '/home' }
                    ]
                },
                {
                    links: [
                        { title: 'SIGNOUT', url: '/signout' }
                    ]
                }
            ];
            pipSideNavProvider.part('admin', true);
            pipSideNavProvider.type = 'sticky';

            pipAuthStateProvider.state('about_me', {
                url: '/about_me',
                auth: true,
                template: 'about_me'
            })

            pipAuthStateProvider.state('home', {
                url: '/home',
                auth: true,
                views: {
                    'tabs': {
                        controller: 'appHomeTabs',
                        controllerAs: 'main',
                        template: '<pip-tabs pip-rebind="true" ng-if="main.showTabs()" pip-tabs="main.tabs" pip-active-index="main.tabIndex" pip-show-tabs="main.showTabs()" pip-tabs-select="main.onSelect"></pip-tabs>'
                    },
                    'aux': {
                        template: 'aux panel'
                    },
                    '@': {
                        controller: 'appHomeController',
                        templateUrl: 'pages/home.html'
                    }
                }
            })
            pipAuthStateProvider.state('landing', {
                url: '/',
                auth: false,
                templateUrl: "pages/landing.html",
                controller: 'appLandingController',
            })

            // Set global constants
            /*            
                        pipAppBarProvider.appTitleText('Entry Sample Application');
                        pipAppBarProvider.globalSecondaryActions([
                            {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
                        ]);
            */
            // Configure REST API
            // pipRestProvider.version('1.0');
            pipRestProvider.serverUrl = 'http://tracker.pipservices.net:8080';
            $urlRouterProvider.otherwise(($injector, $location) => {
                return $location.$$path === '' ? '/' : '/about_me';
            });

            // String translations
            pipTranslateProvider.translations('en', {
                SAMPLE_APPLICATION: 'Sample application',
                ABOUT_ME: 'About Me',
                ABOUT_SYSTEM: 'About system',
                SIGNOUT: 'Sign out'
            });

            pipTranslateProvider.translations('ru', {
                SAMPLE_APPLICATION: 'Пример приложения',
                ABOUT_ME: 'Обо мне',
                ABOUT_SYSTEM: 'О системе',
                SIGNOUT: 'Выйти'
            });

            // Configure default states
            pipAuthStateProvider.unauthorizedState = 'signin';
            pipAuthStateProvider.authorizedState = 'about_me';

        }
    );


})();

