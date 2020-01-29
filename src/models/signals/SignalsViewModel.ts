import { SignalsModel } from './SignalsModel'
import { ISignalsViewModel } from './ISignalsViewModel';
import { Signal, ISignalsDataService } from "../../data";

class SignalViewModel implements ISignalsViewModel {
    public model: SignalsModel;

    constructor(
        pipTransaction: pip.services.ITransactionService,
        $timeout: ng.ITimeoutService,
        iqsSignalsData: ISignalsDataService
    ) {
        "ngInject";

        this.model = new SignalsModel(
            pipTransaction,
            $timeout,
            iqsSignalsData
        );
    }

    public read(successCallback?: (data: Signal[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.model.read(successCallback, errorCallback);
    }

    // data operation
    public get(): Signal[] {
        return this.model.get();
    }

    public getTransaction(): pip.services.Transaction {
        return this.model.getTransaction();
    }

    public reload(successCallback?: (data: Signal[]) => void, errorCallback?: (error: any) => void): void {
        this.model.reload(successCallback, errorCallback);
    }

    public createSignal(data: Signal, successCallback?: (data: Signal) => void, errorCallback?: (error: any) => void): void {
        this.model.createSignal(data, successCallback, errorCallback);
    }

    public deleteSignal(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.model.deleteSignal(id, successCallback, errorCallback);
    }

    public lockSignal(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.model.lockSignal(params, successCallback, errorCallback);
    }

    public closeSignal(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.model.closeSignal(params, successCallback, errorCallback);
    }

    public get state(): string {
        return this.model.state;
    }

    public set state(value: string) {
        this.model.state = value;
    }

    public clean(): void {
        this.model.cleanUp();
    }

}

angular.module('iqsSignals.ViewModel', [])
    .service('iqsSignalsViewModel', SignalViewModel);