import './ObjectFormatService';

import { IObjectFormatService } from './IObjectFormatService';
import { ControlObject } from '../../data';

function formatObjectSubtitleFilter(iqsObjectFormat: IObjectFormatService) {
    "ngInject";

    return (item: ControlObject): string => {
        return iqsObjectFormat.formatSubtitle(item);
    }
}


angular
    .module('iqsFormats.ObjectFilter', ['iqsFormats.Object'])
    .filter('formatObjectSubtitle', formatObjectSubtitleFilter);