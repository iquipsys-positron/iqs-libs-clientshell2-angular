import { Device } from "../../data";
import { SearchResult } from '../../services';

export interface IDevicesViewModel {
    initDevices(filter?: string, successCallback?: (data: Device[]) => void, errorCallback?: (error: any) => void);
    read(successCallback?: (data: Device[]) => void, errorCallback?: (error: any) => void);
    filterDevices(filter: string);
    selectItem(index?: number);
    getDeviceById(deviceId: string): Device;
    saveDevice(data: Device, callback: (item: Device) => void, error: (err: any) => void);
    updateDevice(data: Device, callback: (item: Device) => void, error: (err: any) => void);
    deleteDevice(id, callback: () => void, error: () => void);
    // invalidateState(deviceId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    filterWithArrayObjects(objects: SearchResult[]); 
    verifyDeviceUdi(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    clean(): void;
    getTransaction(): pip.services.Transaction;
    pingDevice(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    readOne(data: Device, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void);
    state: string;
    selectedIndex: number;
    devices: Device[];
    allDevices: Device[];
}