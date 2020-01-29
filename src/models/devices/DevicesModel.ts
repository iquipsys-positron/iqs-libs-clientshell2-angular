import {
    IDevicesDataService,
    DataPage,
    Device
} from '../../data';
import { States } from '../../common/States';
import { IObjectsViewModel } from '../../models/objects/IObjectsViewModel';
import {
    IOrganizationService,
    SearchResult
} from '../../services';


export class DeviceParams {
    skip: number = 0;
    total: boolean = true;
    size: number = 100;
    type?: string;
}

export class DevicesModel {
    public state: string;
    public allDevices: Device[];
    public devices: Device[];
    public selectedIndex: number;
    private selectedItem: Device;
    private transaction: pip.services.Transaction;

    constructor(
        private $location: ng.ILocationService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsDevicesData: IDevicesDataService,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('Device');
    }

    private setState() {
        this.state = (this.devices && this.devices.length > 0) ? States.Data : States.Empty;
    }

    private sortCollection(data: Device[]): Device[] {
        let collection: Device[] = _.sortBy(data, function (item: Device) {
            return item.label ? item.label.toLocaleLowerCase() : item.udi;
        });

        return collection;
    }

    public getDevices(filter: string, successCallback?: (data: Device[]) => void, errorCallback?: (error: any) => void) {
        this.state = States.Progress;
        let params: DeviceParams = new DeviceParams();
        this.transaction.begin('read');
        this.iqsDevicesData.readDevices(
            params,
            (data: DataPage<Device>) => {
                this.getDevicesCallback(data, filter, successCallback);
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);

                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    // read without transaction for objectStates
    public read(successCallback?: (data: Device[]) => void, errorCallback?: (error: any) => void) {
        let params: DeviceParams = new DeviceParams();
        this.iqsDevicesData.readDevices(
            params,
            (data: DataPage<Device>) => {
                this.getDevicesCallback(data, 'all', successCallback);
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public readOne(data: Device, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        let params = {
            device_id: data.id,
            org_id: this.iqsOrganization.orgId
        };
        return this.iqsDevicesData.readDevice(
            params,
            (item: Device) => {
                this.onUpdateDevice(data.object_id, item, successCallback, errorCallback);
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

    public pingDevice(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        let params = {
            device_id: id,
            org_id: this.iqsOrganization.orgId
        }
        this.iqsDevicesData.pingDevice(params,
            (data: any) => {
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

    public selectItem(index?: number): void {
        if (index === undefined || index === null || index < 0 || index > this.devices.length - 1) {
            let id: string = this.$location.search()['device_id'];
            if (id) {
                index = _.findIndex(this.devices, (item: Device) => {
                    return item.id == id;
                });
            }
            if (!index || index == -1) {
                index = 0;
            }
        }

        if (this.devices.length > index) {
            this.selectedIndex = index;
        } else {
            this.selectedIndex = 0;
        }

        this.selectedIndex = index;

        this.selectedItem = (this.devices && this.devices.length > 0) ? this.devices[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('device_id', this.selectedItem.id);
        }
        this.setState();
    }

    public filterDevices(filter: string = 'all') {
        this.devices = _.filter(this.allDevices, (item: Device) => {
            if (filter == 'all') return true;
            if (filter == 'empty') return !item.object_id;
            return item.object_id;
        });
        this.setState();
    }

    public filterWithArrayObjects(objects: SearchResult[]) {
        this.devices = _.filter(this.devices, (item: Device) => {
            return _.findIndex(objects, { id: item.id }) != -1 ? true : false;
        })
        this.setState();
    }

    public getDeviceById(deviceId: string) {
        return _.find(this.allDevices, (device) => { return device.id === deviceId; });
    }

    private getDevicesCallback(data: DataPage<Device>, filter?: string, successCallback?: (data: Device[]) => void) {
        this.allDevices = this.sortCollection(data.data);
        _.each(this.allDevices, (item: Device, index: number) => {
            if (item.object_id) {
                this.allDevices[index].object = this.iqsObjectsViewModel.getObjectById(item.object_id);
            }
        })
        this.filterDevices(filter);
        this.selectItem();

        if (successCallback) {
            successCallback(this.allDevices);
        }
    }

    public saveDevice(data: Device, callback?: (item: Device) => void, errorCallback?: (err: any) => void) {
        this.transaction.begin('save');
        this.iqsDevicesData.saveDevice(data,
            (item: Device) => {
                if (!this.devices) this.devices = [];
                if (!this.allDevices) this.allDevices = [];
                this.devices.push(item);
                this.allDevices.push(item);
                this.allDevices = this.sortCollection(this.allDevices);
                this.devices = this.sortCollection(this.devices);
                this.$location.search('device_id', item.id);
                this.selectItem();
                this.state = States.Data;
                this.transaction.end();
                if (callback) {
                    callback(item);
                }
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback(err);
                }
            })
    }

    public remove(id: string): void {
        _.remove(this.devices, { id: id });
        _.remove(this.allDevices, { id: id });
        this.setState();
    }

    public deleteDevice(id: string, callback?: () => void, errorCallback?: () => void) {
        this.transaction.begin('delete');
        let index: number;
        if (this.selectedItem && this.selectedItem.id == id) {
            index = this.selectedIndex < this.devices.length - 1 ? this.selectedIndex : this.selectedIndex - 1;
        } else {
            index = this.selectedIndex;
        }        
        this.iqsDevicesData.deleteDevice(id,
            (item) => {
                this.remove(id);
                this.selectItem(index);
                this.transaction.end();
                if (callback) {
                    callback();
                }
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback();
                }
            })
    }

    private onUpdateDevice(object_id: string, item: Device, callback?: (item) => void, errorCallback?: (err) => void): void {
        let localIndex: number;
        let index: number = _.findIndex(this.devices, { id: item.id });
        if (index > -1) {
            if (object_id && this.devices[index].object_id != object_id) {
                localIndex = _.findIndex(this.devices, { object_id: object_id });

                if (localIndex > -1 && localIndex != index) {
                    this.devices[localIndex].object_id = null;
                }
            }
            this.devices[index] = item;
            this.devices =this.sortCollection(this.devices);
        }

        index = _.findIndex(this.allDevices, { id: item.id });
        if (index > -1) {
            if (object_id && this.allDevices[index].object_id != object_id) {
                localIndex = _.findIndex(this.allDevices, { object_id: object_id });

                if (localIndex > -1 && localIndex != index) {
                    this.allDevices[localIndex].object_id = null;
                }
            }
            this.allDevices[index] = item;
            this.allDevices =this.sortCollection(this.allDevices);
        }

        this.transaction.end();
        if (callback) {
            callback(item);
        }
    }

    public updateDevice(data: Device, callback?: (item) => void, errorCallback?: (err) => void) {
        this.transaction.begin('update');
        this.iqsDevicesData.updateDevice(data.id, data,
            (item: Device) => {
                this.onUpdateDevice(data.object_id, item, callback, errorCallback);
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback(err);
                }
            })
    }

    public verifyDeviceUdi(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.iqsDevicesData.verifyDeviceUdi(params,
            (data: any) => {
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

    // public invalidateState(deviceId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
    //     let params = {
    //         device_id: deviceId,
    //         org_id: this.iqsOrganization.orgId
    //     }
    //     this.iqsDevicesData.invalidateState(
    //         params,
    //         (data: any) => {
    //             if (successCallback) {
    //                 successCallback(data);
    //             }
    //         },
    //         (error: any) => {
    //             if (errorCallback) {
    //                 errorCallback(error);
    //             }
    //         }
    //     );
    // }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public clean(): void {
        this.allDevices = [];
        this.devices = [];
        this.state = States.Empty;
        this.selectedIndex = -1;
    }
}