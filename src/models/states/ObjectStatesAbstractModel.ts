import {
    IObjectFormatService,
    States
} from '../../common';
import {
    ICurrentObjectStatesDataService,
    IObjectStatesDataService,
    ControlObject,
    DataPage,
    DeviceStatus,
    ObjectCategory,
    ObjectState
} from '../../data';
import {
    IDevicesViewModel,
    IIncidentsViewModel,
    IObjectsViewModel,
    IObjectRoutesViewModel
} from '../../models';
import { UPDATE_MAP_MODEL_CENTER } from '../map/MapModel';
import {
    IMapIconService,
    IObjectConfigsService,
    ISmartZoomService,
    IOrganizationService,
    MapIconTypes,
    SearchResult
} from '../../services';

export class objectStateParams {
    skip: number = 0;
    total: boolean = true;
    size: number = 100;
    type?: string;
}

export class ObjectStatuses {
    public static freezed: string = 'freezed';
    public static lost: string = 'lost';
    public static unknown: string = 'unknown';
    public static active: string = 'active';
    public static incidents: string = 'incidents';
    public static danger: string = 'danger';
    public static unexpected: string = 'unexpected';
    public static offline: string = 'offline';
}

export class DirectionScope {
    public static NorthEast: number = 22.5;
    public static North: number = 67.5;
    public static NorthWest: number = 112.5;
    public static West: number = 157.5;
    public static SouthWest: number = 202.5;
    public static South: number = 247.5;
    public static SouthEast: number = 292.5;
    public static East: number = 337.5;
}

export class ObjectStatesAbstractModel {
    public state: string;
    public allObjectStates: ObjectState[];
    private _allObjectStates: ObjectState[];
    public objectStates: ObjectState[];
    public selectedIndex: number;
    public focused: string;
    public selectedElements: boolean;
    protected updateCenter: boolean = true;
    public date: Date = null;

    public personsActiveCount: number = 0;
    public devicesActiveCount: number = 0;
    public assetsActiveCount: number = 0;

    public personsInactiveCount: number = 0;
    public devicesInactiveCount: number = 0;
    public assetsInactiveCount: number = 0;

    protected showUnknown: boolean = false;

    protected readonly THRESHOLD: number = 15 * 60 * 1000; // 15 min
    protected organizationTimezone: string;
    protected organizationOffset;
    protected localOffset;
    protected filter: string;
    protected filterFunction: Function;
    public filterObjects: any = null; //SearchResult[] = null;
    protected _isSort: boolean;

    protected dataServiceName: string = null;
    protected readFunctionName: string = null;

    protected lastObjectUpdate: number;
    protected lactDeviceUpdate: number;
    protected DEVICE_UPDATE_FREQUENCY = 5 * 60 * 1000; // min
    protected OBJECT_UPDATE_FREQUENCY = 5 * 60 * 1000; // min

    constructor(
        protected $location: ng.ILocationService,
        protected iqsCurrentObjectStatesData: ICurrentObjectStatesDataService,
        protected iqsObjectStatesData: IObjectStatesDataService,
        protected iqsDevicesViewModel: IDevicesViewModel,
        protected iqsObjectsViewModel: IObjectsViewModel,
        protected iqsMapIcon: IMapIconService,
        protected iqsObjectConfigs: IObjectConfigsService,
        protected pipMapHelperSrv: any,
        protected $rootScope: ng.IRootScopeService,
        protected iqsObjectRoutesViewModel: IObjectRoutesViewModel,
        protected iqsIncidentsViewModel: IIncidentsViewModel,
        protected iqsSmartZoom: ISmartZoomService,
        protected pipTranslate: pip.services.ITranslateService,
        protected iqsObjectFormat: IObjectFormatService,
        protected iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        this.dataServiceName = iqsCurrentObjectStatesData === null ? 'iqsObjectStatesData' : 'iqsCurrentObjectStatesData';
        this.readFunctionName = iqsCurrentObjectStatesData === null ? 'readObjectStates' : 'readCurrentObjectStates';
        this.iqsSmartZoom.addLevelChangedCallback((newLevel) => {
            this.updateIcons();
        });
    }

    public cleanUp() {
        this.selectedElements = false;
        this.focused = null;
        this.selectedIndex = -1;
        this.objectStates = [];
        this._allObjectStates = [];
        this.allObjectStates = [];
    }

