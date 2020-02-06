import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EmergencyPlan } from '../models/index';
import {
    EmergencyInitAction,
    EmergencyState,
    getEmergencyData,
    getEmergencyState,
    getEmergencyError
} from '../store/index';
import { EntityState } from '../../../common/models/EntityState';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { filter, distinctUntilKeyChanged } from 'rxjs/operators';
import { Organization } from '../../organizations/models/Organization';

@Injectable({
    providedIn: 'root'
})
export class IqsEmergencyService {

    static epUpdateSub = null;

    constructor(
        private store: Store<EmergencyState>,
        private organizationsService: IqsOrganizationsService
    ) { }

    public init() {
        if (IqsEmergencyService.epUpdateSub) { return; }
        this.organizationsService.init();
        IqsEmergencyService.epUpdateSub = this.organizationsService.current$.pipe(
            filter(organization => organization !== null),
            distinctUntilKeyChanged('id'),
        ).subscribe((organization: Organization) => {
            this.store.dispatch(new EmergencyInitAction());
        });
    }

    public get plans$(): Observable<EmergencyPlan[]> {
        return this.store.select(getEmergencyData);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getEmergencyState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getEmergencyError);
    }
}
