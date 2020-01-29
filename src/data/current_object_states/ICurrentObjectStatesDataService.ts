import { ObjectState } from '../object_states';
import { DataPage } from '../DataPage';

export interface ICurrentObjectStatesDataService {
    readCurrentObjectState(object_id: string, successCallback ? : (data: ObjectState) => void, errorCallback ? : (error: any) => void): any;
    readCurrentObjectStates(successCallback?: (data: DataPage<ObjectState>) => void, errorCallback?: (error: any) => void): void;
}

export interface ICurrentObjectStatesDataProvider {

}