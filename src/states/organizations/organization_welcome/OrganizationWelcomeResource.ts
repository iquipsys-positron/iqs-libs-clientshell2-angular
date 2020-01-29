(() => {

    const translateOrganizationHomeConfig = function (pipTranslateProvider) {
        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
            SITES_SITE_WELCOME_TITLE: 'Enter your new workorganization',
            SITES_WELCOME_END_TITLE: 'Enter your new workorganization',
            SITES_WELCOME_END_SUBTITLE1: "All done!",
            SITES_WELCOME_END_SUBTITLE2: 'Now you can cut the ribbon and enter your new workorganization!',
            SITES_WELCOME_END_SUBTITLE3: "If you need to register new trackers in the system, be sure to take a look at the Object Registration section of our Help system (Look for a question mark icon (?) in the top right corner of your screen). There you can also find a lot of other useful information and instructions on various topics of Positron\'s usage.",
            SITES_WELCOME_END_SUBTITLE4: 'We thank you for selecting Positron and hope that it brings lots of value to your business. We would be glad to see it become an indispensable tool for all your production tracking and safety tasks.',
            SITES_WELCOME_END_SUBTITLE5: 'On your marks... Get set... Go!',
            SITES_WELCOME_END_SUBTITLE6: ' ',

            SITES_WELCOME_END_BUTTON: 'Continue',

        });

        pipTranslateProvider.translations('ru', {
            SITES_SITE_WELCOME_TITLE: 'Выход на Вашу новую площадку',
            SITES_WELCOME_END_TITLE: 'Выход на Вашу новую площадку',
            SITES_WELCOME_END_SUBTITLE1: 'Готово!',
            SITES_WELCOME_END_SUBTITLE2: 'Теперь вы можете перерезать ленточку и выйти на свою новую Рабочую Площадку.',
            SITES_WELCOME_END_SUBTITLE3: 'Инструкции для подключения трекеров и создания объектов наблюдения, а также другие полезные сведения Вы найдете в разделе Помощь – знак вопроса (?) в правом верхнем углу экрана Позитрона.',
            SITES_WELCOME_END_SUBTITLE4: 'Желаем Вам, чтобы Позитрон принес вам пользу и стал для Вас незаменимым инструментом контроля, учета и безопасности производства.',
            SITES_WELCOME_END_SUBTITLE5: 'Спасибо за Ваш выбор Позитрона.',
            SITES_WELCOME_END_SUBTITLE6: 'Удачной работы!',

            SITES_WELCOME_END_BUTTON: 'Начать работу',
            // 
        });
    }

    angular
        .module('iqsOrganizationWelcome')
        .config(translateOrganizationHomeConfig);

})();

