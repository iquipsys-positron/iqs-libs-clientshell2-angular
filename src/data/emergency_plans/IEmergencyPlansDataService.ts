import { EmergencyPlan } from './EmergencyPlan';
import { DataPage } from '../DataPage';

export interface IEmergencyPlansDataService {
    readEmergencyPlan(id: string, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    readEmergencyPlans(params: any, successCallback?: (data: DataPage<EmergencyPlan>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    createEmergencyPlan(data: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void;
    updateEmergencyPlan(id: string, data: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void;
    deleteEmergencyPlan(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}

export interface IEmergencyPlansDataProvider extends ng.IServiceProvider {

}
