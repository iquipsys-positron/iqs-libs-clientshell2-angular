(() => {
    function configOrganizationsResources(pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            ADD_SITE: 'Add organization',
            CLOSE_SITES: 'Cancel',
            REMOVE_SITE: 'Remove organization',
            SITES_DISCONNECT_BUTTON: 'Disconnect',
            SITES_DISCONNECT_CONFIRMATION_TITLE: 'Disconnect from organization',
            DEMO_LIMIT_INFORMATION_DIALOG_TITLE: 'Information',
            DEMO_LIMIT_ADD_SITE_INFORMATION_DIALOG_MESSAGE: 'Demo user can not create organizations. Register to be able to create and manage work organizations.',
            DEMO_LIMIT_REMOVE_SITE_INFORMATION_DIALOG_MESSAGE: 'Demo user can not manage organizations. Register to be able to create and manage work organizations.',
        });
        pipTranslateProvider.translations('ru', {
            ADD_SITE: 'Добавить площадку',
            REMOVE_SITE: 'Убрать площадку',
            CLOSE_SITES: 'Отмена',
            SITES_DISCONNECT_BUTTON: 'Убрать',
            SITES_DISCONNECT_CONFIRMATION_TITLE: 'Убрать площадку',
            DEMO_LIMIT_INFORMATION_DIALOG_TITLE: 'Информация',
            DEMO_LIMIT_ADD_SITE_INFORMATION_DIALOG_MESSAGE: 'Демо пользователь не может создавать свои рабочие площадки. Зарегистрируйтесь для получения возможности создавать рабочие площадки и управлять ими.',
            DEMO_LIMIT_REMOVE_SITE_INFORMATION_DIALOG_MESSAGE: 'Демо пользователь не может управлять рабочими площадками. Зарегистрируйтесь для получения возможности создавать рабочие площадки и управлять ими.',
        });
    }

    angular
        .module('iqsSideNav.Organizations')
        .config(configOrganizationsResources)
})();