(() => {
    const translateConfig = function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            NEW_SITE: 'New organization...',
            SITES_SETTINGS: 'Organization settings...'
        });

        pipTranslateProvider.translations('ru', {
            NEW_SITE: 'Новая площадка',
            SITES_SETTINGS: 'Настройка площадки...'
        });
    }

    angular
        .module('iqsAppbarOrganizations')
        .config(translateConfig);
})();
