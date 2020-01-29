{

    function configureIqtMainTheme($mdThemingProvider: ng.material.IThemingProvider) {
        // pipTranslateProvider.translations('en', {
        //     THEME: 'Theme',
        //     'iqt-main': 'Cool'
        // });

        // pipTranslateProvider.translations('ru', {
        //     THEME: 'Тема',
        //     'iqt-main': ''
        // });

        let coolBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
            'A100': 'rgba(250, 250, 250, 1)',
            'A200': 'rgba(19, 87, 191, 1)'
        });
        $mdThemingProvider.definePalette('iqt-main-background', coolBackgroundPalette);

        let coolPrimaryPalette = $mdThemingProvider.extendPalette('grey', {
            '300': 'rgba(19, 87, 191, .54)',
            '500': 'rgba(19, 87, 191, 1)',
            'contrastLightColors': ['500', '300']
        });
        $mdThemingProvider.definePalette('iqt-main-primary', coolPrimaryPalette);


        let coolAccentPalette = $mdThemingProvider.extendPalette('orange', {
            'A700': 'rgba(255, 143, 0, 1);',
            'contrastLightColors': ['A700']
        });
        $mdThemingProvider.definePalette('iqt-main-accent', coolAccentPalette);

        $mdThemingProvider.theme('iqt-main')
            .primaryPalette('iqt-main-primary', {
                'default': '500',
                'hue-1': '300'
            })
            .backgroundPalette('iqt-main-background', {
                'default': '50',  // background
                'hue-1': 'A200',  // tiles dialog
                'hue-2': 'A700'   // app bar
            })
            .warnPalette('red', {
                'default': 'A200'
            })
            .accentPalette('iqt-main-accent', {
                'default': 'A700'
            });

        $mdThemingProvider.theme('default')
            .primaryPalette('iqt-main-primary', {
                'default': '500',
                'hue-1': '300'
            })
            .backgroundPalette('iqt-main-background', {
                'default': '50',  // background
                'hue-1': 'A200',  // tiles dialog
                'hue-2': 'A700'   // app bar
            })
            .warnPalette('red', {
                'default': 'A200'
            })
            .accentPalette('iqt-main-accent', {
                'default': 'A700'
            });

        $mdThemingProvider.alwaysWatchTheme(true);
    }


    angular
        .module('iqsTheme')
        .config(configureIqtMainTheme);

}