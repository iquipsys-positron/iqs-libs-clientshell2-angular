import { Zone } from './Zone';
import { DataPage } from '../DataPage';

export interface IZonesDataService {
    readZone(object_id: string, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): any;
    readZones(params: any, successCallback?: (data: DataPage<Zone>) => void, errorCallback?: (error: any) => void): any;
    saveZone(data: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): any;
    updateZone(id: string, data: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): any;
    deleteZone(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): any;
}

export interface IZonesDataProvider {

}