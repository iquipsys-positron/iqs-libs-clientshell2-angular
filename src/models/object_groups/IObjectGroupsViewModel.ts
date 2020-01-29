import { ObjectGroup } from '../../data';
import { SearchResult } from '../../services';

export interface IObjectGroupsViewModel {
    state: string;
    isSort: boolean;
    filter: any;

    StatisticsDataCollectionItem(updateCallback?: () => void): ObjectGroup[];
    read(successCallback?: (data: ObjectGroup[]) => void, errorCallback?: (error: any) => void);
    reload(successCallback?: (data: ObjectGroup[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(updateCallback?: () => void): ObjectGroup[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): ObjectGroup;
    getSelectedIndex(): number;
    removeItem(id: string): void;
    filterWithObjects(data: SearchResult[]);
    getGroupById(groupId: string): ObjectGroup;
    create(ObjectGroup: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void;
    deleteObjectGroupById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateObjectGroupById(id: string, ObjectGroup: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void;
    clean(): void;
}