    public filterWithArrayObjects(objects: SearchResult[], showUnknown?: boolean): void {
        this.filterObjectStates(this.filter);
        this.filterObjects = _.cloneDeep(objects);
        this.showUnknown = !!showUnknown;
        this.filterFunction = this.filterWithArrayObjects;

        this.objectStates = _.filter(this.objectStates, (item: ObjectState) => {
            return _.findIndex(objects, { id: item.object_id }) != -1 ? true : this.showUnknown && !item.object_id;
        });

        this.sortObjectSates();
        this.state = this.objectStates.length > 0 ? States.Data : States.Empty;
    }

    public selectIndex(): void {
        if (this.iqsObjectConfigs.id) {
            this.$location.search('curr_object_id', this.iqsObjectConfigs.id);
        }
        if (this.$location.search()['curr_object_id']) {
            this.selectedIndex = _.findIndex(this.objectStates, { object_id: this.$location.search()['curr_object_id'] });
            if (this.selectedIndex == -1) {
                if (this.objectStates.length > 0) {
                    this.selectedIndex = 0;
                    this.$location.search('curr_object_id', this.objectStates[0].object_id)
                } else {
                    this.selectedIndex = null;
                }
            }
        } else {
            if (this.objectStates.length > 0) {
                this.selectedIndex = 0;
                this.$location.search('curr_object_id', this.objectStates[0].object_id)
            } else {
                this.selectedIndex = null;
            }
        }
        if (this.selectedIndex) {
            this.iqsObjectConfigs.id = this.objectStates[this.selectedIndex].object_id;
        }
    }

    public filterObjectStates(filter: string = 'all'): void {
        this.filter = filter;
        // without not device state
        if (filter == 'all') {
            this.objectStates = _.filter(this._allObjectStates, (state) => {
                return !!state.device;
            });
        } else {
            this.objectStates = _.filter(this._allObjectStates, (item: ObjectState) => {
                if (!item.device) {
                    return false;
                }

                if (filter == 'empty') return !item.object_id;

                return item.object_id;
            });
        }
    }

    protected filterObjectStatesByObjectsName(filter: string): void {
        this.objectStates = [];
        _.each(this._allObjectStates, (item: ObjectState) => {
            item.highlighted = (!item.object_id || !item.object || !filter) ? false : item.object.name.toLocaleLowerCase().includes(filter);
            if (item.highlighted) {
                this.objectStates.push(item);
            }
            this.setIcon(item);
        });
        this.state = this.objectStates.length > 0 ? States.Data : States.Empty;
    }

    public highlightObjectStatesByObjectsName(filter: string): void {
        this.filterObjects = filter ? filter.toLocaleLowerCase() : filter;
        this.filterFunction = this.filterObjectStatesByObjectsName;
        this.unfocusAll();
        this.filterObjectStatesByObjectsName(filter);
    }

    public focusByDeviceId(id: string, updateCenter: boolean = true, alwaysShow: boolean = false, autoFocus: boolean = false, isRetro?: boolean): void {
        this.updateCenter = updateCenter;

        if (this.filterObjects) {
            let index = _.findIndex(this.objectStates, (item: ObjectState) => {
                return item.device_id === id;
            });
            // canceled search
            if (index == -1) {
                this.cancelFiltered();
            }
        }
        _.each(this._allObjectStates, (item: ObjectState) => {
            item.focused = (item.selected || autoFocus) && item.device_id === id
            item.selected = item.device_id === id;
            if (item.device_id && item.device) {
                this.setIcon(item, null, alwaysShow);
            }

            let currentPosition = {
                latitude: item.latitude,
                longitude: item.longitude,
                time: item.time
            };

            if (item.selected) {
                if (item.object_id) {
                    this.iqsObjectRoutesViewModel.focus(item.object_id, currentPosition, this.date, null, isRetro);
                } else {
                    this.iqsObjectRoutesViewModel.unfocus();
                }
                if (this.updateCenter) {
                    this.$rootScope.$broadcast(UPDATE_MAP_MODEL_CENTER, currentPosition);
                }
            }

            if (item.focused) {
                this.focused = item.object_id;
                if (this.updateCenter) {
                    this.$rootScope.$broadcast(UPDATE_MAP_MODEL_CENTER, currentPosition);
                }
            }
        });
    }

