import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, distinctUntilKeyChanged, startWith } from 'rxjs/operators';

import { ObjectGroup } from '../models/index';
import {
    ObjectGroupsState,
    ObjectGroupsInitAction,
    getObjectGroupsData,
    getObjectGroupsState,
    getObjectGroupsError
} from '../store/index';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { Organization } from '../../organizations/models/Organization';
import { EntityState } from '../../../common/models/EntityState';
import { pausableInterval } from '../../../common/utils/interval';

@Injectable({
    providedIn: 'root'
})
export class IqsObjectGroupsService {

    static updateSub = null;

    private _isPaused = true;

    constructor(
        private store: Store<ObjectGroupsState>,
        private organizationsService: IqsOrganizationsService
    ) { }

    public init() {
        if (IqsObjectGroupsService.updateSub) { return; }
        this.organizationsService.init();

        IqsObjectGroupsService.updateSub = combineLatest(
            this.organizationsService.current$.pipe(
                filter(organization => organization !== null),
                distinctUntilKeyChanged('id'),
            ),
            pausableInterval(() => this._isPaused).pipe(startWith(0))
        ).subscribe(([organization, _]: [Organization, any]) => {
            this.store.dispatch(new ObjectGroupsInitAction());
        });
    }

    public get groups$(): Observable<ObjectGroup[]> {
        return this.store.select(getObjectGroupsData);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getObjectGroupsState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getObjectGroupsError);
    }

    public startLive() {
        this._isPaused = false;
    }

    public stopLive() {
        this._isPaused = true;
    }
}
