(() => {

    const translateOrganizationHomeConfig = function (pipTranslateProvider) {
        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
            SITE_WORK_START_TITLE: 'Work organization',
            SITE_WORK_START_SUBTITLE: "Positron allows you to monitor personnel, equipment, and devices on your workorganization. To see how it all works, please select 'Demo organization'. If you are ready to create your own, select 'Create a new organization'. If you were invited to an existing workorganization and have the organization's access code, select 'Enter code for an existing workorganization'.",
            SITE_WORK_START_CONNECT: 'Enter code for an existing workorganization',
            SITE_WORK_START_ADD_NEW: 'Create a new organization',
            SITE_CONNECT_DEMO: 'Demo organization'
        });

        pipTranslateProvider.translations('ru', {
            SITE_WORK_START_TITLE: 'Рабочая площадка',
            SITE_WORK_START_SUBTITLE: 'Система Позитрон позволяет наблюдать за действиями людей, машин и оборудования на площадке вашего предприятия. Чтобы посмотреть, как это работает, выберите Демо Площадку. Если Вы готовы начать работать в Позитроне, создайте свою собственную Новую Площадку. Если Вас пригласили поработать на уже созданной площадке и у вас есть ее код, введите его.',
            SITE_WORK_START_CONNECT: 'Ввести код чужой площадки',
            SITE_WORK_START_ADD_NEW: 'Создать новую площадку',
            SITE_CONNECT_DEMO: 'Демонстрационная площадка'

            // 
        });
    }

    angular
        .module('iqsOrganizationsHome')
        .config(translateOrganizationHomeConfig);

})();

