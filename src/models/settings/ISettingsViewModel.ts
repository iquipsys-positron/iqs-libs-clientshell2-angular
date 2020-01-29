import { SettingsUncover } from './SettingsUncover';

export interface ISettingsViewModel {
    isPopulated: boolean;
    settings: any;

    read(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    reload(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    create(settings: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void;
    update(settings: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void;
    getTransaction(): pip.services.Transaction;
    saveKey(key: string, value: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    getSettingsBy(prefix: string): SettingsUncover[];
    deleteSettingsBy(settings: any, prefix: string): any;
    clean(): void;
}

