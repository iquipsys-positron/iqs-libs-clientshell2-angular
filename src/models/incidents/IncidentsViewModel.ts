import '../locations/LocationsViewModel';

import { IncidentsModel } from './IncidentsModel';
import { IIncidentsViewModel } from './IIncidentsViewModel';
import { Incident, IIncidentsDataService, ControlObject } from '../../data';
import {
    IEventRulesViewModel,
    ILocationsViewModel,
    IObjectsViewModel,
    IObjectGroupsViewModel,
    ISettingsViewModel,
    IZonesViewModel
} from '../../models';
import {
    IOrganizationService,
    ITypeCollectionsService
} from '../../services';

class IncidentsViewModel implements IIncidentsViewModel {
    private _filter: any;
    private incidentsModel: IncidentsModel;

    constructor(
        $log: ng.ILogService,
        $location: ng.ILocationService,
        $rootScope: ng.IRootScopeService,
        $timeout: ng.ITimeoutService,
        pipToasts: pip.controls.IToastService,
        pipActions: pip.nav.IActionsService, 
        pipTransaction: pip.services.ITransactionService,
        pipTranslate: pip.services.ITranslateService,
        iqsOrganization: IOrganizationService,
        iqsIncidentsData: IIncidentsDataService,
        pipMedia: pip.layouts.IMediaService,
        iqsObjectsViewModel: IObjectsViewModel,
        iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        iqsLocationsViewModel: ILocationsViewModel,
        iqsTypeCollectionsService: ITypeCollectionsService,
        iqsEventRulesViewModel: IEventRulesViewModel,
        iqsZonesViewModel: IZonesViewModel,
        iqsSettingsViewModel: ISettingsViewModel,
        pipDateFormat: pip.dates.IDateFormatService 
    ) {
        "ngInject";

        this._filter = null;
        this.incidentsModel = new IncidentsModel($log, $location, $rootScope, $timeout, pipToasts, pipActions,
            pipTransaction, pipTranslate, iqsOrganization, iqsIncidentsData, pipMedia, iqsObjectsViewModel,
            iqsObjectGroupsViewModel, iqsLocationsViewModel, iqsTypeCollectionsService, iqsEventRulesViewModel, iqsZonesViewModel, 
            iqsSettingsViewModel, pipDateFormat);
    }

    public read(successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void) {
        this.incidentsModel.filter = this._filter;
        this.incidentsModel.read(successCallback, errorCallback);
    }

    public readOptionaly(filter: any, successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void) {
        return this.incidentsModel.readOptionaly(filter, successCallback, errorCallback);
    }

    public readIncidentsCount(successCallback?: (cnt: number) => void, errorCallback?: (error: any) => void) {
        return this.incidentsModel.readIncidentsCount(successCallback, errorCallback);
    }

    public reload(successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void): void {
        this.incidentsModel.filter = this._filter;
        this.incidentsModel.reload(successCallback, errorCallback);
    }

    public getCollection(): Incident[] {
        return this.incidentsModel.get();
    }

    public getAll(): Incident[] {
        return this.incidentsModel.getAll();
    }

    public getTransaction(): pip.services.Transaction {
        return this.incidentsModel.getTransaction();
    }

    public set hideAll(value: boolean) {
        this.incidentsModel.hideAll = value;
    }

    public get hideAll(): boolean {
        return this.incidentsModel.hideAll;
    }

    public get isSort(): boolean {
        return this.incidentsModel.isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this.incidentsModel.isSort = value;
        }
    }

    public get incidentsCount(): number {
        return this.incidentsModel.incidentsCount
    }

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get mustOpened(): Incident {
        return this.incidentsModel.mustOpened;
    }

    public set mustOpened(incident: Incident) {
        this.incidentsModel.mustOpened = incident;;
    }

    public get state(): string {
        return this.incidentsModel.state;
    }

    public set state(value: string) {
        this.incidentsModel.state = value;
    }

    public selectItem(index?: number) {
        this.incidentsModel.selectItem(index);
    }

    public set selectedId(value: string) {
        this.incidentsModel.selectedId = value;
    }

    public get total(): number {
        return this.incidentsModel.total;
    }

    public get shortIncidentListCount(): number {
        return this.incidentsModel.shortIncidentListCount;
    }

    public get selectedItem(): Incident {
        return this.incidentsModel.getSelectedItem();
    }

    public get selectedIndex(): number {
        return this.incidentsModel.selectedIndex;
    }

    public set selectedIndex(value: number) {
        this.incidentsModel.selectedIndex = value;
    }

    public selectItemById(id: string): void {
        this.incidentsModel.selectItemById(id);
    }

    public removeItem(id: string): void {
        this.incidentsModel.remove(id);
    }

    public create(Incident: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void {
        this.incidentsModel.create(Incident, successCallback, errorCallback);
    }

    public deleteIncidentById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.incidentsModel.delete(id, successCallback, errorCallback);
    }

    public updateIncidentById(id: string, Incident: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void {
        this.incidentsModel.update(id, Incident, successCallback, errorCallback);
    }

    public getIncidentCount(objectId: string): number {
        return this.incidentsModel.getIncidentCount(objectId);
    }

    public getGroups(object: ControlObject): string {
        return this.incidentsModel.getGroups(object);
    }

    public getLocationName(incident: Incident): string {
        return this.incidentsModel.getLocationName(incident);
    }

    public getIncidentDetails(incident: any): string {
        return this.incidentsModel.getIncidentDetails(incident);
    }

    public readForEvent(eventId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.incidentsModel.readForEvent(eventId, successCallback, errorCallback);
    }

    public reCalcElapsedDate(): void {
        this.incidentsModel.reCalcElapsedDate();
    }   

    public clean(): void {
        this.incidentsModel.clean();
    }   
}


angular.module('iqsIncidents.ViewModel', [
    'iqsIncidents.Data',
    'iqsLocations.ViewModel',
    'iqsObjects.ViewModel',
    'iqsObjectGroups.ViewModel',
    'iqsLocations.ViewModel',
    'iqsEventRules.ViewModel',
    'iqsZones.ViewModel',
    'iqsSettings.ViewModel'
])
    .service('iqsIncidentsViewModel', IncidentsViewModel);

