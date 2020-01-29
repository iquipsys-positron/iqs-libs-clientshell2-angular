import { ObjectStatesModel } from './ObjectStatesModel';
import { IObjectStatesViewModel } from './IObjectStatesViewModel';

import { IObjectFormatService } from '../../common';
import {
    IObjectStatesDataService,
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


class ObjectStatesViewModel implements IObjectStatesViewModel {
    public model: ObjectStatesModel;

    constructor(
        $location: ng.ILocationService,
        iqsObjectStatesData: IObjectStatesDataService,
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
        this.model = new ObjectStatesModel(
            $location,
            iqsObjectStatesData,
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

    public initObjectStates(to: string, filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void) {
        this.model.getObjectStates(to, filter || 'all', successCallback, errorCallback);
    }

    public filterObjectStates(filter: string = 'all',
        callback?: Function, errorcallback?: Function) {
        this.model.filterObjectStates(filter);
    }

    // public filterObjectStatesObjects(filter: string) {
    //     this.model.filterWithObjects(filter);
    // }

    public filterObjectStatesObjectsSearch(objects: SearchResult[], showUnknown?: boolean) {
        this.model.filterWithArrayObjects(objects, showUnknown);
    }

    public highlightObjectStatesByObjectsName(filter: string) {
        this.model.highlightObjectStatesByObjectsName(filter);
    }

    public focusByDeviceId(id: string, updateCenter: boolean = true, alwaysShow: boolean = false, isRetro?: boolean) {
        this.model.focusByDeviceId(id, updateCenter, alwaysShow);
    }

    public focusByObjectId(id: string, updateCenter: boolean = true, alwaysShow: boolean = false, isRetro?: boolean) {
        this.model.focusByObjectId(id, updateCenter, alwaysShow);
    }

    public unfocusAll() {
        this.model.unfocusAll();
    }

    public cancelFiltered(): void {
        this.model.cancelFiltered();
    }

    public unselectAll() {
        this.model.unselectAll();
    }

    public selectByDeviceIds(ids: string[]) {
        this.model.selectByDeviceIds(ids);
    }

    public selectByObjectIds(ids: string[]) {
        this.model.selectByObjectIds(ids);
    }

    public get isSort(): boolean {
        return this.model.isSort;
    }

    public set isSort(value: boolean) {
        this.model.isSort = !!value;
    }

    public get isFocused(): string {
        return this.model.focused;
    }

    public get isSelected(): boolean {
        return this.model.selectedElements;
    }

    public get ObjectStates() {
        return this.model.objectStates;
    }

    public get allObjectStates() {
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

    public updateObjectStates(to: string) {
        this.model.updateObjectStates(to);
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

    public isOnMapByDeviceId(device_id): boolean {
        return this.model.isOnMapByDeviceId(device_id);
    }

    public statusObject(object: ObjectState): string {
        if (object.emergency > 0) return 'MAP_STATUS_OBJECT_DANGER'; // 'в опасности';
        if (object.freezed > 0) return 'MAP_STATUS_OBJECT_FREEZED'; //'полностью неподвижный';
        if (object.immobile > 0) return 'MAP_STATUS_OBJECT_IMMOBILITY'; //'неподвижный';

        return 'MAP_STATUS_OBJECT_ONLINE';//'на связи';
    }

    public getObjectStateByObjectId(id: string): ObjectState {
        return this.model.getObjectStateByObjectId(id);
    }

    public getObjectStateByDeviceId(id: string): ObjectState {
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

angular.module('iqsObjectStates.ViewModel', [
    'iqsObjectStates.Data',
    'iqsDevices.ViewModel',
    'iqsObjects.ViewModel',
    'iqsObjectRoutes.ViewModel',
    'iqsIncidents.ViewModel',
    'iqsObjectConfigs',
    'iqsSmartZoom',
    'iqsFormats.Object',
    'iqsOrganizations.Service'
])
    .service('iqsObjectStatesViewModel', ObjectStatesViewModel);