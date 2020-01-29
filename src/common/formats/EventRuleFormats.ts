import './EventRuleFormatService';

import { IEventRuleFormatService } from './IEventRuleFormatService';
import { EventRule } from '../../data';

function formatObjectsListFilter(iqsEventRuleFormat: IEventRuleFormatService) {
    "ngInject";

    return (item: EventRule): string => {
        return iqsEventRuleFormat.formatObjectsList(item);
    }
}


angular
    .module('iqsFormats.EventRuleFilter', ['iqsFormats.EventRule'])
    .filter('formatObjectsList', formatObjectsListFilter);