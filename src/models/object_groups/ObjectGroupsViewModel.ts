import { ObjectGroup, IObjectGroupsDataService } from '../../data';
import { IObjectGroupsViewModel } from './IObjectGroupsViewModel';
import { ObjectGroupsModel } from './ObjectGroupsModel';
import { IObjectsViewModel } from '../../models/objects/IObjectsViewModel';
import {
    IOrganizationService,
    SearchResult
} from '../../services';

class ObjectGroupsViewModel implements IObjectGroupsViewModel {
    private _filter: any;
    private objectGroupsModel: ObjectGroupsModel;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService,
        private iqsObjectGroupsData: IObjectGroupsDataService,
        private iqsObjectsViewModel: IObjectsViewModel
    ) {
        "ngInject";

        this._filter = null;
        this.objectGroupsModel = new ObjectGroupsModel($log, $location, $timeout, pipTransaction, iqsOrganization, iqsObjectGroupsData, iqsObjectsViewModel);
    }

    public read(successCallback?: (data: ObjectGroup[]) => void, errorCallback?: (error: any) => void) {
        this.objectGroupsModel.filter = this._filter;
        this.objectGroupsModel.read(successCallback, errorCallback);
    }

    public reload(successCallback?: (data: ObjectGroup[]) => void, errorCallback?: (error: any) => void): void {
        this.objectGroupsModel.filter = this._filter;
        this.objectGroupsModel.reload(successCallback, errorCallback);
    }

    public getCollection(updateCallback?: () => void): ObjectGroup[] {
        return this.objectGroupsModel.get(updateCallback);
    }

    public getTransaction(): pip.services.Transaction {
        return this.objectGroupsModel.getTransaction();
    }
    
    public getGroupById(groupId: string): ObjectGroup {
        return this.objectGroupsModel.getGroupById(groupId);
    }

    public get isSort(): boolean {
        return this.objectGroupsModel.isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this.objectGroupsModel.isSort = value;
        }
    }

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get state(): string {
        return this.objectGroupsModel.state;
    }

    public set state(value: string) {
        this.objectGroupsModel.state = value;
    }

    public selectItem(index?: number) {
        this.objectGroupsModel.selectItem(index);
    }

    public getSelectedItem(): ObjectGroup {
        return this.objectGroupsModel.getSelectedItem();
    }

    public getSelectedIndex(): number {
        return this.objectGroupsModel.getSelectedIndex();
    }

    public removeItem(id: string) {
        this.objectGroupsModel.remove(id);
    }

    public create(ObjectGroup: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void {
        this.objectGroupsModel.create(ObjectGroup, successCallback, errorCallback);
    }

    public deleteObjectGroupById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.objectGroupsModel.delete(id, successCallback, errorCallback);
    }

    public updateObjectGroupById(id: string, ObjectGroup: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void {
        this.objectGroupsModel.update(id, ObjectGroup, successCallback, errorCallback);
    }

    public StatisticsDataCollectionItem(updateCallback?: () => void): ObjectGroup[] {
        return this.objectGroupsModel.getFilterGroups(updateCallback);
    }

    public filterWithObjects(data: SearchResult[]) {
        this.objectGroupsModel.filterWithObjects(data);
    }
    
    public clean(): void {
        this.objectGroupsModel.clean();
    }    
}


angular.module('iqsObjectGroups.ViewModel', ['iqsObjectGroups.Data'])
    .service('iqsObjectGroupsViewModel', ObjectGroupsViewModel);

