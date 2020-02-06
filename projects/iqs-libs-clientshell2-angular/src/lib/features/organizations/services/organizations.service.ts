import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, take } from 'rxjs/operators';

import {
    OrganizationsState,
    OrganizationsInitAction,
    OrganizationsConnectInitAction,
    OrganizationsCreateInitAction,
    OrganizationsCurrentChangeInitAction,
    OrganizationsDisconnectInitAction,
    getOrganizationsOrganizations,
    getOrganizationsCurrent,
    getOrganizationsState,
    getOrganizationsError
} from '../store/index';
import { Organization } from '../models/index';
import { EntityState } from '../../../common/index';
import { IqsSettingsService } from '../../settings/services/settings.service';

@Injectable()
export class IqsOrganizationsService {

    constructor(
        private store: Store<OrganizationsState>,
        private settingsService: IqsSettingsService
    ) { }

    public init(): void {
        this.settingsService.init();
        this.state$.pipe(
            first()
        ).subscribe(state => {
            if (state === EntityState.Empty || state === EntityState.Error) {
                this.store.dispatch(new OrganizationsInitAction());
            }
        });
    }

    public read(): void {
        return this.store.dispatch(new OrganizationsInitAction());
    }

    public get organizations$(): Observable<Organization[]> {
        return this.store.select(getOrganizationsOrganizations);
    }

    public get current$(): Observable<Organization> {
        return this.store.select(getOrganizationsCurrent);
    }

    public get current(): Organization {
        let organization: Organization;
        this.current$.pipe(take(1)).subscribe(s => organization = s);
        return organization;
    }

    public set current(organization: Organization) {
        this.store.dispatch(new OrganizationsCurrentChangeInitAction(organization));
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getOrganizationsState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getOrganizationsError);
    }

    public createOrganization(organization: Organization): void {
        return this.store.dispatch(new OrganizationsCreateInitAction(organization));
    }

    public connectToOrganization(organization: Organization): void {
        return this.store.dispatch(new OrganizationsConnectInitAction(organization));
    }

    public disconnectFromOrganization(organization: Organization): void {
        return this.store.dispatch(new OrganizationsDisconnectInitAction(organization));
    }
}
