import { Device } from './Device';
import { DataPage } from '../DataPage';

export interface IDevicesDataService {
    readDevices(params: any, successCallback?: (data: DataPage<Device>) => void, errorCallback?: (error: any) => void): any;
    readDevice(params: any, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    saveDevice(data: Device, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void);
    updateDevice(id: string, data: Device, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void);
    deleteDevice(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
    // invalidateState(params, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
    verifyDeviceUdi(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    pingDevice(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
}

export interface IDevicesDataProvider {

}