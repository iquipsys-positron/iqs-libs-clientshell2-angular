{
    function declareLoadingTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            DEMO_LIMIT_INFORMATION_DIALOG_TITLE: 'Information',
            DEMO_LIMIT_USER_SETTINGS_INFORMATION_DIALOG_MESSAGE: 'Demo user can not change user settings',
            DEMO_LIMIT_MANAGE_SITE_INFORMATION_DIALOG_MESSAGE: 'Demo user can not create organizations. Register to be able to create and manage work organizations.'
        });
        pipTranslateProvider.translations('ru', {
            DEMO_LIMIT_INFORMATION_DIALOG_TITLE: 'Информация',
            DEMO_LIMIT_USER_SETTINGS_INFORMATION_DIALOG_MESSAGE: 'Демо пользователь не может менять настройки пользователя',
            DEMO_LIMIT_MANAGE_SITE_INFORMATION_DIALOG_MESSAGE: 'Демо пользователь не может создавать свои рабочие площадки. Зарегистрируйтесь для получения возможности создавать рабочие площадки и управлять ими.'
        });
    }

    angular
        .module('iqsLoading')
        .config(declareLoadingTranslateResources);
}
