export enum IncidentsUpdateType {
    Counter = 'counter',
    Full = 'full'
}

export interface IIncidentsConfigService {
    updateType: IncidentsUpdateType;
}
