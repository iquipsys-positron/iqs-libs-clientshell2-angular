
{
    function declareGlobalEventRulesTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            EVENT_RULE_MAX_SPEED_LIMIT: 'Maximum speed',
            EVENT_RULE_MIN_SPEED_LIMIT: 'Minimum speed',
            EVENT_RULE_IMMOBILITY_DURATION: 'It is stationary',
            EVENT_RULE_PRESENCE_DURATION: 'Presence time limit for zone (min)',
            EVENT_RULE_SHOWUP: 'Show up',
            EVENT_RULE_DISAPPEAR: 'Disapper'
        });

        pipTranslateProvider.translations('ru', {
            EVENT_RULE_MAX_SPEED_LIMIT: 'Максимальная скорость',
            EVENT_RULE_MIN_SPEED_LIMIT: 'Минимальная скорости',
            EVENT_RULE_IMMOBILITY_DURATION: 'Время нахождения в неподвижном состоянии',
            EVENT_RULE_PRESENCE_DURATION: 'Ограничение времени нахождения в зоне (мин)',
            EVENT_RULE_SHOWUP: 'Появился',
            EVENT_RULE_DISAPPEAR: 'Пропал'

        });
    }

    angular.module('iqsEventRules.ViewModel')
    .config(declareGlobalEventRulesTranslateResources);
}



