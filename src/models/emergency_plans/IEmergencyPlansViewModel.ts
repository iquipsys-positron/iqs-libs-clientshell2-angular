import { EmergencyPlan } from '../../data';

export interface IEmergencyPlansViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];
    mustOpened: EmergencyPlan;
    selectedItem: EmergencyPlan;

    read(successCallback?: (data: EmergencyPlan[]) => void, errorCallback?: (error: any) => void);
    reload(successCallback?: (data: EmergencyPlan[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(localSearch?: string): EmergencyPlan[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): EmergencyPlan;

    removeItem(id: string): void;
    create(gateway: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void;
    deleteEmergencyPlansById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateEmergencyPlansById(id: string, gateway: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void;
    selectItemById(id: string): void;
    clean(): void;
}
