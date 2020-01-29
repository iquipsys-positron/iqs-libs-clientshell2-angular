import { ObjectsModel } from './ObjectsModel';
import { IObjectsViewModel } from './IObjectsViewModel';
import { ControlObject } from '../../data';

export interface IObjectsViewModel {
    objects: ObjectsModel;
    initObjects(type?: string, successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void): void;
    read(successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void) 
    getObjects(type?: string);
    selectItem(index?: number);
    getObjectById(objectId: string): ControlObject;
    getObjectByName(name: string): string;
    filterObjects(type: string): ControlObject[];
    filterObjectsArray(array);
    saveObject(data: ControlObject, callback?: (item: ControlObject) => void, errorCallback?: (err: any) => void);
    deleteObject(id: string, callback?: () => void, errorCallback?: () => void);
    updateObject(data: ControlObject, callback?: (item) => void, errorCallback?: (err) => void);
    getTransaction(): pip.services.Transaction;
    allObjects: ControlObject[];
    state: string;
    selectedIndex: number;
    personsCount: number;
    devicesCount: number;
    assetsCount: number;

    clean(): void;
}