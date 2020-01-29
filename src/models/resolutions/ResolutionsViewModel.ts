import { IResolutionsViewModel } from './IResolutionsViewModel';
import { ResolutionsModel } from './ResolutionsModel';
import { Resolution, IResolutionsDataService } from '../../data';
import { IOrganizationService } from '../../services'

class ResolutionsViewModel implements IResolutionsViewModel {
    private _filter: any;
    private resolutionsModel: ResolutionsModel;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService,
        private iqsResolutionsData: IResolutionsDataService
    ) {
        "ngInject";

        this._filter = null;
        this.resolutionsModel = new ResolutionsModel($log, $location, $timeout, pipTransaction, iqsOrganization, iqsResolutionsData);
    }

    public read(successCallback?: (data: Resolution[]) => void, errorCallback?: (error: any) => void) {
        this.resolutionsModel.filter = this._filter;
        this.resolutionsModel.read(successCallback, errorCallback);
    }

    public reload(successCallback?: (data: Resolution[]) => void, errorCallback?: (error: any) => void): void {
        this.resolutionsModel.filter = this._filter;
        this.resolutionsModel.reload(successCallback, errorCallback);
    }

    public getCollection(localSearch?: string): Resolution[] {
        return this.resolutionsModel.get(localSearch);
    }

    public getTransaction(): pip.services.Transaction {
        return this.resolutionsModel.getTransaction();
    }

    public get isSort(): boolean {
        return this.resolutionsModel.isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this.resolutionsModel.isSort = value;
        }
    }

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get state(): string {
        return this.resolutionsModel.state;
    }

    public set state(value: string) {
        this.resolutionsModel.state = value;
    }

    public selectItem(index?: number) {
        this.resolutionsModel.selectItem(index);
    }

    public getSelectedItem(): Resolution {
        return this.resolutionsModel.getSelectedItem();
    }

    public get searchedCollection(): string[] {
        return this.resolutionsModel.getSearchedCollection();
    }

    public get selectedIndex(): number {
        return this.resolutionsModel.getSelectedIndex();
    }

    public set selectedIndex(index: number) {
        this.resolutionsModel.selectItem(index);
    }

    public removeItem(id: string) {
        this.resolutionsModel.remove(id);
    }

    public create(resolution: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void {
        this.resolutionsModel.create(resolution, successCallback, errorCallback);
    }

    public deleteResolutionById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.resolutionsModel.delete(id, successCallback, errorCallback);
    }

    public updateResolutionById(id: string, resolution: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void {
        this.resolutionsModel.update(id, resolution, successCallback, errorCallback);
    }

    public getResolutionsByEventRuleId(ruleId: string): Resolution[] {
        return this.resolutionsModel.getResolutionsByEventRuleId(ruleId);
    }

    public getResolutionsByName(resolution: string): Resolution {
        return this.resolutionsModel.getResolutionsByName(resolution);
    } 

    public clean(): void {
        this.resolutionsModel.clean();
    }       
}


angular.module('iqsResolutions.ViewModel', ['iqsResolutions.Data'])
    .service('iqsResolutionsViewModel', ResolutionsViewModel);

