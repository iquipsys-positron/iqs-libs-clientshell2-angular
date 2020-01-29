angular.module('iqsFormats', [
    'iqsFormats.EventRule',
    'iqsFormats.EventRuleFilter',
    'iqsFormats.Object',
    'iqsFormats.ObjectFilter',
]);

import './EventRuleFormats';
import './EventRuleFormatService';
import './ObjectFormats';
import './ObjectFormatService';

export * from './IEventRuleFormatService';
export * from './IObjectFormatService';