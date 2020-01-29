{

function configureIqtAccentTheme($mdThemingProvider: ng.material.IThemingProvider) {

    let coolBackgroundPalette = $mdThemingProvider.extendPalette('grey', {
        'A100': 'rgba(250, 250, 250, 1)',
        'A200': 'rgba(255, 143, 0, 1)'
    });
    $mdThemingProvider.definePalette('iqt-accent-background', coolBackgroundPalette);

    let coolPrimaryPalette = $mdThemingProvider.extendPalette('grey', {
        '300': 'rgba(255, 143, 0, .54)',
        '500': 'rgba(255, 143, 0, 1)',
        'contrastLightColors': ['500', '300']
    });
    $mdThemingProvider.definePalette('iqt-accent-primary', coolPrimaryPalette);


    let coolAccentPalette = $mdThemingProvider.extendPalette('blue', {
        'A700': 'rgba(19, 87, 191, 1)',
        'contrastLightColors': ['A700']
    });
    $mdThemingProvider.definePalette('iqt-accent-accent', coolAccentPalette);

    $mdThemingProvider.theme('iqt-accent')
        .primaryPalette('iqt-accent-primary', {
            'default': '500',
            'hue-1': '300'
        })
        .backgroundPalette('iqt-accent-background', {
            'default': '50',  // background
            'hue-1': 'A200',  // tiles dialog
            'hue-2': 'A700'   // app bar
        })
        .warnPalette('red', {
            'default': 'A200'
        })
        .accentPalette('iqt-accent-accent', {
            'default': 'A700'
        });

    $mdThemingProvider.alwaysWatchTheme(true);
}


angular
    .module('iqsTheme', [ 'ngMaterial' ])
    .config(configureIqtAccentTheme);

}