    public focusByObjectId(id: string, updateCenter: boolean = true, alwaysShow: boolean = false, autoFocus: boolean = false, isRetro?: boolean): void {
        this.updateCenter = updateCenter;

        if (this.filterObjects) {
            let index = _.findIndex(this.objectStates, (item: ObjectState) => {
                return item.object_id === id;
            });
            // canceled search
            if (index == -1) {
                this.cancelFiltered();
            }
        }
        _.each(this._allObjectStates, (item: ObjectState) => {
            item.focused = (item.selected || autoFocus) && item.object_id === id
            item.selected = item.object_id === id;
            if (item.device_id && item.device) {
                this.setIcon(item, null, alwaysShow);
            }

            let currentPosition = {
                latitude: item.latitude,
                longitude: item.longitude,
                time: item.time
            };

            if (item.selected) {
                if (item.object_id) {
                    this.iqsObjectRoutesViewModel.focus(item.object_id, currentPosition, this.date, null, isRetro);
                } else {
                    this.iqsObjectRoutesViewModel.unfocus();
                }
                if (this.updateCenter) {
                    this.$rootScope.$broadcast(UPDATE_MAP_MODEL_CENTER, currentPosition);
                }
            }

            if (item.focused) {
                this.focused = item.object_id;
                if (this.updateCenter) {
                    this.$rootScope.$broadcast(UPDATE_MAP_MODEL_CENTER, currentPosition);
                }
            }
        });
    }

    public panToObjectByDeviceId(id: string): void {
        let state = this.getObjectStateByDeviceId(id);
        this.unfocusAll(true);
        if (state) {
            this.$rootScope.$broadcast(UPDATE_MAP_MODEL_CENTER, {
                latitude: state.latitude,
                longitude: state.longitude
            });
        }
    }

    public findByDevice(id: string): ObjectState {
        return _.find(this._allObjectStates, { device_id: id });
    }

    public unfocusAll(onlyAutoFocus: boolean = false): void {
        this.focused = null;
        if (!onlyAutoFocus) this.iqsObjectRoutesViewModel.unfocus();

        _.each(this._allObjectStates, (item: ObjectState) => {
            item.selected = onlyAutoFocus ? item.selected : false;
            item.focused = false;

            this.setIcon(item);
        });
    }

    public unselectAll(): void {
        _.each(this._allObjectStates, (item: ObjectState) => {
            item.highlighted = false;
            this.setIcon(item);
        });

        this.selectedElements = false;
    }

    protected filterByDeviceIds(ids: string[]): void {
        let objectStates: ObjectState[] = [];
        _.each(this._allObjectStates, (item: ObjectState) => {
            if (!this.isOnMapByDeviceId(item.device_id)) return;

            item.highlighted = ids.includes(item.device_id);

            if (item.highlighted) {
                objectStates.push(item);
            }
            this.setIcon(item);
        });

        this.objectStates = objectStates;
    }

    public selectByDeviceIds(ids: string[]): void {
        this.filterObjects = ids;
        this.filterFunction = this.filterByDeviceIds;
        this.unfocusAll();
        this.filterByDeviceIds(ids);
        if (this.objectStates.length > 0 && !this.focused) {
            this.selectedElements = true;
            this.panToObjectByDeviceId(this.objectStates[0].device_id);
        }
    }

    protected filterByObjectIds(ids: string[]): void {
        let currentObjectStates: ObjectState[] = []
        _.each(this._allObjectStates, (item: ObjectState) => {
            if (!this.isOnMapByDeviceId(item.device_id)) return;

            item.highlighted = ids.includes(item.object_id);

            if (item.highlighted) {
                currentObjectStates.push(item);
            }
            this.setIcon(item);
        });
        this.objectStates = currentObjectStates;
    }

    public selectByObjectIds(ids: string[]): void {
        this.filterObjects = ids;
        this.filterFunction = this.filterByObjectIds;
        this.unfocusAll()
        this.filterByObjectIds(ids);
        if (this.objectStates.length > 0 && !this.focused) {
            this.selectedElements = true;
            this.panToObjectByDeviceId(this.objectStates[0].device_id);
        }
    }

    protected decreaseByDeviceIds(newData: ObjectState[]): void {
        let indexes = [];

        let i: number;

        for (i = 0; i < this._allObjectStates.length; i++) {
            let index = _.findIndex(
                newData,
                (st: ObjectState) => {
                    return this._allObjectStates[i].device_id === st.device_id;
                }
            );

            if (index < 0) {
                this._allObjectStates.splice(i, 1);
                i--;
            }
        }

        // _.each(this._allObjectStates, (state, i) => {
        //     let index = _.findIndex(
        //         newData,
        //         (st: ObjectState) => {
        //             return state.device_id === st.device_id;
        //         }
        //     );

        //     if (index < 0) {
        //         indexes.push(i);
        //     }
        // });
        // indexes.reverse();

        // _.each(indexes, (index) => {
        //     this._allObjectStates.splice(index, 1);
        // });

        if (this._allObjectStates.length === 0) {
            this.unfocusAll();
            this.unselectAll();
        }
    }

