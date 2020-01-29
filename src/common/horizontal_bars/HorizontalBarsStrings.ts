(() => {
    function iqsHorizontalBarsTranslations(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            HORIZONTAL_BARS_NO_DATA: 'No statistics data'
        });
        pipTranslateProvider.translations('ru', {
            HORIZONTAL_BARS_NO_DATA: 'Нет статистических данных'
        });
    }

    angular
        .module('iqsHorizontalBars')
        .config(iqsHorizontalBarsTranslations);
})();