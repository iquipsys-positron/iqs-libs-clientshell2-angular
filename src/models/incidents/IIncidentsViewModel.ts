import { Incident, ControlObject } from '../../data';


export interface IIncidentsViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    selectedId: string;
    selectedItem: Incident;
    incidentsCount: number;
    mustOpened: Incident;
    hideAll: boolean;
    total: number;
    shortIncidentListCount: number;

    read(successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void);
    readOptionaly(filter: any, successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readIncidentsCount(successCallback?: (cnt: number) => void, errorCallback?: (error: any) => void): void;
    reload(successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(): Incident[];
    getAll(): Incident[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    removeItem(id: string): void
    create(Incident: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void;
    deleteIncidentById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateIncidentById(id: string, Incident: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void;
    readForEvent(eventId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    selectItemById(id: string): void;
    getIncidentCount(objectId: string): number;
    getGroups(object: ControlObject): string;
    getLocationName(incident: Incident): string;
    getIncidentDetails(incident: any): string;
    clean(): void;
    reCalcElapsedDate(): void;
}
