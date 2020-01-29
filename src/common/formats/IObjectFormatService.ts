import { ControlObject } from '../../data';

export interface IObjectFormatService {
    formatSubtitle(item: ControlObject): string;
}