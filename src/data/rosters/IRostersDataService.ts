import { Roster } from './Roster';
import { DataPage } from '../DataPage';

export interface IRostersDataService {
    readRosters(params: any, successCallback?: (data: DataPage<Roster>) => void, errorCallback?: (error: any) => void): any;
    readRoster(id: string, successCallback?: (data: Roster) => void, errorCallback?: (error: any) => void): any;
    saveRoster(data: Roster, successCallback?: (data: Roster) => void, errorCallback?: (error: any) => void);
    updateRoster(id: string, data: Roster, successCallback?: (data: Roster) => void, errorCallback?: (error: any) => void);
    deleteRoster(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
}

export interface IRostersDataProvider {

}