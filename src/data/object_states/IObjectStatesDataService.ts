import { ObjectState } from './ObjectState';
import { DataPage } from '../DataPage';

export interface IObjectStatesDataService {
    readObjectState(object_id: string, successCallback?: (data: ObjectState) => void, errorCallback?: (error: any) => void): any;
    readObjectStates(to: string, successCallback?: (data: DataPage<ObjectState>) => void, errorCallback?: (error: any) => void): void;
}

export interface IObjectStatesDataProvider {

}