    protected bindToObjectsAndDevices(): void {
        // let notFoundObject: boolean = false;
        // let notFoundDevice: boolean = false;

        _.each(this._allObjectStates, (state: ObjectState) => {
            this.bindToObjectAndDevice(state);
            // if (state.object_id && !state.object) {
            //     notFoundObject = true;
            // }
            // if (state.device_id && !state.device_id) {
            //     notFoundDevice = true;
            // }
            this.convertPositions(state);
            this.setIcon(state);
        });

        // if (notFoundObject) {
        //     this.iqsObjectsViewModel.read((data) => {
        //         _.each(this._allObjectStates, (state) => {
        //             if (state.object_id && !state.object) {
        //                 this.bindToObjectAndDevice(state);

        //             }
        //         });
        //     });
        // }

        // if (notFoundDevice) {
        //     this.iqsDevicesViewModel.read((data) => {
        //         _.each(this._allObjectStates, (state) => {
        //             if (state.device_id && !state.device_id) {
        //                 this.bindToObjectAndDevice(state);
        //             }
        //         });
        //     });
        // }
    }

    protected removeInactive() {
        let ids: string[] = [];
        _.each(this._allObjectStates, (state: ObjectState) => {
            if (state.device && state.device.status == DeviceStatus.Inactive) {
                ids.push(state.id);
            }
        });

        _.each(ids, (id: string) => {
            _.remove(this._allObjectStates, { id: id });
            _.remove(this.objectStates, { id: id });
        });
    }

    protected removeWithoutDevice() {
        let ids: string[] = [];
        _.each(this._allObjectStates, (state: ObjectState) => {

            if (state.device_id && !state.device || !state.device_id) {
                ids.push(state.id);
            }
        });

        _.each(ids, (id: string) => {
            _.remove(this._allObjectStates, { id: id });
            _.remove(this.objectStates, { id: id });
        });
    }

    protected bindToObjectAndDevice(state: ObjectState): void {
        if (state.device_id) {
            state.device = this.iqsDevicesViewModel.getDeviceById(state.device_id);
        }

        if (state.object_id) {
            state.object = this.iqsObjectsViewModel.getObjectById(state.object_id);
        }

        state.id = state.id || state.object_id;

        let assignedObject: ControlObject = state.assign_id ? this.iqsObjectsViewModel.getObjectById(state.assign_id) : null;
        state.assigned_name = assignedObject && assignedObject.name ? assignedObject.name : null;
    }

    protected updateObjectByObjectId(state: ObjectState, newObjectId: string): void {
        if (!state) return;

        if (newObjectId) {
            state.object = this.iqsObjectsViewModel.getObjectById(newObjectId);
        } else {
            state.object = null;
        }
    }

    protected convertPositions(state: ObjectState): void {
        state.latitude = state.pos ? state.pos.coordinates[1] : state.lat ? state.lat : null;
        state.longitude = state.pos ? state.pos.coordinates[0] : state.lng ? state.lng : null;
    }

    protected isSamePosition(pos1: any, pos2: any): boolean {
        return pos1.latitude === pos2.latitude && pos1.longitude === pos2.longitude;
    }

    protected getDirection(state: ObjectState, oldPosition: any): number {
        if ((oldPosition && !this.isSamePosition(oldPosition, state)) || this.isActive(state)) {
            if (state.angle >= DirectionScope.East || state.angle <= DirectionScope.NorthEast) {
                return 0;
            }

            if (state.angle > DirectionScope.NorthEast && state.angle <= DirectionScope.North) {
                return 1;
            }

            if (state.angle > DirectionScope.North && state.angle <= DirectionScope.NorthEast) {
                return 2;
            }

            if (state.angle > DirectionScope.NorthEast && state.angle <= DirectionScope.West) {
                return 3;
            }

            if (state.angle > DirectionScope.West && state.angle <= DirectionScope.SouthWest) {
                return 4;
            }

            if (state.angle > DirectionScope.SouthWest && state.angle <= DirectionScope.South) {
                return 5;
            }

            if (state.angle > DirectionScope.South && state.angle <= DirectionScope.SouthEast) {
                return 6;
            }

            if (state.angle > DirectionScope.SouthEast && state.angle <= DirectionScope.East) {
                return 7;
            }
        }

        return 8;
    }

