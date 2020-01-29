(() => {

    const translateConfig = function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {

        });

        pipTranslateProvider.translations('ru', {

        });
    }

    angular
        .module('iqsOrganizations')
        .config(translateConfig);

})();
