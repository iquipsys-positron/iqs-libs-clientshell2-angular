
(() => {

    const translateConfig = function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            SITES_INVITATION_TITLE: "Organization's management team",
            SITES_INVITATION_SKIP_BUTTON: 'Continue',
            SITES_INVITATION_CREATE_BUTTON: 'Send invitation',
            SITES_QUICK_START_INVITATION_TITLE: "Organization's management team",
            SITES_QUICK_START_INVITATION_SUBTITLE: 'Invite other users to your workorganization - these can be your employees, investors, consultants, contractors - anyone you trust to monitor and manage your workorganization.',
            SITES_QUICK_START_INVITATION_CREATE_BUTTON: 'Send invitation',
            SITES_CREATE_INVITE_PEOPLE: 'You can invite other users to your workorganization. These can be your employees, investors, consultants, contractors - anyone you trust to monitor and manage your workorganization.',
        });

        pipTranslateProvider.translations('ru', {
            SITES_INVITATION_TITLE: 'Команда управления площадкой',
            SITES_INVITATION_SKIP_BUTTON: 'Пропустить',
            SITES_INVITATION_CREATE_BUTTON: 'Послать приглашения',
            SITES_QUICK_START_INVITATION_TITLE: 'Команда управления площадкой',
            SITES_QUICK_START_INVITATION_SUBTITLE: 'Пригласите на Вашу рабочую площадку других пользователей. Это могут быть Ваши сотрудники, инвесторы, подрядчики, консультанты и другие коллеги, в зависимости от ваших производственных целей.',
            SITES_QUICK_START_INVITATION_CREATE_BUTTON: 'Послать приглашения',
            SITES_CREATE_INVITE_PEOPLE: 'Пригласите на Вашу рабочую площадку других пользователей. Это могут быть Ваши сотрудники, инвесторы, подрядчики, консультанты и другие коллеги, в зависимости от ваших производственных целей.',
        });
    }

    angular
        .module('iqsOrganizationInvitation')
        .config(translateConfig);

})();

