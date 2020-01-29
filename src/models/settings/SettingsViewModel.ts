import { ISettingsViewModel } from './ISettingsViewModel';
import { SettingsModel } from './SettingsModel';
import { SettingsUncover } from './SettingsUncover';

class SettingsViewModel implements ISettingsViewModel {
    private _filter: any;
    private settingsModel: SettingsModel;

    constructor(
        $log: ng.ILogService,
        $rootScope: ng.IRootScopeService,
        pipTransaction: pip.services.ITransactionService,
        pipSettingsData: pip.system.ISettingsDataService,
        pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";

        this._filter = null;
        this.settingsModel = new SettingsModel($log, $rootScope, pipTransaction, pipSettingsData, pipIdentity);
    }

    public get isPopulated(): boolean {
        return this.settingsModel.isPopulated;
    }

    public read(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.settingsModel.read(successCallback, errorCallback);
    }

    public reload(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.settingsModel.reload(successCallback, errorCallback);
    }

    public get settings(): any {
        return this.settingsModel.settings;
    }

    public getSettingsBy(prefix: string): SettingsUncover[] {
        return this.settingsModel.getSettingsBy(prefix);
    }

    public getTransaction(): pip.services.Transaction {
        return this.settingsModel.getTransaction();
    }

    public saveKey(key: string, value: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.settingsModel.saveKey(key, value, successCallback, errorCallback);
    }
    
    public update(settings: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void {
        this.settingsModel.update(settings, successCallback, errorCallback);
    }
    
    public create(settings: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void {
        this.settingsModel.create(settings, successCallback, errorCallback);
    }

    public deleteSettingsBy(settings: any, prefix: string): any {
        return this.settingsModel.deleteSettingsBy(settings, prefix);
    }

    public clean(): void {
        this.settingsModel.clean();
    }     
}

angular.module('iqsSettings.ViewModel', ['iqsSettings.Data'])
    .service('iqsSettingsViewModel', SettingsViewModel);

