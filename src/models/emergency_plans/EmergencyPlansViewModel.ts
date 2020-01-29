import { EmergencyPlansModel } from './EmergencyPlansModel';
import { IEmergencyPlansViewModel } from './IEmergencyPlansViewModel';
import { EmergencyPlan, IEmergencyPlansDataService } from '../../data';
import { IOrganizationService } from '../../services';

class EmergencyPlansViewModel implements IEmergencyPlansViewModel {
    private _filter: any;
    private emergencyPlanModel: EmergencyPlansModel;

    constructor(
        $log: ng.ILogService,
        $location: ng.ILocationService,
        $timeout: ng.ITimeoutService,
        pipTransaction: pip.services.ITransactionService,
        iqsOrganization: IOrganizationService,
        iqsEmergencyPlansData: IEmergencyPlansDataService
    ) {
        "ngInject";

        this._filter = null;
        this.emergencyPlanModel = new EmergencyPlansModel($log, $location, $timeout, pipTransaction, iqsOrganization, iqsEmergencyPlansData);
    }

    public read(successCallback?: (data: EmergencyPlan[]) => void, errorCallback?: (error: any) => void) {
        this.emergencyPlanModel.filter = this._filter;
        this.emergencyPlanModel.read(successCallback, errorCallback);
    }

    public reload(successCallback?: (data: EmergencyPlan[]) => void, errorCallback?: (error: any) => void): void {
        this.emergencyPlanModel.filter = this._filter;
        this.emergencyPlanModel.reload(successCallback, errorCallback);
    }

    public getCollection(localSearch?: string): EmergencyPlan[] {
        return this.emergencyPlanModel.get(localSearch);
    }

    public getTransaction(): pip.services.Transaction {
        return this.emergencyPlanModel.getTransaction();
    }

    public get isSort(): boolean {
        return this.emergencyPlanModel.isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this.emergencyPlanModel.isSort = value;
        }
    }

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get state(): string {
        return this.emergencyPlanModel.state;
    }

    public set state(value: string) {
        this.emergencyPlanModel.state = value;
    }

    public selectItem(index?: number) {
        this.emergencyPlanModel.selectItem(index);
    }

    public getSelectedItem(): EmergencyPlan {
        return this.emergencyPlanModel.getSelectedItem();
    }


    public get searchedCollection(): string[] {
        return this.emergencyPlanModel.getSearchedCollection();
    }

    public get selectedIndex(): number {
        return this.emergencyPlanModel.getSelectedIndex();
    }

    public set selectedIndex(index: number) {
        this.emergencyPlanModel.selectItem(index);
    }

    public removeItem(id: string) {
        this.emergencyPlanModel.remove(id);
    }

    public create(emergencyPlan: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void {
        this.emergencyPlanModel.create(emergencyPlan, successCallback, errorCallback);
    }

    public deleteEmergencyPlansById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.emergencyPlanModel.delete(id, successCallback, errorCallback);
    }

    public updateEmergencyPlansById(id: string, emergencyPlan: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void {
        this.emergencyPlanModel.update(id, emergencyPlan, successCallback, errorCallback);
    }

    public get mustOpened(): EmergencyPlan {
        return this.emergencyPlanModel.mustOpened;
    }

    public set mustOpened(emergencyPlan: EmergencyPlan) {
        this.emergencyPlanModel.mustOpened = emergencyPlan;;
    }

    public get selectedItem(): EmergencyPlan {
        return this.emergencyPlanModel.getSelectedItem();
    }

    public selectItemById(id: string): void {
        this.emergencyPlanModel.selectItemById(id);
    }

    public clean(): void {
        this.emergencyPlanModel.clean();
    }     
}

angular.module('iqsEmergencyPlans.ViewModel', ['iqsEmergencyPlans.Data'])
    .service('iqsEmergencyPlansViewModel', EmergencyPlansViewModel);

