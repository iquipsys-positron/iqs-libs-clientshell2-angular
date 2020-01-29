import { ApplicationTile } from '../../data';

export interface IApplicationsViewModel {
    state: string;
    applications;
    favourites;
    favouritesOrDefault;
    categories;
    initApplications(successCallback?: (data: ApplicationTile[]) => void, errorCallback?: (error: any) => void);
    getApplicationById(id: string): ApplicationTile;
    updateApplication(organization: ApplicationTile, successCallback: (data: ApplicationTile) => void, errorCallback: (error: any) => void): void;
    createApplication(data: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void;
    deleteApplication(data: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void;
    setFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    resetFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    toggleFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    clean(): void;
}