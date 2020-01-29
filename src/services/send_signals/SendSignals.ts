import { ISendSignals } from './ISendSignals';
import {
    IDevicesViewModel,
    IObjectsViewModel,
    IObjectGroupsViewModel,
    ISignalsViewModel,
    IZonesViewModel
} from '../../models';
import { IIncidentCurrentObjectStateViewModel } from '../../models/incidents/IIncidentCurrentObjectStateViewModel';
import { Signal, ObjectState, SendSignalData } from '../../data';
import { IOrganizationService } from '../';

class SendSignals implements ISendSignals {


    constructor(
        private pipIdentity: pip.services.IIdentityService,
        private pipToasts: pip.controls.IToastService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsOrganization: IOrganizationService,
        private iqsIncidentCurrentObjectStatesViewModel: IIncidentCurrentObjectStateViewModel,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsDevicesViewModel: IDevicesViewModel,
        private iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        private iqsZonesViewModel: IZonesViewModel,
        private iqsSignalsViewModel: ISignalsViewModel
    ) {
        "ngInject";


    }

    public sendById(id: string, signalType: number, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        let signal: Signal = {
            org_id: this.iqsOrganization.orgId,
            device_id: id,
            type: signalType
        };
        this.iqsSignalsViewModel.createSignal(
            signal,
            (data: Signal) => {
                if (successCallback) successCallback();
            },
            (error: any) => {
                if (errorCallback) errorCallback(error);
            });
    }

    public sendBatch(deviceIds: string[], signalType: number, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        async.each(deviceIds, (id, callback) => {
            let signal: Signal = {
                org_id: this.iqsOrganization.orgId,
                device_id: id,
                type: signalType
            };
            this.iqsSignalsViewModel.createSignal(
                signal,
                (data: Signal) => {
                    callback();
                },
                (error: any) => {
                    callback(error);
                });
        }, (error) => {
            if (!error) {
                if (successCallback) successCallback();
            } else {
                if (errorCallback) errorCallback(error);
            }
        });
    }

    public getDeviceIdsByObjects(object_ids: string[]): string[] {
        let device_ids: string[] = [];

        _.each(object_ids, (id: string) => {
            let object = this.iqsObjectsViewModel.getObjectById(id);

            if (object) {
                if (object.device_id) {
                    device_ids.push(object.device_id);
                }
            }
        });

        return _.uniq(device_ids);
    }

    public getDeviceIdsByGroups(group_ids: string[]): string[] {
        let device_ids: string[] = [];

        _.each(group_ids, (id: string) => {
            let group = this.iqsObjectGroupsViewModel.getGroupById(id);

            if (group) {
                if (group.object_ids) {
                    device_ids = _.union(device_ids, this.getDeviceIdsByObjects(group.object_ids))
                }
            }
        });

        return _.uniq(device_ids);
    }

    public getDeviceIdsByZones(zone_ids: string[]): string[] {
        let device_ids: string[] = [];
        _.each(this.iqsIncidentCurrentObjectStatesViewModel.allCurrentObjectStates, (state: ObjectState) => {
            if (!state.device_id) return;

            let index: number = _.findIndex(state.zones, (item: any) => {
                return zone_ids.includes(item.zone_id);
            })

            if (index > -1) {
                device_ids.push(state.device_id);
            }
        });

        return _.uniq(device_ids);
    }

    public updateData(callback: () => void): void {
        async.parallel([
            (callback) => {
                this.iqsObjectsViewModel.initObjects(null,
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                this.iqsIncidentCurrentObjectStatesViewModel.initCurrentObjectStates(null,
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                this.iqsObjectGroupsViewModel.filter = null;
                this.iqsObjectGroupsViewModel.read(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });

            },
            (callback) => {
                this.iqsZonesViewModel.reload(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });

            }
        ],
            // optional callback
            (error, results) => {
                callback();
            });
    }

    public sendSignals(data: SendSignalData): void {
        this.updateData(() => {
            let deviceIdObject: string[] = [];
            let deviceIdGroup: string[] = [];
            let deviceIdZone: string[] = [];

            if (data.group_ids && data.group_ids.length) {
                deviceIdGroup = this.getDeviceIdsByGroups(data.group_ids)
            }
            if (data.object_ids && data.object_ids.length) {
                deviceIdObject = this.getDeviceIdsByObjects(data.object_ids);
            }
            if (data.zone_ids && data.zone_ids.length) {
                deviceIdZone = this.getDeviceIdsByZones(data.zone_ids);
            }

            let ids: string[] = _.uniq(_.union(deviceIdGroup, deviceIdObject, deviceIdZone));

            if (!ids || !ids.length) return;

            this.sendBatch(
                ids, data.signal,
                () => {
                    this.pipToasts.showNotification(this.pipTranslate.translate('SEND_SIGNAL_OK'),
                    ['ok'], () => { }, () => { }, '');
                },
                () => {

                });
        });        
    }

}



angular
    .module('iqsSendSignals', [])
    .service('iqsSendSignals', SendSignals);
