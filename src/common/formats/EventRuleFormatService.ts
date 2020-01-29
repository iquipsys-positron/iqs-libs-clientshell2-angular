import { IEventRuleFormatService } from './IEventRuleFormatService';
import { EventRule } from '../../data';
import { IEventRulesViewModel } from '../../models/event_rules/IEventRulesViewModel';

(() => {

    class EventRuleFormatService implements IEventRuleFormatService {


        constructor(
            private pipTranslate: pip.services.ITranslateService,
            private iqsEventRulesViewModel: IEventRulesViewModel
        ) {

        }

        public formatObjectsList(rule: EventRule): string {
            let result: string = '';

            if (rule.includeObjectsDescription === undefined || rule.excludeObjectsDescription === undefined) {
                this.iqsEventRulesViewModel.setObjectsDescriptions(rule);
            }

            if (!rule.includeObjectsDescription && !rule.excludeObjectsDescription) {
                return this.pipTranslate.translate('EVENT_RULE_INCLUDE_OBJECT_DESCRIPTION_ALL');
            }

            if (rule.includeObjectsDescription) {
                result = this.pipTranslate.translate('EVENT_RULE_INCLUDE_OBJECT_PREFIX') + ' ' + rule.includeObjectsDescription;
            }

            if (rule.excludeObjectsDescription) {
                result = result ? result + ', ' : '';
                result += this.pipTranslate.translate('EVENT_RULE_EXCLUDE_OBJECT_PREFIX') + ' ' + rule.excludeObjectsDescription;
            }

            return result;
        }

    }

    function declareEventRulesFormatTranslations(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            EVENT_RULE_INCLUDE_OBJECT_DESCRIPTION_ALL: 'For all',
            EVENT_RULE_INCLUDE_OBJECT_PREFIX: 'For',
            EVENT_RULE_EXCLUDE_OBJECT_PREFIX: 'Except for',
        });

        pipTranslateProvider.translations('ru', {
            EVENT_RULE_INCLUDE_OBJECT_DESCRIPTION_ALL: 'Для всех',
            EVENT_RULE_INCLUDE_OBJECT_PREFIX: 'Для',
            EVENT_RULE_EXCLUDE_OBJECT_PREFIX: 'Кроме',
        });
    }

    angular
        .module('iqsFormats.EventRule', [])
        .service('iqsEventRuleFormat', EventRuleFormatService)
        .config(declareEventRulesFormatTranslations);
})();
