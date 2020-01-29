(() => {
    const translateConfig = function (pipTranslateProvider) {
        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
            'LANDING_NAME': 'Positron',            
            'LANDING_TITLE': 'Safety and control made easy',
            'LANDING_START_LOOK': 'Start monitoring',
            'LANDING_SIGNIN': 'Sign in',
            'CONNECTION': 'Contact us',
            'PRICE': 'Price',
            'ABOUT_SYSTEM': 'About us',
            'LANDING_SUBTITLE': 'Whatever you do and where you are, Positron will help you keep control of the situation on all your work organizations',
            LANDING_START_HERE: 'Login',
            LANDING_SIGNUP: 'Register new account'
        });

        pipTranslateProvider.translations('ru', {
            'LANDING_NAME': 'Позитрон',            
            'LANDING_TITLE': 'Держим работу под контролем',
            'LANDING_START_LOOK': 'Начать наблюдение',
            'LANDING_SIGNIN': 'Войти',
            'CONNECTION': 'Связаться с нами',
            'PRICE': 'Цены',
            'ABOUT_SYSTEM': 'О системе',
            'LANDING_SUBTITLE': 'Чем бы вы не занимались и где бы не находились, Позитрон позволит вам легко отслеживать ситуацию на всех ваших рабочих площадках ',
            LANDING_START_HERE: 'Войти',
            LANDING_SIGNUP: 'Зарегистрироваться'
        });
    }

    angular
        .module('iqsLanding')
        .config(translateConfig);
})();