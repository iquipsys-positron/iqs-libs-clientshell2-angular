import { Gateway } from './Gateway';
import { DataPage } from '../DataPage';

export interface IGatewaysDataService {
    readGateway(params: any, successCallback?: (data: Gateway) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readGateways(params: any, successCallback?: (data: DataPage<Gateway>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createGateway(data: Gateway, successCallback?: (data: Gateway) => void, errorCallback?: (error: any) => void): void;
    updateGateway(id: string, data: Gateway, successCallback?: (data: Gateway) => void, errorCallback?: (error: any) => void): void;
    deleteGateway(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    verifyGatewayUdi(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    statsGateway(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    pingGateway(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
}

export interface IGatewaysDataProvider extends ng.IServiceProvider {

}
