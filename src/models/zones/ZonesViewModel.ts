import '../../services/smart_zoom/SmartZoomService';

import { ZonesModel } from './ZonesModel';
import { IZonesViewModel } from './IZonesViewModel';
import {
    IZonesDataService,
    Zone
} from '../../data';
import {
    IObjectGroupsViewModel,
    IObjectsViewModel
} from '../../models';
import {
    IOrganizationService,
    ISmartZoomService
} from '../../services';

class ZonesViewModel implements IZonesViewModel {
    private _filter: any;
    private zonesModel: ZonesModel;

    constructor(
        $log: ng.ILogService,
        $location: ng.ILocationService,
        pipTransaction: pip.services.ITransactionService,
        iqsOrganization: IOrganizationService,
        iqsZonesData: IZonesDataService,
        iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        iqsObjectsViewModel: IObjectsViewModel,
        iqsSmartZoom: ISmartZoomService
    ) {
        "ngInject";

        this._filter = null;
        this.zonesModel = new ZonesModel($log, $location, pipTransaction, iqsOrganization,
            iqsObjectGroupsViewModel, iqsObjectsViewModel, iqsSmartZoom, iqsZonesData);
    }

    public read(successCallback?: (data: Zone[]) => void, errorCallback?: (error: any) => void) {
        this.zonesModel.filter = this._filter;
        this.zonesModel.read(successCallback, errorCallback);
    }

    public reload(successCallback?: (data: Zone[]) => void, errorCallback?: (error: any) => void): void {
        this.zonesModel.filter = this._filter;
        this.zonesModel.reload(successCallback, errorCallback);
    }

    public getCollection(localSearch?: string): Zone[] {
        return this.zonesModel.get(localSearch);
    }

    public getTransaction(): pip.services.Transaction {
        return this.zonesModel.getTransaction();
    }

    public selectItem(index?: number) {
        this.zonesModel.selectItem(index);
    }

    public getSelectedItem(): Zone {
        return this.zonesModel.getSelectedItem();
    }

    public removeItem(id: string) {
        this.zonesModel.remove(id);
    }

    public saveZone(zone: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): void {
        this.zonesModel.create(zone, successCallback, errorCallback);
    }

    public deleteZone(cause: string | Zone, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        const delId: string = typeof cause === 'string' ? cause : cause.id;

        this.zonesModel.delete(delId, successCallback, errorCallback);
    }

    public updateZone(id: string, zone: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): void {
        this.zonesModel.update(id, zone, successCallback, errorCallback);
    }

    public getZoneById(zoneId: string): Zone {
        return this.zonesModel.getZoneById(zoneId);
    }

    // property

    public get isSort(): boolean {
        return this.zonesModel.isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this.zonesModel.isSort = value;
        }
    }

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get state(): string {
        return this.zonesModel.state;
    }

    public set state(value: string) {
        this.zonesModel.state = value;
    }

    public get searchedCollection(): string[] {
        return this.zonesModel.getSearchedCollection();
    }

    public get selectedIndex(): number {
        return this.zonesModel.getSelectedIndex();
    }

    public set selectedIndex(index: number) {
        this.zonesModel.selectItem(index);
    }

    public get zonesCategory(): string {
        return this.zonesModel.zonesCategory;
    }

    public set zonesCategory(value: string) {
        this.zonesModel.zonesCategory = value;
    }

    ////

    public get zones(): Zone[] {
        return this.zonesModel.zones;
    }

    public get polygons(): Zone[] {
        return this.zonesModel.polygons;
    }

    public get lines(): Zone[] {
        return this.zonesModel.lines;
    }

    public get circles(): Zone[] {
        return this.zonesModel.circles;
    }

    public get objects(): Zone[] {
        return this.zonesModel.objects;
    }

    public get notObjects(): Zone[] {
        return this.zonesModel.notObjects;
    }

    public get mapZones(): Zone[] {
        return this.zonesModel.mapZones;
    }

    public get mapLines(): Zone[] {
        return this.zonesModel.mapLines;
    }

    public get mapCircles(): Zone[] {
        return this.zonesModel.mapCircles;
    }

    public get mapPolygons(): Zone[] {
        return this.zonesModel.mapPolygons;
    }

    public get mapObjects(): Zone[] {
        return this.zonesModel.mapObjects;
    }

    public clean(): void {
        this.zonesModel.clean();
    }   
}

angular.module('iqsZones.ViewModel', ['iqsZones.Data', 'iqsSmartZoom'])
    .service('iqsZonesViewModel', ZonesViewModel);

