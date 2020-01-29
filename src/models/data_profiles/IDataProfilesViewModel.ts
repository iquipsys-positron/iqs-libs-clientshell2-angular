import { DataProfile } from "../../data";

export interface IDataProfilesViewModel {
    initDataProfiles(successCallback?: (data: DataProfile) => void, errorCallback?: (error: any) => void);
    clean(): void;
    getTransaction(): pip.services.Transaction;
    state: string;
    dataProfile: DataProfile;
}