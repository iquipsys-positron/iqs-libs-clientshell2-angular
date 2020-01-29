import { ObjectConfigs } from './ObjectConfigs'

export interface IObjectConfigsService {
    id: string;
    type: string; // search
    section: number;
    get(): ObjectConfigs;
    clean(): void;
}