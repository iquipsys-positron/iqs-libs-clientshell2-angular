
{
    function declareEmergencyPlansResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            EMERGENCY_PLANS_AUX_TITLE: 'Emergency response',
            EMERGENCY_PLANS_AUX_SUBTITLE: 'In event of emergency, select an appropriate action plan and follow steps outlined above to resolve the situation',
            EMERGENCY_PLANS_AUX_DETAILS_TITLE: 'Emergency response',
            EMERGENCY_PLANS_AUX_DATA_EMPTY_TITLE: 'There are no emergency plans',
            EMERGENCY_PLANS_AUX_DATA_EMPTY_SUBTITLE: "A written plan of actions in emergency situation helps workers to perform their actions quickly and efficiently. It utilizes the system capabilities in resolving crisis situations and can save people's lives and expensive equipment.",
            EMERGENCY_PLANS_AUX_DATA_EMPTY_BUTTON: 'Setting emergency plans',
            EMERGENCY_PLANS_AUX_BUTTON_OPTIONS: 'Setting emergency plans',
            EMERGENCY_PLANS_AUX_BUTTON_PEOPLE: 'Open event journal',
            EMERGENCY_PLANS_AUX_BUTTON_OBJECT: 'Find objects on the roads',
            EMERGENCY_PLANS_AUX_BUTTON_EVENT: 'Open event journal',

            EP_ACTION_PAGE_MAP: 'Map',
            EP_ACTION_PAGE_OBJECT: 'Find objects on the map',
            EP_ACTION_PAGE_LAST_EVENTS: 'Last events',
            EP_ACTION_PAGE_PEOPLE: 'Find people on the map',
            EMERGENCY_DATAILS_COMPLETE_BUTTON: 'Complete actions',
            EP_ACTION_PAGE_SEND_SIGNALS: 'Send signal',
            SEND_SIGNAL_OK: 'Signal sent'
        });
        pipTranslateProvider.translations('ru', {
            EMERGENCY_PLANS_AUX_TITLE: 'Действия при ЧС',
            EMERGENCY_PLANS_AUX_SUBTITLE: 'При возникновении чрезвычайной ситуации выберете соответствующий план действий и выполните описанные шаги для разрешения ситуации',
            EMERGENCY_PLANS_AUX_DETAILS_TITLE: 'Действия при ЧС',
            EMERGENCY_PLANS_AUX_DATA_EMPTY_TITLE: 'Планы ЧС отсутствуют',
            EMERGENCY_PLANS_AUX_DATA_EMPTY_SUBTITLE: 'Написанный план действий при чрезвычайной ситуации позволит работникам быстро и качественно выполнить необходимые действия. Он использует возможности системы при разрешении кризисных ситуаций и может спасти жизни людей и дорогостоящее оборудование.',
            EMERGENCY_PLANS_AUX_DATA_EMPTY_BUTTON: 'Настроить планы ЧС',
            EMERGENCY_PLANS_AUX_BUTTON_OPTIONS: 'Настройки планов ЧС',
            EMERGENCY_PLANS_AUX_BUTTON_PEOPLE: 'Открыть журнал событий',
            EMERGENCY_PLANS_AUX_BUTTON_OBJECT: 'Найти объекты на дорогах',
            EMERGENCY_PLANS_AUX_BUTTON_EVENT: 'Открыть журнал событий',

            EP_ACTION_PAGE_MAP: 'Карта',
            EP_ACTION_PAGE_OBJECT: 'Найти объекты на карте',
            EP_ACTION_PAGE_LAST_EVENTS: 'Последние события',
            EP_ACTION_PAGE_PEOPLE: 'Найти людей на карте',
            EMERGENCY_DATAILS_COMPLETE_BUTTON: 'Завершить действия',
            EP_ACTION_PAGE_SEND_SIGNALS: 'Послать сигнал',
            SEND_SIGNAL_OK: 'Сигнал отправлен'
        });
    }

    angular
        .module('iqsEmergencyPlansAux')
        .config(declareEmergencyPlansResources);
}
