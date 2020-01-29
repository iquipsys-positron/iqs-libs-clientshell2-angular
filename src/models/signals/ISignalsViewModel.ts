import { Signal } from "../../data";

export interface ISignalsViewModel {
    read(successCallback?: (data: Signal[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    get(): Signal[];
    getTransaction(): pip.services.Transaction;
    reload(successCallback?: (data: Signal[]) => void, errorCallback?: (error: any) => void): void;
    createSignal(data: Signal, successCallback?: (data: Signal) => void, errorCallback?: (error: any) => void): void;
    deleteSignal(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    lockSignal(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    closeSignal(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    clean(): void;

    state: string;
}
