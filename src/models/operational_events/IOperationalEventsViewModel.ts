import { OperationalEvent } from '../../data';
import { AssocietedObject } from '../../models';

export interface IOperationalEventsViewModel {
    state: string;
    isSort: boolean;
    selectAllow: boolean;
    filter: any;
    selectedIndex: number;
    search: string;

    readOptionaly(filter: any, successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void);
    read(isLoading?: boolean, successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void);
    reload(successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(): OperationalEvent[];
    applyFilter(localFilter?: AssocietedObject): OperationalEvent[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): OperationalEvent;
    removeItem(id: string): void;
    create(operationalEvent: OperationalEvent, successCallback?: (data: OperationalEvent) => void, errorCallback?: (error: any) => void): void;
    deleteOperationalEventById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    clean(): void;
    reCalcElapsedDate(): void;
    addReferences(collection: OperationalEvent[]): OperationalEvent[];
    readRefEvent(eventId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    getDefaultCollection(): string[];
    getSearchedCollection(): string[];
    referenceDetails(item: OperationalEvent): void;
}


