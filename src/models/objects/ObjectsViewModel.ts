import '../../services/object_configs/ObjectConfigsService';

import { ObjectsModel } from './ObjectsModel';
import { IObjectsViewModel } from './IObjectsViewModel';
import {
    IControlObjectsDataService,
    ICurrentObjectStatesDataService,
    ControlObject
} from '../../data';
import { IObjectConfigsService } from '../../services';

class ObjectsViewModel implements IObjectsViewModel {
    public objects: ObjectsModel;

    constructor(
        $location: ng.ILocationService,
        pipTransaction: pip.services.ITransactionService,
        iqsControlObjectsData: IControlObjectsDataService,
        iqsCurrentObjectStatesData: ICurrentObjectStatesDataService,
        iqsObjectConfigs: IObjectConfigsService) {

        this.objects = new ObjectsModel($location, pipTransaction, iqsControlObjectsData, iqsCurrentObjectStatesData, iqsObjectConfigs);
    }

    public initObjects(type?: string, successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void) {
        this.objects.getObjects(type || 'all', successCallback, errorCallback);
    }

    public read(successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void) {
        this.objects.read(successCallback, errorCallback);
    }

    public allItems(): ControlObject[] {
        return this.objects.allObjects;
    }

    public filterObjects(type: string): ControlObject[] {
        return this.objects.filterData(type);
    }

    public filterObjectsArray(array) {
        this.objects.filterWithArrayObjects(array);
    }

    public getTransaction(): pip.services.Transaction {
        return this.objects.getTransaction();
    }

    public selectItem(index?: number) {
        this.objects.selectItem(index);
    }

    public getObjects(): ControlObject[] {
        return this.objects.objects;
    }

    public get state(): string {
        return this.objects.state;
    }

    public set state(state: string) {
        this.objects.state = state;
    }

    public get selectedIndex(): number {
        return this.objects.selectedIndex;
    }

    public set selectedIndex(index: number) {
        this.objects.selectedIndex = index;
    }

    public getObjectById(objectId: string): ControlObject {
        return this.objects.getObjectById(objectId);
    }

    public getObjectByName(name: string): string {
        return this.objects.getObjectByName(name);
    }

    public get allObjects(): ControlObject[] {
        return this.objects.allObjects;
    }

    public get personsCount() {
        return this.objects.personsCount;
    }

    public get devicesCount() {
        return this.objects.devicesCount;
    }

    public get assetsCount() {
        return this.objects.assetsCount;
    }

    public saveObject(data: ControlObject, callback?: (item: ControlObject) => void, errorCallback?: (err: any) => void) {
        this.objects.saveObject(data, callback, errorCallback);
    }

    public deleteObject(id: string, callback?: () => void, errorCallback?: () => void) {
        this.objects.deleteObject(id, callback, errorCallback);
    }

    public updateObject(data: ControlObject, callback?: (item) => void, errorCallback?: (err) => void) {
        this.objects.updateObject(data, callback, errorCallback);
    }

    public clean(): void {
        this.objects.clean();
    }
}

angular.module('iqsObjects.ViewModel', ['iqsControlObjects.Data', 'iqsCurrentObjectStates.Data', 'iqsObjectConfigs'])
    .service('iqsObjectsViewModel', ObjectsViewModel);