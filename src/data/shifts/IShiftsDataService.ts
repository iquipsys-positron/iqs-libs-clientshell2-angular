import { Shift } from './Shift';
import { DataPage } from '../DataPage';

export interface IShiftsDataService {
    readShifts(params: any, successCallback?: (data: DataPage<Shift>) => void, errorCallback?: (error: any) => void): any;
    readShift(id: string, successCallback?: (data: Shift) => void, errorCallback?: (error: any) => void): any;
    saveShift(data: Shift, successCallback?: (data: Shift) => void, errorCallback?: (error: any) => void);
    updateShift(id: string, data: Shift, successCallback?: (data: Shift) => void, errorCallback?: (error: any) => void);
    deleteShift(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
}

export interface IShiftsDataProvider {

}