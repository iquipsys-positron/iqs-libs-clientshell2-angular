import {
    ApplicationCategory,
    ApplicationsModel,
    IApplicationsViewModel
} from './';
import { ISettingsViewModel } from '../settings';
import {
    IApplicationsDataService,
    ApplicationTile
} from '../../data';
import { IOrganizationService } from '../../services';

export class ApplicationViewModel implements IApplicationsViewModel {
    private _isPopulated: boolean;
    public model: ApplicationsModel;

    constructor(
        iqsApplicationsData: IApplicationsDataService,
        iqsSettingsViewModel: ISettingsViewModel,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        this.model = new ApplicationsModel(iqsApplicationsData, iqsSettingsViewModel, iqsOrganization);
    }

    public get state() {
        return this.model.state;
    }

    public set state(state: string) {
        this.model.state = state;
    }

    public get applications() {
        return this.model.applications;
    }

    public get favourites() {
        return this.model.favourites;
    }

    public get favouritesOrDefault() {
        return this.model.favouritesOrDefault;
    }

    public get categories(): ApplicationCategory[] {
        return this.model.categories;
    }

    public initApplications(successCallback?: (data: ApplicationTile[]) => void, errorCallback?: (error: any) => void) {
        this.model.getApplications(successCallback, errorCallback);
    }

    public getApplicationById(id: string): ApplicationTile {
        return this.model.getApplicationById(id);
    }

    public updateApplication(app: ApplicationTile, successCallback: (data: ApplicationTile) => void, errorCallback: (error: any) => void): void {
        this.model.updateApplication(app, successCallback, errorCallback);
    }

    public createApplication(app: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void {
        this.model.createApplication(app, successCallback, errorCallback);
    }

    public deleteApplication(app: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void {
        this.model.deleteApplication(app, successCallback, errorCallback);
    }

    public setFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.model.setFavourite(app, successCallback, errorCallback);
    }

    public resetFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.model.resetFavourite(app, successCallback, errorCallback);
    }

    public toggleFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.model.toggleFavourite(app, successCallback, errorCallback);
    }

    public clean(): void {
        this.model.clean();
    }
}

angular.module('iqsApplications.ViewModel', ['iqsApplications.Data', 'iqsOrganizations.Service'])
    .service('iqsApplicationsViewModel', ApplicationViewModel);