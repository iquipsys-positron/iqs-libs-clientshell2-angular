(() => {
    function declareCreditCardPanelTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            CREDIT_CARD_VISA: 'visa',
            CREDIT_CARD_MAESTRO: 'maestro',
            CREDIT_CARD_MASTERCARD: 'mastercard',
            CREDIT_CARD_DISCOVER: 'discover',
            CREDIT_CARD_AMERICAN_EXPRESS: 'amex',
            SITES_CREATE_CREDIT_CARD_NUMBER_LABEL: 'Credit card number',
            SITES_CREATE_CREDIT_CARD_TYPE_LABEL: 'Card type',
            SITES_CREATE_CREDIT_CARD_NUMBER_PLACEHOLDER: 'Enter card number',
            SITES_CREATE_CREDIT_CARD_FIRST_NAME_LABEL: 'Fisrt Name on Card',
            SITES_CREATE_CREDIT_CARD_LAST_NAME_LABEL: 'Last Name on Card',
            SITES_CREATE_CREDIT_CARD_NAME_PLACEHOLDER: 'Enter the name of the CC holder',
            SITES_CREATE_CREDIT_CARD_CODE_LABEL: 'Security code',
            SITES_CREATE_CREDIT_CARD_CODE_HINT: 'See the oppoorganization side of the card',
            SITES_CREATE_CREDIT_CARD_EXPIRED_LABEL: 'Expires date: month/year',
            SITES_CREATE_CREDIT_CARD_NUMBER_REQ_ERR: 'Enter credit card security code',
            SITES_CREATE_CREDIT_CARD_FIRST_NAME_REQ_ERR: "Enter the name of the CC's holder",
            SITES_CREATE_CREDIT_CARD_LAST_NAME_REQ_ERR: "Enter the name of the CC's holder",
            SITES_CREATE_CREDIT_CARD_NUMBER_PATTERN_ERR: 'Incorrect CC number',
            SITES_CREATE_CREDIT_CARD_CODE_REQ_ERR: "Enter your CC's security code (CSC)",
            SITES_CREATE_CREDIT_CARD_FIRST_NAME_PATTERN_ERR: 'Please enter name in English',
            SITES_CREATE_CREDIT_CARD_LAST_NAME_PATTERN_ERR: 'Please enter name in English',
            SITES_CREATE_CREDIT_CARD_CODE_PATTERN_ERR: 'Incorrect security code, please enter 3-4 digit',
        });
        pipTranslateProvider.translations('ru', {
            CREDIT_CARD_VISA: 'visa',
            CREDIT_CARD_MAESTRO: 'maestro',
            CREDIT_CARD_MASTERCARD: 'mastercard',
            CREDIT_CARD_DISCOVER: 'discover',
            CREDIT_CARD_AMERICAN_EXPRESS: 'amex',
            SITES_CREATE_CREDIT_CARD_NUMBER_LABEL: 'Номер карты',
            SITES_CREATE_CREDIT_CARD_TYPE_LABEL: 'Тип карты',
            SITES_CREATE_CREDIT_CARD_NUMBER_PLACEHOLDER: 'Введите номер карты',
            SITES_CREATE_CREDIT_CARD_FIRST_NAME_LABEL: 'Имя на карте',
            SITES_CREATE_CREDIT_CARD_LAST_NAME_LABEL: 'Фамилия на карте',
            SITES_CREATE_CREDIT_CARD_NAME_PLACEHOLDER: 'Введите имя указанное на карте',
            SITES_CREATE_CREDIT_CARD_CODE_LABEL: 'Код безопасности',
            SITES_CREATE_CREDIT_CARD_CODE_HINT: 'Указан на обратной стороне карты',
            SITES_CREATE_CREDIT_CARD_EXPIRED_LABEL: 'Срок действия: месяц/год',
            SITES_CREATE_CREDIT_CARD_NUMBER_REQ_ERR: 'Укажите код кредитной карты',
            SITES_CREATE_CREDIT_CARD_FIRST_NAME_REQ_ERR: 'Укажите имя владельца кредитной карты',
            SITES_CREATE_CREDIT_CARD_LAST_NAME_REQ_ERR: 'Укажите фамилию владельца кредитной карты',
            SITES_CREATE_CREDIT_CARD_NUMBER_PATTERN_ERR: 'Код кредитной карты введен не верно',
            SITES_CREATE_CREDIT_CARD_CODE_REQ_ERR: 'Укажите код безопасности кредитной карты',
            SITES_CREATE_CREDIT_CARD_FIRST_NAME_PATTERN_ERR: 'Пожалуйста введите имя используя английские символы',
            SITES_CREATE_CREDIT_CARD_LAST_NAME_PATTERN_ERR: 'Пожалуйста введите фамилию используя английские символы',
            SITES_CREATE_CREDIT_CARD_CODE_PATTERN_ERR: 'Неверно введен код безопасности, введите 3 или 4 цифры',
        });
    }

    angular
        .module('iqsCreditCardPanel')
        .config(declareCreditCardPanelTranslateResources);
})();