import { IMapViewModel } from './IMapViewModel';
import { MapModel } from './MapModel';
import {
    ICurrentObjectStatesViewModel,
    IObjectsViewModel,
    IZonesViewModel
} from '../../models';
import { IMapService } from '../../services';

class MapViewModel implements IMapViewModel {
    public map: MapModel;
    public _filterStates: boolean = false;

    constructor(
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsCurrentObjectStatesViewModel: ICurrentObjectStatesViewModel,
        private $state: angular.ui.IStateService,
        private iqsMapConfig: IMapService,
        private iqsZonesViewModel: IZonesViewModel,
        $rootScope: ng.IRootScopeService,
        $timeout: ng.ITimeoutService
    ) {
        this.map = new MapModel(iqsMapConfig, $rootScope, $timeout);
    }

    public initMap(successCallback?: () => void, errorCallback?: (error: any) => void) {
        this.map.init(successCallback, errorCallback);
    }

    public initObjects() {
        this.iqsObjectsViewModel.initObjects();
    }

    public initStates() {
        this.iqsCurrentObjectStatesViewModel.initCurrentObjectStates();
    }

    public updateObjectsStates() {
        this.iqsCurrentObjectStatesViewModel.updateCurrentObjectStates();
    }

    public setCenter(center) {
        this.map.setCenter(center);
    }

    public zoomIn() {
        this.map.zoomIn();
    }

    public zoomOut() {
        this.map.zoomOut();
    }

    public setZoom(zoom) {
        this.map.setZoom(zoom);
    }

    public get polylinesOptions(): any {
        return this.iqsMapConfig.polylineOptions;
    }

    public get objects(): any {
        return this.iqsObjectsViewModel.objects;
    }

    public get states() {
        return this.iqsCurrentObjectStatesViewModel.allCurrentObjectStates;
    }

    public get filteredStates() {
        return this.iqsCurrentObjectStatesViewModel.CurrentObjectStates;
    }

    public get polygons() {
        return this.iqsZonesViewModel.mapPolygons;
    }

    public get lines() {
        return this.iqsZonesViewModel.mapLines;
    }

    public get circles() {
        return this.iqsZonesViewModel.mapCircles;
    }

    public get isFocused(): string {
        return this.iqsCurrentObjectStatesViewModel.isFocused;
    }

    public get isSelected(): boolean {
        return this.iqsCurrentObjectStatesViewModel.isSelected;
    }

    public get organizationCenter(): any {
        return this.map.organizationCenter;
    }

    public highlightStatesByName(filter: string) {
        this.iqsCurrentObjectStatesViewModel.highlightCurrentObjectStatesByObjectsName(filter);
    }

    public focusByDeviceId(id: string) {
        this.iqsCurrentObjectStatesViewModel.focusByDeviceId(id);
    }

    public selectByDeviceIds(ids: string[]) {
        this.iqsCurrentObjectStatesViewModel.selectByDeviceIds(ids);
    }

    public selectByObjectIds(ids: string[]) {
        this.iqsCurrentObjectStatesViewModel.selectByObjectIds(ids);
    }

    public unfocusAll() {
        this.iqsCurrentObjectStatesViewModel.unfocusAll(true);
    }

    public unselectAll() {
        this.iqsCurrentObjectStatesViewModel.unselectAll();
    }

    public getActive(type: string): number {
        return this.iqsCurrentObjectStatesViewModel.getActiveByCategory(type);
    }

    public getInactive(type: string): number {
        return this.iqsCurrentObjectStatesViewModel.getInactiveByCategory(type);
    }

    public isActive(state) {
        return this.iqsCurrentObjectStatesViewModel.isActive(state);
    }

    public getCurrentObjectStateByDeviceId(id: string) {
        return this.iqsCurrentObjectStatesViewModel.getCurrentObjectStateByDeviceId(id);
    }
}

angular.module('iqsMap.ViewModel', ['iqsZones.ViewModel'])
    .service('iqsMapViewModel', MapViewModel);

