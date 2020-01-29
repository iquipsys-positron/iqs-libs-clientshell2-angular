(() => {
    const translateConfig = function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            LANDING_NAME: 'Positron',
            CLUSTER_ERROR_TITLE: 'Error',
            CLUSTER_ERROR_MESSAGE: 'An error occured during organization loading. Please, reload your application. If error occures again - contact us.'
        });

        pipTranslateProvider.translations('ru', {
            LANDING_NAME: 'Позитрон',
            CLUSTER_ERROR_TITLE: 'Ошибка',
            CLUSTER_ERROR_MESSAGE: 'Произошла ошибка во время загрузки сайта. Пожалуйста, перезагрузите приложение. Если ошибка повторится - сообщите нам о проблеме.'
        });
    }

    angular
        .module('iqsClientShell')
        .config(translateConfig);
})();
