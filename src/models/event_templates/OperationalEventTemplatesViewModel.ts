import { OperationalEventTemplatesModel } from './OperationalEventTemplatesModel';
import { IOperationalEventTemplatesViewModel } from './IOperationalEventTemplatesViewModel';
import { EventTemplate, IEventTemplatesDataService } from '../../data';
import { IOrganizationService } from '../../services';

class OperationalEventTemplatesViewModel implements IOperationalEventTemplatesViewModel {
    private _filter: any;
    private operationalEventTempletesModel: OperationalEventTemplatesModel;

    constructor(
        $log: ng.ILogService,
        $location: ng.ILocationService,
        $timeout: ng.ITimeoutService,
        pipTransaction: pip.services.ITransactionService,
        iqsOrganization: IOrganizationService,
        iqsEventTemplatesData: IEventTemplatesDataService
    ) {
        "ngInject";

        this._filter = null;
        this.operationalEventTempletesModel = new OperationalEventTemplatesModel($log, $location, $timeout, pipTransaction, iqsOrganization, iqsEventTemplatesData);
    }

    public read(successCallback?: (data: EventTemplate[]) => void, errorCallback?: (error: any) => void) {
        this.operationalEventTempletesModel.filter = this._filter;
        this.operationalEventTempletesModel.read(successCallback, errorCallback);
    }

    public reload(successCallback?: (data: EventTemplate[]) => void, errorCallback?: (error: any) => void): void {
        this.operationalEventTempletesModel.filter = this._filter;
        this.operationalEventTempletesModel.reload(successCallback, errorCallback);
    }

    public getCollection(localSearch?: string): EventTemplate[] {
        return this.operationalEventTempletesModel.get(localSearch);
    }

    public getTransaction(): pip.services.Transaction {
        return this.operationalEventTempletesModel.getTransaction();
    }

    public get isSort(): boolean {
        return this.operationalEventTempletesModel.isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this.operationalEventTempletesModel.isSort = value;
        }
    }

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get state(): string {
        return this.operationalEventTempletesModel.state;
    }

    public set state(value: string) {
        this.operationalEventTempletesModel.state = value;
    }

    public selectItem(index?: number) {
        this.operationalEventTempletesModel.selectItem(index);
    }

    public getSelectedItem(): EventTemplate {
        return this.operationalEventTempletesModel.getSelectedItem();
    }


    public get searchedCollection(): string[] {
        return this.operationalEventTempletesModel.getSearchedCollection();
    }

    public get selectedIndex(): number {
        return this.operationalEventTempletesModel.getSelectedIndex();
    }

    public set selectedIndex(index: number) {
        this.operationalEventTempletesModel.selectItem(index);
    }

    public removeItem(id: string) {
        this.operationalEventTempletesModel.remove(id);
    }

    public create(eventTemplate: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void {
        this.operationalEventTempletesModel.create(eventTemplate, successCallback, errorCallback);
    }

    public deleteEventTemplateById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.operationalEventTempletesModel.delete(id, successCallback, errorCallback);
    }

    public updateEventTemplateById(id: string, eventTemplate: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void {
        this.operationalEventTempletesModel.update(id, eventTemplate, successCallback, errorCallback);
    }

    public clean(): void {
        this.operationalEventTempletesModel.clean();
    }
}

angular
    .module('iqsEventTemplates.ViewModel', [
        'iqsEventTemplates.Data'
    ])
    .service('iqsOperationalEventTemplatesViewModel', OperationalEventTemplatesViewModel);

