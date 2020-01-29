import '../states/ObjectStatesAbstractModel';
import { ObjectStatesAbstractModel } from '../states/ObjectStatesAbstractModel';

import {
    IObjectStatesDataService,
    DataPage,
    ObjectState
} from '../../data';
import {
    IObjectFormatService,
    States
} from '../../common';
import {
    IDevicesViewModel,
    IIncidentsViewModel,
    IObjectsViewModel,
    IObjectRoutesViewModel,
    objectStateParams,
    ObjectStatuses,
    UPDATE_MAP_MODEL_CENTER
} from '../../models';
import {
    IMapIconService,
    IObjectConfigsService,
    IOrganizationService,
    ISmartZoomService
} from '../../services';

export class ObjectStatesModel extends ObjectStatesAbstractModel {
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
        "ngInject";
        super($location, null, iqsObjectStatesData, iqsDevicesViewModel, iqsObjectsViewModel, iqsMapIcon, iqsObjectConfigs, pipMapHelperSrv, $rootScope, iqsObjectRoutesViewModel, iqsIncidentsViewModel, iqsSmartZoom, pipTranslate, iqsObjectFormat, iqsOrganization);
    }

    public getObjectStates(to: string, filter: string = 'all', successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void) {
        this.state = States.Progress;
        let params: objectStateParams = new objectStateParams();
        this.date = new Date(Date.parse(to));
        this.iqsObjectsViewModel.initObjects('all', (objects) => {
            this.iqsObjectStatesData.readObjectStates(to, (data: DataPage<ObjectState>) => {
                this.getObjectStatesCallback(data, filter, successCallback);
            }, errorCallback);
        })
    }

    public updateObjectStates(to: string, callback?: Function) {
        let refilter: boolean = false;
        let isUpdateObjects: boolean = false;
        let isUpdateDevices: boolean = false;
        let nowDate = new Date().getTime();

        this.date = new Date(Date.parse(to));
         this.iqsObjectStatesData.readObjectStates(to, (data: DataPage<ObjectState>) => {
            this.decreaseByDeviceIds(data.data);
            _.map(data.data, (item) => {
                if (!item.id) {
                    item.id = item.device_id;
                }
            });

            _.each(data.data, (newState) => {
                let oldPosition = {};
                let index = _.findIndex(this.allObjectStates, (state) => { return state.device_id === newState.device_id && state.device_id !== null; });
                if (index > -1) {
                    oldPosition = {
                        latitude: _.clone(this.allObjectStates[index].latitude),
                        longitude: _.clone(this.allObjectStates[index].longitude)
                    };
                    if (newState.object_id !== this.allObjectStates[index].object_id) {
                        refilter = true;
                        this.updateObjectByObjectId(this.allObjectStates[index], newState.object_id);
                    }
                    this.allObjectStates[index] = _.defaults(newState, this.allObjectStates[index]);
                    this.convertPositions(this.allObjectStates[index]);
                    this.setIcon(this.allObjectStates[index], oldPosition, this.allObjectStates[index].selected || this.allObjectStates[index].focused);
                    let currentPosition = {
                        latitude: this.allObjectStates[index].latitude,
                        longitude: this.allObjectStates[index].longitude
                    };

                    if (this.allObjectStates[index].selected) {
                        if (this.allObjectStates[index].object_id) {
                            this.iqsObjectRoutesViewModel.updateCurrentObjectPositions(currentPosition, this.date, this.allObjectStates[index], true);
                        }
                    }

                    if (this.allObjectStates[index].focused) {
                        if (this.updateCenter) this.$rootScope.$broadcast(UPDATE_MAP_MODEL_CENTER, currentPosition);
                    }
                } else {
                    refilter = true;
                    this.bindToObjectAndDevice(newState);
                    // filter unknown device
                    if (newState.device) {
                        this.allObjectStates.push(newState);
                        this.convertPositions(newState);
                        this.setIcon(newState);
                    }
                }

                index = _.findIndex(this.objectStates, (state) => { return state.id === newState.id; });
                if (index > -1) {
                    oldPosition = {
                        latitude: _.clone(this.objectStates[index].latitude),
                        longitude: _.clone(this.objectStates[index].longitude)
                    };
                    this.objectStates[index] = _.defaults(newState, this.objectStates[index]);
                    this.convertPositions(this.objectStates[index]);
                    this.setIcon(this.objectStates[index], oldPosition, this.allObjectStates[index].selected || this.allObjectStates[index].focused);
                }

                if (newState.object_id && !newState.object) {
                    isUpdateObjects = true;
                }
                if (newState.device_id && !newState.device) {
                    isUpdateDevices = true;
                }
            });

            if (!data || !data.data || data.data.length === 0) {
                    this.iqsObjectRoutesViewModel.cleanUp();
                    this.iqsObjectRoutesViewModel.unfocus();
            }

            this.setObjectsCounts();
            this.sortObjectSates();
            this.filterObjectStates(this.filter);
            if (this.filterObjects) this.filterFunction(this.filterObjects, this.showUnknown);

            async.parallel([
                (callback) => {
                    if (isUpdateObjects) {
                        if (!this.lastObjectUpdate || nowDate - this.lastObjectUpdate > this.OBJECT_UPDATE_FREQUENCY) {
                            this.iqsObjectsViewModel.read(
                                (data) => {
                                    callback()
                                    this.lastObjectUpdate = nowDate;
                                },
                                (error) => {
                                    callback()
                                }
                            );
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                },
                (callback) => {
                    if (isUpdateDevices) {
                        if (!this.lastObjectUpdate || nowDate - this.lastObjectUpdate > this.DEVICE_UPDATE_FREQUENCY) {
                            this.iqsObjectsViewModel.read(
                                (data) => {
                                    callback()
                                    this.lastObjectUpdate = nowDate;
                                },
                                (error) => {
                                    callback()
                                }
                            );
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                },
            ],
                // optional callback
                (error, results) => {
                    _.each(this.allObjectStates, (state) => {
                        _.each(this.allObjectStates, (state) => {
                            if (state.object_id && !state.object || state.device_id && !state.device) {
                                this.bindToObjectAndDevice(state);
                            }
                        });
                    });
                    this.removeWithoutDevice();
                    this.setObjectsCounts();
                    this.sortObjectSates();
                    this.filterObjectStates(this.filter);
                    if (this.filterObjects) this.filterFunction(this.filterObjects, this.showUnknown);
                });

            if (callback) callback();
        });
        // });
    }

    public isActive(state) {
        return state.isActive;
        // return Math.abs(this.toTime.getTime() - new Date(state.time).getTime()) < this.getOfflineTimeout();
    }

    // protected getCurrentRosters(successCallback) {
    //     if (this.localOffset == undefined || this.organizationOffset == undefined) {
    //         this.organizationTimezone = this.iqsOrganization.organization && this.iqsOrganization.organization.timezone ? this.iqsOrganization.organization.timezone : moment.tz.guess();
    //         this.localOffset = moment(new Date()).utcOffset();
    //         this.organizationOffset = moment(new Date()).tz(this.organizationTimezone).format('z') !== undefined ? moment(new Date()).tz(this.organizationTimezone).utcOffset() : this.localOffset;
    //     }

    //     this.date = this.date ? this.date : new Date();
    //     let date: Date = new Date(this.date.getTime() + (this.localOffset - this.organizationOffset) * 60 * 1000);

    //     this.iqsRostersViewModel.getCurrentRosters(date, (data: Roster[]) => {
    //         this.currentRosters = data;
    //         this.getCurrentRostersObjectIds();

    //         if (successCallback) successCallback();
    //     })
    // }


    protected setStatus(state: ObjectState) {
        state.isActive = !state || !state.time ? false : Math.abs(this.date.getTime() - moment(state.time).valueOf()) < this.getOfflineTimeout();

        if (!state.object_id) {
            state.status = ObjectStatuses.unknown;
            return;
        }

        // if (state.isActive && !this.currentShiftsObjectIds.includes(state.object_id)) {
        if (state.isActive && !state.expected) {
            state.status = ObjectStatuses.unexpected;
            return;
        }

        // if (!this.currentRostersObjectIds.includes(state.object_id)) {
        if (!state.expected) {
            state.status = this.isOffline(state) ? ObjectStatuses.offline : ObjectStatuses.lost;
            return;
        }

        // if (!state.isActive && this.currentRostersObjectIds.includes(state.object_id)) {
        if (!state.isActive && state.expected) {
            state.status = ObjectStatuses.lost;
            return;
        }

        if (state.freezed > 0) {
            state.status = ObjectStatuses.freezed;
            return;
        }

        if (state.immobile > 0) {
            state.status = ObjectStatuses.freezed;
            return;
        }

        state.status = ObjectStatuses.active;
    }
    /*
        public focusByDeviceId(id: string, updateCenter: boolean = true, alwaysShow: boolean = false, autoFocus: boolean = false) {
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
            _.each(this.allObjectStates, (item: ObjectState) => {
                item.focused = (item.selected || autoFocus) && item.device_id === id
                item.selected = item.device_id === id;
    
                this.setIcon(item, null, alwaysShow);
    
                let currentPosition = {
                    latitude: item.latitude,
                    longitude: item.longitude, 
                    time: item.pos_time
                };
    
                if (item.selected) {
                    if (item.object_id) {
                        this.iqsObjectPositionsViewModel.focus(item.object_id, currentPosition, this.toTime, item);
                    }
                }
    
                if (item.focused) {
                    this.focused = item.device_id;
    
                    if (this.updateCenter) this.$rootScope.$broadcast(UPDATE_MAP_MODEL_CENTER, currentPosition);
                }
            });
        }*/


}