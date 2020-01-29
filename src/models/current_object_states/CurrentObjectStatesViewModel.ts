import { ICurrentObjectStatesViewModel } from './ICurrentObjectStatesViewModel';
import { CurrentObjectStatesModel } from './CurrentObjectStatesModel';
import { IObjectFormatService } from '../../common';
import {
    ICurrentObjectStatesDataService,
    ObjectState
} from '../../data';
import {
    IDevicesViewModel,
    IIncidentsViewModel,
    IObjectsViewModel,
    IObjectRoutesViewModel
} from '../../models';
import {
    IMapIconService,
    IObjectConfigsService,
    IOrganizationService,
    ISmartZoomService,
    SearchResult
} from '../../services';

class CurrentObjectStatesViewModel implements ICurrentObjectStatesViewModel {
    public model: CurrentObjectStatesModel;

    constructor(
        $location: ng.ILocationService,
        iqsCurrentObjectStatesData: ICurrentObjectStatesDataService,
        iqsDevicesViewModel: IDevicesViewModel,
        iqsObjectsViewModel: IObjectsViewModel,
        iqsMapIcon: IMapIconService,
        iqsObjectConfigs: IObjectConfigsService,
        pipMapHelperSrv: any,
        $rootScope: ng.IRootScopeService,
        // iqsObjectPositionsViewModel: IObjectPositionsViewModel,
        iqsObjectRoutesViewModel: IObjectRoutesViewModel,
        iqsIncidentsViewModel: IIncidentsViewModel,
        iqsSmartZoom: ISmartZoomService,
        pipTranslate: pip.services.ITranslateService,
        // iqsRostersViewModel: IRostersViewModel,
        iqsObjectFormat: IObjectFormatService,
        iqsOrganization: IOrganizationService
    ) {
        this.model = new CurrentObjectStatesModel(
            $location,
            iqsCurrentObjectStatesData,
            iqsDevicesViewModel,
            iqsObjectsViewModel,
            iqsMapIcon,
            iqsObjectConfigs,
            pipMapHelperSrv,
            $rootScope,
            // iqsObjectPositionsViewModel,
            iqsObjectRoutesViewModel,
            iqsIncidentsViewModel,
            iqsSmartZoom,
            pipTranslate,
            // iqsRostersViewModel,
            iqsObjectFormat,
            iqsOrganization
        );
    }

    public initCurrentObjectStates(filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void) {
        this.model.getObjectStates(filter || 'all', successCallback, errorCallback);
    }

    public filterCurrentObjectStates(filter: string = 'all',
        callback?: Function, errorcallback?: Function) {
        this.model.filterObjectStates(filter);
    }

    public readOne(id: string, successCallback?: (data: ObjectState) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.model.readOne(id, successCallback, errorCallback);
    }

    public filterCurrentObjectStatesObjectsSearch(objects: SearchResult[], showUnknown?: boolean) {
        this.model.filterWithArrayObjects(objects, showUnknown);
    }

    public cancelFiltered(): void {
        this.model.cancelFiltered();
    }

    public highlightCurrentObjectStatesByObjectsName(filter: string) {
        this.model.highlightObjectStatesByObjectsName(filter);
    }

    public focusByDeviceId(id: string, updateCenter: boolean = true, alwaysShow: boolean = false, isRetro?: boolean) {
        this.model.focusByDeviceId(id, updateCenter, alwaysShow, isRetro);
    }

    public focusByObjectId(id: string, updateCenter: boolean = true, alwaysShow: boolean = false, isRetro?: boolean) {
        this.model.focusByObjectId(id, updateCenter, alwaysShow, isRetro);
    }

    public unfocusAll(onlyAutoFocus: boolean = false) {
        this.model.unfocusAll(onlyAutoFocus);
    }

    public unselectAll() {
        this.model.unselectAll();
    }

    public get isSort(): boolean {
        return this.model.isSort;
    }

    public set isSort(value: boolean) {
        this.model.isSort = !!value;
    }

    public selectByDeviceIds(ids: string[]) {
        this.model.selectByDeviceIds(ids);
    }

    public selectByObjectIds(ids: string[]) {
        this.model.selectByObjectIds(ids);
    }

    public get isFocused(): string {
        return this.model.focused;
    }

    public get isSelected(): boolean {
        return this.model.selectedElements;
    }

    public get CurrentObjectStates() {
        return this.model.objectStates;
    }

    public get allCurrentObjectStates() {
        return this.model.allObjectStates;
    }

    public get state(): string {
        return this.model.state;
    }

    public set state(state: string) {
        this.model.state = state;
    }

    public get selectedIndex(): number {
        return this.model.selectedIndex;
    }

    public set selectedIndex(index: number) {
        this.model.selectedIndex = index;
    }

    public selectIndex() {
        this.model.selectIndex();
    }

    public updateCurrentObjectStates() {
        this.model.updateObjectStates();
    }

    public findByDevice(id: string) {
        return this.model.findByDevice(id);
    }

    public isActive(state) {
        return this.model.isActive(state);
    }

    public isInCurrentRosters(state) {
        return this.model.isInCurrentRosters(state);
    }

    // public reReadRosters(): void {
    //     return this.model.reReadRosters();
    // }

    public isOnMapByDeviceId(device_id): boolean {
        return this.model.isOnMapByDeviceId(device_id);
    }

    public statusObject(object: ObjectState): string {
        if (object.emergency > 0) return 'MAP_STATUS_OBJECT_DANGER'; // 'в опасности';
        if (object.freezed > 0) return 'MAP_STATUS_OBJECT_FREEZED'; //'полностью неподвижный';
        if (object.immobile > 0) return 'MAP_STATUS_OBJECT_IMMOBILITY'; //'неподвижный';

        return 'MAP_STATUS_OBJECT_ONLINE';//'на связи';
    }

    public getCurrentObjectStateByObjectId(id: string): ObjectState {
        return this.model.getObjectStateByObjectId(id);
    }

    public getCurrentObjectStateByDeviceId(id: string): ObjectState {
        return this.model.getObjectStateByDeviceId(id);
    }

    public getActiveByCategory(category) {
        return this.model.getActiveByCategory(category);
    }

    public getInactiveByCategory(category) {
        return this.model.getInactiveByCategory(category);
    }

    public clean(): void {
        this.model.cleanUp();
    }
}

angular.module('iqsCurrentObjectStates.ViewModel', [
    'iqsCurrentObjectStates.Data',
    'iqsDevices.ViewModel',
    'iqsObjects.ViewModel',
    'iqsObjectRoutes.ViewModel',
    'iqsIncidents.ViewModel',
    'iqsMapIcon'
])
    .service('iqsCurrentObjectStatesViewModel', CurrentObjectStatesViewModel);