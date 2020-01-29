
{
    function declareSignalDialogTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            SEND_SIGNAL_DIALOG_TITLE: 'Send a signal to trackers',
            SEND_SIGNAL_DIALOG_SEND: 'Send',

            SEND_SIGNAL_OBJECT_OPTION_TITLE: 'Object',
            SEND_SIGNAL_ZONE_OPTION_TITLE: 'Zone',

            SEND_SIGNAL_TYPE_LABEL: 'Signal type',
            SEND_SIGNAL_OBJECTS_PLACEHOLDER: 'Add objects or groups',
            SEND_SIGNAL_ZONES_PLACEHOLDER: 'Add geo-zones or object zones',
            SEND_SIGNAL_DIALOG_OBJECTS: 'Set',
            SEND_SIGNAL_DIALOG_ZONES: 'Set',
            SEND_SIGNAL_OK: 'Signal sent',
            SIGNAL_TYPE_NONE: 'None',
            SIGNAL_TYPE_ATTENTION: 'Attention',
            SIGNAL_TYPE_CONFIRMATION: 'Confirmation',
            SIGNAL_TYPE_WARNING: 'Warning',
            SIGNAL_TYPE_EMERGENCY: 'Emergency',
        });
        pipTranslateProvider.translations('ru', {
            SEND_SIGNAL_DIALOG_TITLE: 'Послать сигнал на трекеры',
            SEND_SIGNAL_DIALOG_SEND: 'Послать',
            SEND_SIGNAL_OBJECT_OPTION_TITLE: 'Объекты',
            SEND_SIGNAL_ZONE_OPTION_TITLE: 'Зоны',
            SEND_SIGNAL_TYPE_LABEL: 'Тип сигнала',
            SEND_SIGNAL_OBJECTS_PLACEHOLDER: 'Добавить объект или группу',
            SEND_SIGNAL_ZONES_PLACEHOLDER: 'Добавить зону или зону объекта',
            SEND_SIGNAL_DIALOG_OBJECTS: 'Выбрать',
            SEND_SIGNAL_DIALOG_ZONES: 'Выбрать',
            SEND_SIGNAL_OK: 'Сигнал отправлен',
            SIGNAL_TYPE_NONE: 'Не задан',
            SIGNAL_TYPE_ATTENTION: 'Внимание',
            SIGNAL_TYPE_CONFIRMATION: 'Подтверждение',
            SIGNAL_TYPE_WARNING: 'Предупреждение',
            SIGNAL_TYPE_EMERGENCY: 'Тревога',
        });
    }

    angular
        .module('iqsSendSignalDialog')
        .config(declareSignalDialogTranslateResources);
}