    protected setIcon(state: ObjectState, oldPosition?: any, alwaysShow: boolean = false): void {
        const type = state.object && MapIconTypes.All.includes(state.object.category) ? state.object.category : 'undefined';
        const name = state.object ? state.object.name : state.device ? state.device.udi : state.device_id;
        state.direction = this.getDirection(state, oldPosition);
        this.setStatus(state);
        this.setLabel(state);

        if (state.status === ObjectStatuses.offline) {
            if (alwaysShow && (state.status != ObjectStatuses.unknown || !state.device)) {
                state.status = ObjectStatuses.lost;
            } else {
                state.options.visible = false;
            }
        }

        // if (alwaysShow == false && (!state.isActive || state.assignee || state.status === ObjectStatuses.unknown)) {
        if (state.assignee) {
            state.options.visible = false;
        }

        if (state.latitude == null || state.longitude == null) {
            state.options.visible = false;
        }

        state.options.zIndex = state.selected ? 1000 : (state.highlighted ? 500 : 100);
        state.icon = this.iqsMapIcon.getIconByAttrs(type, state.direction, state.status, state.highlighted, state.selected, state.focused);
    }

    protected getKoefs(word: string): number {
        return word.length > 30 ? 2.5 : word.length > 5 ? 2.2 : 5;
    }

    protected getClass(word: string): string {
        return word.length > 30 ? 'long' : word.length > 5 ? 'medium' : 'short';
    }

    protected getAnchor(word: string): number {
        return word.length > 30 ? 80 : word.length > 5 ? 48 : 16;
    }

    protected setLabel(state: ObjectState): void {
        let labelContent = this.getLabel(state);
        let labelDescription = this.getDescription(state);

        labelContent = labelContent.replace(/\s+/g, ' ');
        labelDescription = labelDescription.replace(/\s+/g, ' ');

        let maxLength = labelContent.length > labelDescription.length ? labelContent : labelDescription;
        state.options = this.iqsSmartZoom.zoomLevel === this.iqsSmartZoom.smartZoomLevels.large.name ? {
            labelContent: labelContent + '\n' + labelDescription,
            labelAnchor: this.getAnchor(maxLength) + (state.selected ? ' -25' : ' -20'),
            labelClass: 'unselected-marker-label' + ' ' + this.getClass(maxLength)
        } : {};
    }

    protected getDescription(state: ObjectState): string {
        return state.object ? this.shortLabel(this.iqsObjectFormat.formatSubtitle(state.object)) : '';
    }

    protected getLabel(state: ObjectState): string {
        return state.object ? this.shortLabel(state.object.name) :
            (state.device ? (state.device.label ? this.shortLabel(state.device.label) : this.shortLabel(state.device.udi)) : '?');
    }

    protected shortLabel(label: string): string {
        return label.length > 35 ? label.substr(0, 35) + '...' : label;
    }

    protected updateIcons(): void {
        _.each(this._allObjectStates, (state) => {
            this.setIcon(state);
        });
    }

    protected setStatus(state: ObjectState): void {
        if (!state) return;
        state.isActive = !state.time ? false : state.online && Math.abs(this.date.getTime() - moment(state.time).valueOf()) < this.getOfflineTimeout();

        // object not found
        if (!state.object) {
            state.status = ObjectStatuses.unknown;

            return;
        }

        if (state.isActive && !state.expected) {
            state.status = ObjectStatuses.unexpected;

            return;
        }

        // show offline unexpected object during 
        if (!state.expected) {
            // state.status = this.isOffline(state) ? 
            state.status = this.isOffline(state) ? ObjectStatuses.offline : ObjectStatuses.lost;

            return;
        }

        // expected by rosters
        if (!state.isActive && state.expected) {
            state.status = ObjectStatuses.lost;
            // state.status = ObjectStatuses.offline;

            return;
        }

        // active objects with incident
        if (this.iqsIncidentsViewModel.getIncidentCount(state.object_id) > 0) {
            state.status = ObjectStatuses.incidents;

            return;
        }

        // active freezed object
        if (state.freezed > 0) {
            state.status = ObjectStatuses.freezed;

            return;
        }

        // active freezed object
        if (state.immobile > 0) {
            state.status = ObjectStatuses.freezed;

            return;
        }

        // active object
        state.status = ObjectStatuses.active;
    }

    public get isSort(): boolean {
        return this._isSort;
    }

    public set isSort(value: boolean) {
        this._isSort = !!value;
    }

