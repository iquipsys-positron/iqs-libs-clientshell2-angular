{
    function declareDemoTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            DEMO_LOADING_PROCESS: 'Demo start...'
        });
        pipTranslateProvider.translations('ru', {
            DEMO_LOADING_PROCESS: 'Старт демонстрации...'
        });
    }


    angular
        .module('iqsDemo')
        .config(declareDemoTranslateResources);
}
