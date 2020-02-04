import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, distinctUntilKeyChanged, startWith } from 'rxjs/operators';

import { Zone } from '../models/index';
import {
    ZonesState,
    ZonesInitAction,
    getZonesData,
    getZonesState,
    getZonesError
} from '../store/index';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { Organization } from '../../organizations/models/Organization';
import { EntityState } from '../../../common/models/EntityState';
import { pausableInterval } from '../../../common/utils/interval';

@Injectable({
    providedIn: 'root'
})
export class IqsZonesService {

    static updateSub = null;

    private _isPaused = true;

    constructor(
        private store: Store<ZonesState>,
        private organizationsService: IqsOrganizationsService
    ) { }

    public init() {
        if (IqsZonesService.updateSub) { return; }
        this.organizationsService.init();

        IqsZonesService.updateSub = combineLatest(
            this.organizationsService.current$.pipe(
                filter(organization => organization !== null),
                distinctUntilKeyChanged('id'),
            ),
            pausableInterval(() => this._isPaused).pipe(startWith(0))
        ).subscribe(([organization, _]: [Organization, any]) => {
            this.store.dispatch(new ZonesInitAction());
        });
    }

    public get zones$(): Observable<Zone[]> {
        return this.store.select(getZonesData);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getZonesState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getZonesError);
    }

    public startLive() {
        this._isPaused = false;
    }

    public stopLive() {
        this._isPaused = true;
    }
}
