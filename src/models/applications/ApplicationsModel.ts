import { sortBy } from 'lodash'

import { States } from '../../common/States';
import { ISettingsViewModel } from '../settings';
import {
    IApplicationsDataService,
    ApplicationTile,
    DataPage
} from '../../data';
import { IOrganizationService } from '../../services';

export class ApplicationCategory {
    public key: string;
    public tiles: ApplicationTile[];
}

export class ApplicationsModel {
    private readonly favouritesKey: string = 'favourites';
    private readonly favouritesDefaultIds: string[] = [
        'iqs_positron_monitoring',
        'iqs_positron_retrospective',
        'iqs_positron_schedule',
        'iqs_positron_incidents'
    ];
    private categoriesIndex: any;
    private categoryRanks: any;
    public applications: ApplicationTile[];
    public favouritesDefault: ApplicationTile[];
    public categories: ApplicationCategory[];
    public favouritesOrDefault: ApplicationTile[];
    public state: string;

    constructor(
        private iqsApplicationsData: IApplicationsDataService,
        private iqsSettingsViewModel: ISettingsViewModel,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        this.favouritesOrDefault = [];
        this.categoryRanks = {
            [this.favouritesKey]: 1,
            'apps': 2
        };
        this.categoriesIndex = {};
    }

    private setState() {
        this.state = (this.applications && this.applications.length > 0) ? States.Data : States.Empty;
    }

    private saveFavourites(successCallback?: () => void, errorCallback?: (error: any) => void): void {
        if (this.transaction.busy() || this.categoriesIndex[this.favouritesKey] < 0 || !this.categories[this.categoriesIndex[this.favouritesKey]]) {
            return;
        }

        let s = _.cloneDeep(this.iqsSettingsViewModel.settings);
        this.iqsSettingsViewModel.deleteSettingsBy(s, this.favouritesKey);

        delete s.$promise;
        delete s.$resolved;

        s[this.favouritesKey + "_" + this.iqsOrganization.orgId] = JSON.stringify(this.categories[this.categoriesIndex[this.favouritesKey]].tiles.map(app => app.id));

        this.iqsSettingsViewModel.create(s, successCallback, errorCallback);
    }

    private updateFavouritesOrDefault() {
        if (Array.isArray(this.favouritesOrDefault)) {
            this.favouritesOrDefault.length = 0;
        } else {
            this.favouritesOrDefault = [];
        }
        if (this.categoriesIndex[this.favouritesKey] >= 0 && this.categories[this.categoriesIndex[this.favouritesKey]] && !this.categories[this.categoriesIndex[this.favouritesKey]].tiles.length) {
            this.favouritesOrDefault.push(...this.favouritesDefault);
        } else {
            this.favouritesOrDefault.push(...this.categories[this.categoriesIndex[this.favouritesKey]].tiles);
        }
    }

    private changeFavourite(app: ApplicationTile, status: boolean, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        const idx = _.findIndex(this.applications, ['id', app.id]);
        if (idx < 0) {
            errorCallback('Application not found in applications list');
            return;
        }
        const fidx = _.findIndex(this.categories[this.categoriesIndex[this.favouritesKey]].tiles, ['id', app.id]);
        this.applications[idx].isFavourite = status;
        if (status && fidx < 0) {
            this.categories[this.categoriesIndex[this.favouritesKey]].tiles.push(this.applications[idx]);
            this.updateFavouritesOrDefault();
            this.saveFavourites(successCallback, errorCallback);
        } else if (!status && fidx >= 0) {
            this.categories[this.categoriesIndex[this.favouritesKey]].tiles.splice(fidx, 1);
            this.updateFavouritesOrDefault();
            this.saveFavourites(successCallback, errorCallback);
        }
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsSettingsViewModel.getTransaction();
    }

    public get favourites(): ApplicationTile[] {
        return this.categories && this.categoriesIndex[this.favouritesKey] && this.categories[this.categoriesIndex[this.favouritesKey]].tiles || [];
    }

