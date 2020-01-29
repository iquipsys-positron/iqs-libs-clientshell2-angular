import { EventTemplate } from '../../data';

export interface IOperationalEventTemplatesViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];

    read(successCallback?: (data: EventTemplate[]) => void, errorCallback?: (error: any) => void);
    reload(successCallback?: (data: EventTemplate[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(localSearch?: string): EventTemplate[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): EventTemplate;

    removeItem(id: string): void;
    create(eventTemplate: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void;
    deleteEventTemplateById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateEventTemplateById(id: string, eventTemplate: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void;
    clean(): void;
}
