import { DataPage } from '../../data';
import { Signal } from "../../data";
import { ISignalsDataService } from "../../data";
import { States } from '../../common/States';

export class SignalsModel {
    private _state: string;
    private transaction: pip.services.Transaction;

    private signals: Signal[];

    constructor(
        pipTransaction: pip.services.ITransactionService,
        private $timeout: ng.ITimeoutService,
        private iqsSignalsData: ISignalsDataService
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('Signal');
        this.signals = [];
    }

    private collectionChanged() {
        this.setState();

        this.$timeout(() => {
            this.setState();
        }, 0);
    }

    private setState() {
        this.state = (this.signals && this.signals.length > 0) ? States.Data : States.Empty;
    }

    public read(successCallback?: (data: Signal[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('read');

        return this.iqsSignalsData.readSignals(
            (data: DataPage<Signal>) => {
                this.signals = data.data;
                this.collectionChanged();
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    // data operation
    public get(): Signal[] {
        return this.signals;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public reload(successCallback?: (data: Signal[]) => void, errorCallback?: (error: any) => void) {
        this.signals = new Array();
        this.state = States.Progress;
        this.read(successCallback, errorCallback);
    }

    public get state(): string {
        return this._state;
    }

    public set state(value: string) {
        if (value) {
            this._state = value;
        }
    }

    public cleanUp(): void {
        this.signals = [];
        this.state = States.Empty;
    }

    public createSignal(data: Signal, successCallback?: (data: Signal) => void, errorCallback?: (error: any) => void): void {
        this.iqsSignalsData.saveSignal(
            data,
            (item: Signal) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }
    
    public deleteSignal(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.iqsSignalsData.deleteSignal(id,
            (data) => {
                if (successCallback) {
                    successCallback(data);
                }

                return data;
            }, errorCallback)
    }

    public lockSignal(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.iqsSignalsData.lockSignal(params,
            (data: any) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public closeSignal(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.iqsSignalsData.closeSignal(params,
            (data: any) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }
}