    public getApplications(successCallback?: (data: ApplicationTile[]) => void, errorCallback?: (error: any) => void): void {
        this.state = States.Progress;
        async.waterfall([
            // read applications
            (callback) => {
                this.iqsApplicationsData.readApplications(null, (data: DataPage<ApplicationTile>) => {
                    this.applications = data.data;
                    this.categories = [{
                        key: this.favouritesKey,
                        tiles: []
                    }];
                    this.categoriesIndex = {
                        [this.favouritesKey]: 0
                    };
                    for (const app of this.applications) {
                        if (!this.categoriesIndex.hasOwnProperty(app.group)) {
                            this.categories.push({
                                key: app.group,
                                tiles: []
                            });
                            this.categoriesIndex[app.group] = this.categories.length - 1;
                        }
                        this.categories[this.categoriesIndex[app.group]].tiles.push(app);
                    }
                    this.categories = sortBy(this.categories, (cat) => {
                        return this.categoryRanks.hasOwnProperty(cat.key) ? this.categoryRanks[cat.key] : 3;
                    });
                    callback();
                }, errorCallback);
            },
            (callback) => {
                if (this.iqsSettingsViewModel.settings[this.favouritesKey + "_" + this.iqsOrganization.orgId]) {
                    const applications = JSON.parse(this.iqsSettingsViewModel.settings[this.favouritesKey + "_" + this.iqsOrganization.orgId]);
                    for (let id of applications) {
                        if (id instanceof ApplicationTile) {
                            if (!id.hasOwnProperty('id')) continue;
                            else id = id.id;
                        }
                        const idx = _.findIndex(this.applications, ['id', id]);
                        if (~idx) {
                            this.applications[idx].isFavourite = true;
                            this.categories[this.categoriesIndex[this.favouritesKey]].tiles.push(this.applications[idx]);
                        }
                    }
                }
                this.favouritesDefault = _.filter(this.applications, (app) => { return this.favouritesDefaultIds.includes(app.id); });
                this.updateFavouritesOrDefault();
                this.setState();
                callback();
            }
        ], (err) => {
            if (err) {
                if (angular.isFunction(errorCallback)) {
                    errorCallback(err);
                }
            } else {
                if (angular.isFunction(successCallback)) {
                    successCallback(this.applications);
                }
            }
        });
    }

    public getApplicationById(id: string): ApplicationTile {
        return _.find(this.applications, ['id', id]);
    }

    public updateApplication(data: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void {
        this.iqsApplicationsData.updateApplication(data.id, data, (application: ApplicationTile) => {
            const idx: number = _.findIndex(this.applications, ['id', application.id]);
            if (idx > -1) {
                this.applications[idx] = application;
            }
            if (angular.isFunction(successCallback)) {
                successCallback(application);
            }

        }, errorCallback);
    }

    public createApplication(data: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void {
        this.iqsApplicationsData.saveApplication(data, (application: ApplicationTile) => {
            this.applications.push(application);
            if (angular.isFunction(successCallback)) {
                successCallback(application);
            }
        }, errorCallback);
    }

    public deleteApplication(data: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void {
        this.iqsApplicationsData.deleteApplication(data.id, (application: ApplicationTile) => {
            this.applications = _.reject(this.applications, ['id', data.id]);
            this.setState();
            if (angular.isFunction(successCallback)) {
                successCallback(application);
            }
        }, errorCallback);
    }

    public setFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.changeFavourite(app, true, successCallback, errorCallback);
    }

    public resetFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.changeFavourite(app, false, successCallback, errorCallback);
    }

    public toggleFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.changeFavourite(app, !app.isFavourite, successCallback, errorCallback);
    }

    public clean(): void {
        this.applications = [];
        this.categories = [];
        this.categoriesIndex = {};
        this.state = States.Empty;
    }
}