import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { cloneDeep, findIndex } from 'lodash';
import { Observable } from 'rxjs';
import { withLatestFrom, map, filter, first, shareReplay } from 'rxjs/operators';

import {
    getApplicationsData,
    getApplicationsState,
    getApplicationsToggling,
    getApplicationsError,
    ApplicationsToggleFavoriteAction
} from '../store/index';
import { ApplicationTile, ApplicationGroup } from '../models/index';
import { IqsApplicationsConfigService } from './applications.config.service';
import { IqsSettingsService } from '../../settings/services/settings.service';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { Organization } from '../../organizations/index';
import { EntityState, generateUUID } from '../../../common/index';
import { UserRole, userRoleValue } from '../../session/models/UserRole';

@Injectable()
export class IqsApplicationsService {

    static appUpdateSub = null;

    constructor(
        private applicationsConfig: IqsApplicationsConfigService,
        private store: Store<any>,
        private settingsService: IqsSettingsService,
        private organizationsService: IqsOrganizationsService
    ) { }

    /**
     * @deprecated since 2.0.2
     */
    public init(): void {
        console.warn('this method is deprecated. Applications will update automaticaly');
    }

    public get applications$(): Observable<ApplicationTile[]> {
        return this.store.select(getApplicationsData).pipe(
            withLatestFrom(this.organizationsService.currentRole$),
            map(([applications, role]: [ApplicationTile[], UserRole]) => {
                const urv = userRoleValue[role];
                return applications.filter(app => userRoleValue[app.role || UserRole.unknown] <= urv);
            }),
            shareReplay()
        );
    }

    public get groups$(): Observable<ApplicationGroup[]> {
        return this.applications$.pipe(
            map(applications => {
                const favoritesGroupName = this.applicationsConfig.favoritesGroupName;
                const groups = {
                    [favoritesGroupName]: {
                        name: favoritesGroupName,
                        applications: [],
                        isHidden: false
                    } as ApplicationGroup
                };
                for (const app of applications) {
                    if (!groups.hasOwnProperty(app.group)) {
                        groups[app.group] = {
                            name: app.group,
                            applications: []
                        } as ApplicationGroup;
                    }
                    groups[app.group].applications.push(app);
                    if (app.isFavorite) {
                        groups[favoritesGroupName].applications.push(app);
                    }

                }
                for (const key of Object.keys(groups)) {
                    groups[key].isHidden = groups[key].applications.length === 0;
                }
                return Object.keys(groups).map(key => groups[key]);
            })
        );
    }

    public get favorites$(): Observable<ApplicationTile[]> {
        return this.groups$.pipe(
            filter((groups: ApplicationGroup[]) => Array.isArray(groups) && groups.length > 0),
            map((groups: ApplicationGroup[]) => {
                const index = findIndex(groups, ['name', this.applicationsConfig.favoritesGroupName]);
                return index >= 0 ? groups[index].applications : [];
            })
        );
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getApplicationsState);
    }

    public get toggling$(): Observable<boolean> {
        return this.store.select(getApplicationsToggling);
    }

    public get error$(): Observable<any> {
        return this.store.select(getApplicationsError);
    }

    public toggleFavorite(app: ApplicationTile, state?: boolean) {
        this.organizationsService.current$.pipe(
            filter(organization => organization !== null),
            withLatestFrom(this.settingsService.settings$, this.applications$),
            first()
        ).subscribe(([organization, settings, apps]: [Organization, Object, ApplicationTile[]]) => {
            const found = apps.find(a => a.id === app.id);
            if (found) {
                const newState = typeof state === 'undefined' ? !app.isFavorite : state;
                const key = this.applicationsConfig.favoritesGroupName + '_' + organization.id;
                const favorites = cloneDeep(settings.hasOwnProperty(key) ? <string[]>JSON.parse(settings[key]) : []);
                const inFavoritesIdx = favorites.indexOf(app.id), inFavorites = inFavoritesIdx >= 0;
                if (inFavorites !== newState) {
                    if (inFavorites) {
                        // remove from favorites
                        favorites.splice(inFavoritesIdx, 1);
                    } else {
                        // add into favorites
                        favorites.push(app.id);
                    }
                    const rid = generateUUID();
                    this.store.dispatch(new ApplicationsToggleFavoriteAction({
                        rid,
                        application_id: found.id,
                        state: newState
                    }));
                    this.settingsService.updateKey(key, JSON.stringify(favorites), rid);
                }
            }
        });
    }
}
