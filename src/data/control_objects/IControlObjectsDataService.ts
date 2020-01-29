import { ControlObject } from './ControlObject';
import { DataPage } from '../DataPage';

export interface IControlObjectsDataService {
    readControlObjects(params: any, successCallback?: (data: DataPage<ControlObject>) => void, errorCallback?: (error: any) => void): any;
    readControlObject(id: string, successCallback?: (data: ControlObject) => void, errorCallback?: (error: any) => void): any;
    saveControlObject(data: ControlObject, successCallback?: (data: ControlObject) => void, errorCallback?: (error: any) => void);
    updateControlObject(id: string, data: ControlObject, successCallback?: (data: ControlObject) => void, errorCallback?: (error: any) => void);
    deleteControlObject(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);

}

export interface IControlObjectsDataProvider {

}