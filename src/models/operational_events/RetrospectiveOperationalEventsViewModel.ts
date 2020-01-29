import { OperationalEventsModel } from './OperationalEventsModel';
import { IOperationalEventsViewModel } from './IOperationalEventsViewModel';
import { OperationalEvent, IOperationalEventsDataService } from '../../data';
import {
    IAccountsViewModel,
    IEventRulesViewModel,
    IIncidentsViewModel,
    ILocationsViewModel,
    IObjectGroupsViewModel,
    IObjectsViewModel,
    IZonesViewModel,
    AssocietedObject
} from '../../models';
import { IOrganizationService } from '../../services';

class RetrospectiveOperationalEventsViewModel implements IOperationalEventsViewModel {
    private operationalEventModel: OperationalEventsModel;
    private _filter: any;

    constructor(
        $log: ng.ILogService,
        $location: ng.ILocationService,
        $timeout: ng.ITimeoutService,
        pipToasts: pip.controls.IToastService,
        pipTransaction: pip.services.ITransactionService,
        pipTranslate: pip.services.ITranslateService,
        iqsOrganization: IOrganizationService,
        iqsOperationalEventsData: IOperationalEventsDataService,
        iqsObjectsViewModel: IObjectsViewModel,
        iqsZonesViewModel: IZonesViewModel,
        iqsLocationsViewModel: ILocationsViewModel,
        iqsIncidentsViewModel: IIncidentsViewModel,
        iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        pipDateFormat: pip.dates.IDateFormatService,
        iqsAccountsViewModel: IAccountsViewModel,
        iqsEventRulesViewModel: IEventRulesViewModel,
    ) {
        "ngInject";
        this._filter = null;

        this.operationalEventModel = new OperationalEventsModel($log, $location, $timeout, pipToasts, pipTransaction, pipTranslate,
            iqsOrganization, iqsOperationalEventsData, iqsObjectsViewModel, iqsZonesViewModel, iqsLocationsViewModel,
            iqsIncidentsViewModel, iqsObjectGroupsViewModel, pipDateFormat, iqsAccountsViewModel, iqsEventRulesViewModel);
    }


    public readOptionaly(filter: any, successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void) {
        return this.operationalEventModel.readOptionaly(filter, successCallback, errorCallback);
    }

    public read(isLoading?: boolean, successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void) {
        this.operationalEventModel.filter = this._filter;
        this.operationalEventModel.read(isLoading, successCallback, errorCallback);
    }

    public reload(successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void): void {
        this.operationalEventModel.filter = this._filter;

        this.operationalEventModel.reload(successCallback, errorCallback);
    }

    public getCollection(): OperationalEvent[] {
        return this.operationalEventModel.get();
    }

    public applyFilter(localFilter?: AssocietedObject): OperationalEvent[] {
        return this.operationalEventModel.applyFilter(localFilter);
    }

    public getTransaction(): pip.services.Transaction {
        return this.operationalEventModel.getTransaction();
    }

    public get search(): string {
        return this.operationalEventModel.search;
    }

    public set search(value: string) {
        this.operationalEventModel.search = value;
    }

    public get state(): string {
        return this.operationalEventModel.state;
    }

    public set state(value: string) {
        this.operationalEventModel.state = value;
    }

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public selectItem(index?: number) {
        this.operationalEventModel.selectItem(index);
    }

    public get isSort(): boolean {
        return this.operationalEventModel.isSort;
    }

    public set isSort(value: boolean) {
        this.operationalEventModel.isSort = value;
    }

    public get selectAllow(): boolean {
        return this.operationalEventModel.selectAllow;
    }

    public set selectAllow(value: boolean) {
        if (!!value) {
            this.operationalEventModel.selectAllow = value;
        }
    }

    public getSelectedItem(): OperationalEvent {
        return this.operationalEventModel.getSelectedItem();
    }

    public get selectedIndex(): number {
        return this.operationalEventModel.selectedIndex;
    }

    public set selectedIndex(index: number) {
        this.operationalEventModel.selectItem(index);
    }

    public removeItem(id: string) {
        this.operationalEventModel.remove(id);
    }

    public create(operationalEvent: OperationalEvent, successCallback?: (data: OperationalEvent) => void, errorCallback?: (error: any) => void): void {
        this.operationalEventModel.create(operationalEvent, successCallback, errorCallback);
    }

    public deleteOperationalEventById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.operationalEventModel.delete(id, successCallback, errorCallback);
    }

    public clean(): void {
        this.operationalEventModel.clean();
    }

    public reCalcElapsedDate(): void {
        this.operationalEventModel.reCalcElapsedDate();
    }

    public addReferences(collection: OperationalEvent[]): OperationalEvent[] {
        return this.operationalEventModel.addReferences(collection);
    }

    public readRefEvent(eventId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.operationalEventModel.readRefEvent(eventId, successCallback, errorCallback);
    }

    public getDefaultCollection(): string[] {
        return this.operationalEventModel.defaultCollection;
    }

    public getSearchedCollection(): string[] {
        return this.operationalEventModel.searchedCollection;
    }

    public referenceDetails(item: OperationalEvent): void {
        this.operationalEventModel.referenceDetails(item);
    }
}
{
    angular
        .module('iqsRetrospectiveOperationalEvents.ViewModel', [
            'iqsObjects.ViewModel',
            'iqsZones.ViewModel',
            'iqsLocations.ViewModel',
            'iqsIncidents.ViewModel',
            'iqsObjectGroups.ViewModel',
            'iqsAccounts.ViewModel',
            'iqsEventRules.ViewModel',
        ])
        .service('iqsRetrospectiveOperationalEventsViewModel', RetrospectiveOperationalEventsViewModel);

}