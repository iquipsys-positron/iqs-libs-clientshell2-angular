import { Resolution } from '../../data';


export interface IResolutionsViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];

    read(successCallback?: (data: Resolution[]) => void, errorCallback?: (error: any) => void);
    reload(successCallback?: (data: Resolution[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(localSearch?: string): Resolution[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): Resolution;

    removeItem(id: string): void;
    create(eventTemplate: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void;
    deleteResolutionById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateResolutionById(id: string, eventTemplate: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void;
    getResolutionsByEventRuleId(ruleId: string): Resolution[];
    getResolutionsByName(resolution: string): Resolution;
    clean(): void;
}
