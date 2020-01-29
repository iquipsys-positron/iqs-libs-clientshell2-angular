import '../../models/states/ObjectStatesAbstractModel';
import {
    IObjectFormatService,
    States
} from '../../common';
import {
    ICurrentObjectStatesDataService,
    DataPage,
    ObjectState
} from '../../data';
import {
    IDevicesViewModel,
    IIncidentsViewModel,
    IObjectsViewModel,
    IObjectRoutesViewModel,
    ObjectStatesAbstractModel,
    objectStateParams
} from '../../models';
import { UPDATE_MAP_MODEL_CENTER } from '../../models/map/MapModel';
import {
    IMapIconService,
    IObjectConfigsService,
    IOrganizationService,
    ISmartZoomService
} from '../../services';

export class CurrentObjectStatesModel extends ObjectStatesAbstractModel {
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
        "ngInject";
        super($location, iqsCurrentObjectStatesData, null, iqsDevicesViewModel, iqsObjectsViewModel, iqsMapIcon, iqsObjectConfigs,
            pipMapHelperSrv, $rootScope, iqsObjectRoutesViewModel, iqsIncidentsViewModel, iqsSmartZoom, pipTranslate, iqsObjectFormat, iqsOrganization);
    }

    public getObjectStates(filter: string = 'all', successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void) {
        this.state = States.Progress;
        this.date = new Date(Date.now());
        let params: objectStateParams = new objectStateParams();

        this.iqsObjectsViewModel.read((objects) => {
            this.iqsCurrentObjectStatesData.readCurrentObjectStates((data: DataPage<ObjectState>) => {
                this.filter = filter;
                this.getObjectStatesCallback(data, filter, successCallback);
                this.removeInactive();
            }, errorCallback);
        })
    }

    public readOne(id: string, successCallback?: (data: ObjectState) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.iqsCurrentObjectStatesData.readCurrentObjectState(id,
            (data: ObjectState) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public updateObjectStates(callback?: Function) {
        this.iqsCurrentObjectStatesData.readCurrentObjectStates((data: DataPage<ObjectState>) => {
            let isUpdateObjects: boolean = false;
            let isUpdateDevices: boolean = false;
            let nowDate = new Date().getTime();

            this.decreaseByDeviceIds(data.data);

            _.each(data.data, (newState) => {
                let oldPosition = {};
                let index = _.findIndex(this.allObjectStates, (state) => { return state.id === newState.id; });
                if (index > -1) {
                    oldPosition = {
                        latitude: _.clone(this.allObjectStates[index].latitude),
                        longitude: _.clone(this.allObjectStates[index].longitude)
                    };
                    if (newState.object_id !== this.allObjectStates[index].object_id) {
                        this.updateObjectByObjectId(this.allObjectStates[index], newState.object_id);
                    }
                    this.allObjectStates[index] = _.defaults(newState, this.allObjectStates[index]);
                    this.convertPositions(this.allObjectStates[index]);
                    this.setIcon(this.allObjectStates[index], oldPosition);

                    let currentPosition = {
                        latitude: this.allObjectStates[index].latitude,
                        longitude: this.allObjectStates[index].longitude
                    };

                    if (this.allObjectStates[index].selected) {
                        if (this.allObjectStates[index].object_id) {
                            this.iqsObjectRoutesViewModel.updateCurrentObjectPositions(currentPosition);
                        } else {
                            this.iqsObjectRoutesViewModel.unfocus();
                        }
                    }

                    if (this.allObjectStates[index].focused) {
                        if (this.updateCenter) this.$rootScope.$broadcast(UPDATE_MAP_MODEL_CENTER, currentPosition);
                    }
                } else {
                    this.updateObjectByObjectId(this.allObjectStates[index], newState.object_id);
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
                    this.setIcon(this.objectStates[index], oldPosition);
                }

                if (newState.object_id && !newState.object && !newState.offline) {
                    isUpdateObjects = true;
                }
                if (newState.device_id && !newState.device && !newState.offline) {
                    isUpdateDevices = true;
                }
            });

            if (!data || !data.data || data.data.length === 0) {
                this.iqsObjectRoutesViewModel.cleanUp();
                this.iqsObjectRoutesViewModel.unfocus();
            }

            this.removeInactive();
            this.setObjectsCounts();
            this.filterObjectStates(this.filter);
            if (this.filterObjects) {
                // this.filterWithArrayObjects(this.filterObjects);
                this.filterFunction(this.filterObjects, this.showUnknown);

            } else {
                this.sortObjectSates();
            }
            this.state = this.objectStates.length > 0 ? States.Data : States.Empty;
            this.selectIndex();

            // if (isUpdateObjects) {
            //     if (!this.lastObjectUpdate || nowDate - this.lastObjectUpdate > this.OBJECT_UPDATE_FREQUENCY) {
            //         this.iqsObjectsViewModel.read((data) => {
            //             _.each(this.allObjectStates, (state) => {
            //                 this.updateObjectByObjectId(state, state.object_id);
            //             });
            //             this.setObjectsCounts();
            //             this.filterObjectStates(this.filter);
            //             if (this.filterObjects) {
            //                 // this.filterWithArrayObjects(this.filterObjects)
            //                 this.filterFunction(this.filterObjects, this.showUnknown);
            //             } else {
            //                 this.sortObjectSates();
            //             }
            //             this.state = this.objectStates.length > 0 ? States.Data : States.Empty;
            //             this.selectIndex();

            //         });
            //     }
            // }

            if (isUpdateObjects || isUpdateDevices) {
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
                            if (state.object_id && !state.object || state.device_id && !state.device) {
                                this.bindToObjectAndDevice(state);
                            }
                        });
                        // remove state
                        this.removeInactive();
                        this.removeWithoutDevice();

                        this.setObjectsCounts();
                        this.filterObjectStates(this.filter);
                        if (this.filterObjects) {
                            this.filterFunction(this.filterObjects, this.showUnknown);
                        } else {
                            this.sortObjectSates();
                        }
                        this.state = this.objectStates.length > 0 ? States.Data : States.Empty;
                        this.selectIndex();
                    });
            }

            if (callback) callback();
        });
    }

}