    public isActive(state): boolean {
        return state.isActive;
    }

    protected getOfflineTimeout(): number {
        return this.iqsOrganization.organization && this.iqsOrganization.organization.offline_timeout ? this.iqsOrganization.organization.offline_timeout * 1000 : 1000 * 60 * 15;
    }

    protected isOffline(state: ObjectState): boolean {

        return Math.abs(this.date.getTime() - moment(state.time).valueOf()) > 1000 * 60 * 60 * 24;
    }

    public isInCurrentRosters(state: ObjectState): boolean {
        return state.expected;
        // return state.object_id ? this.currentRostersObjectIds.includes(state.object_id) : false;
    }

    public isOnMapByDeviceId(device_id: string): boolean {
        const state = this.getObjectStateByDeviceId(device_id);

        if (!state) return false;

        if (state.status === ObjectStatuses.offline) return false;

        return true;
    }

    public isOnMapByObjectId(object_id: string): boolean {
        const state = this.getObjectStateByObjectId(object_id);

        if (!state) return false;

        if (state.status === ObjectStatuses.offline) return false;

        return true;
    }

    protected sortObjectSates(): void {
        if (!this._isSort) return;

        this.objectStates = _.sortBy(this.objectStates, (item: ObjectState) => {
            let name = item.object && item.object.name ? item.object.name.toLocaleLowerCase() : '';
            name = this.isActive(item) ? '0' + name : '1' + name;
            return name;
        });
    }

    public cancelFiltered(): void {
        this.filterObjects = null;
        this.filterFunction = null;
        this.unfocusAll();
        this.unselectAll();
        this.filterObjectStates(this.filter);
        this.sortObjectSates();
    }

    protected getObjectStatesCallback(data: DataPage<ObjectState>, filter?: string, successCallback?: (data: ObjectState[]) => void) {
        this._allObjectStates = data && data.data ? data.data : [];
        this.bindToObjectsAndDevices();
        this.removeWithoutDevice();
        this.filterObjectStates(filter);
        this.setObjectsCounts();
        this.sortObjectSates();
        this.state = this.objectStates.length > 0 ? States.Data : States.Empty;
        this.selectIndex();

        this.allObjectStates = this._allObjectStates;
        if (successCallback) successCallback(this._allObjectStates);
    }

    public getObjectStateByObjectId(id: string): ObjectState {
        let current = _.find(this._allObjectStates, { object_id: id });
        return current;
    }

    public getObjectStateByDeviceId(id: string): ObjectState {
        let current = _.find(this._allObjectStates, { device_id: id });

        return current;
    }

    public setObjectsCounts(): void {
        this.personsActiveCount = 0;
        this.devicesActiveCount = 0;
        this.assetsActiveCount = 0;
        this.personsInactiveCount = 0;
        this.devicesInactiveCount = 0;
        this.assetsInactiveCount = 0;

        // calculate presents
        _.each(this._allObjectStates, (state) => {
            let index: number;
            if (state.object) {
                
                switch (state.object.category) {
                    case ObjectCategory.People: {
                        if (this.isActive(state)) {
                            this.personsActiveCount++;
                            // } else if (index != -1) {
                        } else if (state.expected) {
                            this.personsInactiveCount++;
                        }
                        break;
                    }
                    case ObjectCategory.Equipment: {
                        if (this.isActive(state)) {
                            this.devicesActiveCount++;
                            // } else if (index != -1) {
                        } else if (state.expected) {
                            this.devicesInactiveCount++;
                        }
                        break;
                    }
                    case ObjectCategory.Asset: {
                        if (this.isActive(state)) {
                            this.assetsActiveCount++;
                            // } else if (index != -1) {
                        } else if (state.expected) {
                            this.assetsInactiveCount++;
                        }
                        break;
                    }
                }
            }
        });
    }

    public getActiveByCategory(category: string): number {
        switch (category) {
            case ObjectCategory.People: {
                return this.personsActiveCount;
            }
            case ObjectCategory.Equipment: {
                return this.devicesActiveCount;
            }
            case ObjectCategory.Asset: {
                return this.assetsActiveCount;
            }
        }
    }

    public getInactiveByCategory(category: string): number {
        switch (category) {
            case ObjectCategory.People: {
                return this.personsInactiveCount;
            }
            case ObjectCategory.Equipment: {
                return this.devicesInactiveCount;
            }
            case ObjectCategory.Asset: {
                return this.assetsInactiveCount;
            }
        }
    }

}