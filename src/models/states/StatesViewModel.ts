import './ObjectStatesAbstractModel';
import { IStatesViewModel } from './IStatesViewModel';
import { IObjectFormatService } from '../../common';
import {
    ICurrentObjectStatesDataService,
    IObjectStatesDataService,
    ObjectState
} from '../../data';
import {
    IDevicesViewModel,
    IIncidentsViewModel,
    IObjectRoutesViewModel,
    IObjectsViewModel,
    ObjectStatesModel
} from '../../models';
import { CurrentObjectStatesModel } from '../current_object_states/CurrentObjectStatesModel';
import {
    IMapIconService,
    IObjectConfigsService,
    ISmartZoomService,
    IOrganizationService,
    SearchResult
} from '../../services';

class StatesViewModel implements IStatesViewModel {
    public type: string = 'monitoring';
    public currentStates: CurrentObjectStatesModel;
    public timelineStates: ObjectStatesModel;

    constructor(
        $location: ng.ILocationService,
        iqsCurrentObjectStatesData: ICurrentObjectStatesDataService,
        iqsObjectStatesData: IObjectStatesDataService,

        iqsDevicesViewModel: IDevicesViewModel,
        iqsObjectsViewModel: IObjectsViewModel,
        iqsMapIcon: IMapIconService,
        iqsObjectConfigs: IObjectConfigsService,
        pipMapHelperSrv: any,
        $rootScope: ng.IRootScopeService,
        iqsObjectRoutesViewModel: IObjectRoutesViewModel,
        iqsIncidentsViewModel: IIncidentsViewModel,
        iqsSmartZoom: ISmartZoomService,
        pipTranslate: pip.services.ITranslateService,
        iqsObjectFormat: IObjectFormatService,
        iqsOrganization: IOrganizationService
    ) {
        this.currentStates = new CurrentObjectStatesModel(
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

        this.timelineStates = new ObjectStatesModel(
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

    public initStates(to: string, filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void) {
        if (this.type == 'monitoring') {
            this.currentStates.getObjectStates(filter || 'all', successCallback, errorCallback);
        } else {
            this.timelineStates.getObjectStates(to, filter || 'all', successCallback, errorCallback);
        }
    }

    public cleanUpAllStates() {
        this.currentStates.cleanUp();
        this.timelineStates.cleanUp();
    }

    public filterStates(filter: string = 'all', callback?: Function, errorcallback?: Function) {
        if (this.type == 'monitoring') {
            this.currentStates.filterObjectStates(filter);
        } else {
            this.timelineStates.filterObjectStates(filter);
        }
    }

    // public filterStatesObjects(filter: string) {
    //     if (this.type == 'monitoring') {
    //         this.currentStates.filterWithObjects(filter);
    //     } else {
    //         this.timelineStates.filterWithObjects(filter);
    //     }
    // }

    public filterStatesObjectsSearch(objects: SearchResult[], showUnknown?: boolean) {
        if (this.type == 'monitoring') {
            this.currentStates.filterWithArrayObjects(objects, showUnknown);
        }
        else {
            this.timelineStates.filterWithArrayObjects(objects, showUnknown);
        }
    }

    public cancelFiltered(): void {
        if (this.type == 'monitoring') {
            this.currentStates.cancelFiltered();
        }
        else {
            this.timelineStates.cancelFiltered();
        }
    }

    // public reReadRosters(): void {
    //     if (this.type == 'monitoring') {
    //         this.currentStates.reReadRosters();
    //     }
    // }

    public highlightStatesByObjectsName(filter: string) {
        if (this.type == 'monitoring') {
            this.currentStates.highlightObjectStatesByObjectsName(filter);
        }
        else {
            this.timelineStates.highlightObjectStatesByObjectsName(filter);
        }
    }

    public focusByDeviceId(id: string, updateCenter: boolean = true, alwaysShow: boolean = false, autoFocus: boolean = false, isRetro?: boolean) {
        if (this.type == 'monitoring') {
            this.currentStates.focusByDeviceId(id, updateCenter, alwaysShow, autoFocus, false);
        } else {
            this.timelineStates.focusByDeviceId(id, updateCenter, alwaysShow, autoFocus, true);
        }
    }

    public focusByObjectId(id: string, updateCenter: boolean = true, alwaysShow: boolean = false, autoFocus: boolean = false, isRetro?: boolean) {
        if (this.type == 'monitoring') {
            this.currentStates.focusByObjectId(id, updateCenter, alwaysShow, autoFocus, false);
        } else {
            this.timelineStates.focusByObjectId(id, updateCenter, alwaysShow, autoFocus, true);
        }
    }

    public unfocusAll(onlyAutoFocus?: boolean) {
        if (this.type == 'monitoring') {
            this.currentStates.unfocusAll(onlyAutoFocus);
        } else {
            this.timelineStates.unfocusAll(onlyAutoFocus);
        }
    }

    public panToObjectByDeviceId(id: string) {
        if (this.type == 'monitoring') {
            this.currentStates.panToObjectByDeviceId(id);
        } else {
            this.timelineStates.panToObjectByDeviceId(id);
        }
    }

    public getToTime() {
        if (this.type == 'monitoring') {
            return this.currentStates.date ? this.currentStates.date : new Date();
        } else {
            return this.timelineStates.date ? this.timelineStates.date : new Date();
        }
    }

    public unselectAll() {
        if (this.type == 'monitoring') {
            this.currentStates.unselectAll();
        } else {
            this.timelineStates.unselectAll();
        }
    }

    public selectByDeviceIds(ids: string[]) {
        if (this.type == 'monitoring') {
            this.currentStates.selectByDeviceIds(ids);
        } else {
            this.timelineStates.selectByDeviceIds(ids);
        }
    }

    public selectByObjectIds(ids: string[]) {
        if (this.type == 'monitoring') {
            this.currentStates.selectByObjectIds(ids);
        }
        else { this.timelineStates.selectByObjectIds(ids); }
    }

    public get isFocused(): string {

        return this.type == 'monitoring' ? this.currentStates.focused : this.timelineStates.focused;
    }

    public get isSelected(): boolean {
        return this.type == 'monitoring' ? this.currentStates.selectedElements : this.timelineStates.selectedElements;
    }

    public get states() {
        return this.type == 'monitoring' ? this.currentStates.objectStates : this.timelineStates.objectStates;
    }

    public get allStates() {
        return this.type == 'monitoring' ? this.currentStates.allObjectStates : this.timelineStates.allObjectStates;
    }

    public set allStates(states) {
        this.type == 'monitoring' ? this.currentStates.allObjectStates = states : this.timelineStates.allObjectStates = states;
    }

    public get isSort(): boolean {
        return this.type == 'monitoring' ? this.currentStates.isSort : this.timelineStates.isSort;
    }

    public set isSort(value: boolean) {
        if (this.type == 'monitoring') {
            this.currentStates.isSort = value;
        } else {
            this.timelineStates.isSort = value;
        }
    }

    public get state(): string {
        return this.type == 'monitoring' ? this.currentStates.state : this.timelineStates.state;
    }

    public set state(state: string) {
        this.type == 'monitoring' ? this.currentStates.state = state : this.timelineStates.state = state;
    }

    public get selectedIndex(): number {
        return this.type == 'monitoring' ? this.currentStates.selectedIndex : this.timelineStates.selectedIndex;
    }

    public set selectedIndex(index: number) {
        this.type == 'monitoring' ? this.currentStates.selectedIndex = index : this.timelineStates.selectedIndex = index;
    }

    public selectIndex() {
        this.type == 'monitoring' ? this.currentStates.selectIndex() : this.timelineStates.selectIndex();
    }

    public updateStates(to?: string, callback?: Function) {
        if (this.type == 'monitoring') {
            this.currentStates.date = new Date(Date.now());
            this.currentStates.updateObjectStates(callback)
        } else {
            this.timelineStates.updateObjectStates(to, callback);
        }
    }

    public findByDevice(id: string) {
        return this.type == 'monitoring' ? this.currentStates.findByDevice(id) : this.timelineStates.findByDevice(id);
    }

    public isActive(state): boolean {
        return this.type == 'monitoring' ? this.currentStates.isActive(state) : this.timelineStates.isActive(state);
    }

    public isInCurrentRosters(state) {
        return this.type == 'monitoring' ? this.currentStates.isInCurrentRosters(state) : this.timelineStates.isInCurrentRosters(state);
    }

    public isOnMapByDeviceId(device_id: string): boolean {
        return this.type == 'monitoring' ? this.currentStates.isOnMapByDeviceId(device_id) : this.timelineStates.isOnMapByDeviceId(device_id);
    }

    public isOnMapByObjectId(object_id: string): boolean {
        return this.type == 'monitoring' ? this.currentStates.isOnMapByObjectId(object_id) : this.timelineStates.isOnMapByObjectId(object_id);
    }

    public statusObject(object: ObjectState): string {
        if (object.emergency > 0) return 'MAP_STATUS_OBJECT_DANGER'; // 'в опасности';
        if (object.freezed > 0) return 'MAP_STATUS_OBJECT_FREEZED'; //'полностью неподвижный';
        if (object.immobile > 0) return 'MAP_STATUS_OBJECT_IMMOBILITY'; //'неподвижный';

        return 'MAP_STATUS_OBJECT_ONLINE';//'на связи';
    }

    public getStateByObjectId(id: string): ObjectState {
        return this.type == 'monitoring' ? this.currentStates.getObjectStateByObjectId(id) : this.timelineStates.getObjectStateByObjectId(id);
    }

    public getStateByDeviceId(id: string): ObjectState {
        return this.type == 'monitoring' ? this.currentStates.getObjectStateByDeviceId(id) : this.timelineStates.getObjectStateByDeviceId(id);
    }

    public getActiveByCategory(category) {
        return this.type == 'monitoring' ? this.currentStates.getActiveByCategory(category) : this.timelineStates.getActiveByCategory(category);
    }

    public getInactiveByCategory(category) {
        return this.type == 'monitoring' ? this.currentStates.getInactiveByCategory(category) : this.timelineStates.getInactiveByCategory(category);
    }

    public clean(): void {
        this.type == 'monitoring' ? this.currentStates.cleanUp() : this.timelineStates.cleanUp();
    }
}

angular.module('iqsStates.ViewModel', [
    'iqsCurrentObjectStates.Data',
    'iqsObjectStates.Data',
    'iqsDevices.ViewModel',
    'iqsObjects.ViewModel',
    'iqsObjectRoutes.ViewModel',
    'iqsCurrentObjectStates.ViewModel',
    'iqsIncidents.ViewModel'
])
    .service('iqsStatesViewModel', StatesViewModel);