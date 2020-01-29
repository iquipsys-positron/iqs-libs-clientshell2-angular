(() => {
    const translateConfig = function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            TILE_HOME: 'Home',
            TILE_EXIT: 'Exit'
        });

        pipTranslateProvider.translations('ru', {
            TILE_HOME: 'Начало',
            TILE_EXIT: 'Выход'
        });
    }

    angular
        .module('iqsSideNav.Menu')
        .config(translateConfig);
})();
