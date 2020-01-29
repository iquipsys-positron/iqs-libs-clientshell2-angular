import { DevicesModel } from './DevicesModel';
import {
    IDevicesDataService,
    Device
} from '../../data';
import { IDevicesViewModel } from '../../models/devices/IDevicesViewModel';
import { IObjectsViewModel} from '../../models/objects/IObjectsViewModel';
import {
    IOrganizationService,
    SearchResult
} from '../../services';

class DevicesViewModel implements IDevicesViewModel {
    public model: DevicesModel;

    constructor(
        $location: ng.ILocationService,
        pipTransaction: pip.services.ITransactionService,
        iqsDevicesData: IDevicesDataService,
        iqsObjectsViewModel: IObjectsViewModel,
        iqsOrganization: IOrganizationService
    ) {

        this.model = new DevicesModel($location, pipTransaction, iqsDevicesData, iqsObjectsViewModel, iqsOrganization);
    }

    public initDevices(filter?: string, successCallback?: (data: Device[]) => void, errorCallback?: (error: any) => void) {
        this.model.getDevices(filter || 'all', successCallback, errorCallback);
    }

    public read(successCallback?: (data: Device[]) => void, errorCallback?: (error: any) => void) {
        this.model.read(successCallback, errorCallback);
    }

    public pingDevice(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.model.pingDevice(id, successCallback, errorCallback);
    }

    public filterDevices(filter: string = 'all') {
        this.model.filterDevices(filter);
    }

    public get devices() {
        return this.model.devices;
    }

    public get allDevices() {
        return this.model.allDevices;
    }

    public selectItem(index?: number) {
        this.model.selectItem(index);
    }

    public getTransaction(): pip.services.Transaction {
        return this.model.getTransaction();
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

    public getDeviceById(deviceId: string): Device {
        return this.model.getDeviceById(deviceId)
    }

    public saveDevice(data: Device, callback: (item: Device) => void, error: (err: any) => void) {
        this.model.saveDevice(data, callback, error);
    }

    public deleteDevice(id, callback: () => void, error: () => void) {
        this.model.deleteDevice(id, callback, error);
    }

    public updateDevice(data: Device, callback: (item: Device) => void, error: (err: any) => void) {
        this.model.updateDevice(data, callback, error);
    }

    public filterWithArrayObjects(objects: SearchResult[])  {
        this.model.filterWithArrayObjects(objects);
    }

    public clean(): void {
        this.model.clean();
    }       

    public verifyDeviceUdi(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.model.verifyDeviceUdi(params, successCallback, errorCallback);
    }       
    
    public readOne(data: Device, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void)  {
        this.model.readOne(data, successCallback, errorCallback);
    }     
}

angular.module('iqsDevices.ViewModel', ['iqsDevices.Data', 'iqsObjects.ViewModel'])
    .service('iqsDevicesViewModel', DevicesViewModel);