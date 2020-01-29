import { EventRule } from '../../data';

export interface IEventRuleFormatService {
    formatObjectsList(item: EventRule): string;
}