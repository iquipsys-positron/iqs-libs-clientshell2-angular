import { SettingsUncover } from './SettingsUncover';

export class SettingsModel {
    private _settings: any;
    private _isPopulated: boolean = false;
    private transaction: pip.services.Transaction;

    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private pipTransaction: pip.services.ITransactionService,
        private pipSettingsData: pip.system.ISettingsDataService,
        private pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";
        this.transaction = this.pipTransaction.create('REGESTRY');
        this._settings = {};
    }

    private settingsChanged() {
        this.$rootScope.$broadcast('iqsSettingsCollectionChange')
    }

    private onRead(data: any, callback?: (data: any) => void): void {
        if (data) {
            this._settings = data;
        } else {
            this._settings = {};
        }

        this.transaction.end();
        this.settingsChanged();
        this._isPopulated = true;
        if (callback) {
            callback(this._settings);
        }
    }

    // CRUD operation
    public update(settings: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void {
        let userId = this.pipIdentity.identity && this.pipIdentity.identity.user_id ? this.pipIdentity.identity.user_id : null;

        if (!userId) return;

        this.transaction.begin('SETTINGS_UPDATE');
        this.pipSettingsData.updateSettings(userId, settings,
            (settings: any) => {
                this.onRead(settings, successCallback);
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Update settings error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }
    
    public create(settings: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void {
        let userId = this.pipIdentity.identity && this.pipIdentity.identity.user_id ? this.pipIdentity.identity.user_id : null;

        if (!userId) return;

        this.transaction.begin('SETTINGS_CREATE');
        this.pipSettingsData.createSettings(userId, settings,
            (settings: any) => {
                this.onRead(settings, successCallback);
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Create settings error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public read(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        let userId = this.pipIdentity.identity && this.pipIdentity.identity.user_id ? this.pipIdentity.identity.user_id : null;

        if (!userId) return;

        this.transaction.begin('read');
        this.pipSettingsData.readSettings(
            userId,
            (data: any) => {
                this.onRead(data, successCallback);
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Error: ' + JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public saveKey(key: string, value: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('SAVE_KEY');

        let userId = this.pipIdentity.identity && this.pipIdentity.identity.user_id ? this.pipIdentity.identity.user_id : null;

        if (!userId) return;

        let objValue = {
            value: value
        }

        this.pipSettingsData.saveSettingsKey(
            userId,
            key,
            value,
            (data) => {
                this.onRead(data, successCallback);
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Error: ' + JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    // data operation
    public get settings(): any {
        return this._settings;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public reload(successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.read(successCallback, errorCallback);
    }

    public getSettingsBy(prefix: string): SettingsUncover[] {
        let result: SettingsUncover[] = [];

        _.forEach(this._settings, (value: any, key: string) => {
            if (key.indexOf(prefix) === 0) {
                result.push({
                    key: key,
                    value: value
                });
            }
        });

        return result;
    }

    public deleteSettingsBy(settings: any, prefix: string): any {
        _.forEach(settings, (value: any, key: string) => {
            if (key.indexOf(prefix) === 0) {
                delete settings.key
            }
        });

        return settings;
    }

    public get isPopulated(): boolean {
        return this._isPopulated;
    }

    public clean(): void {
        this._settings = null;
        this._isPopulated = false;
    }    
}