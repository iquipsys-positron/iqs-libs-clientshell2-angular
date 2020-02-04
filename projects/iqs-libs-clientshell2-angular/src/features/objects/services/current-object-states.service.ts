import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, distinctUntilKeyChanged, startWith, distinctUntilChanged } from 'rxjs/operators';

import { ObjectState } from '../models/index';
import {
    CurrentObjectStatesState,
    CurrentObjectStatesInitAction,
    getCurrentObjectStatesData,
    getCurrentObjectStatesDataByObjectId,
    getCurrentObjectStatesState,
    getCurrentObjectStatesError
} from '../store/index';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { Organization } from '../../organizations/models/Organization';
import { EntityState } from '../../../common/models/EntityState';
import { pausableInterval } from '../../../common/utils/interval';

@Injectable({
    providedIn: 'root'
})
export class IqsCurrentObjectStatesService {

    static updateSub = null;

    private _isPaused = true;

    constructor(
        private store: Store<CurrentObjectStatesState>,
        private organizationsService: IqsOrganizationsService
    ) { }

    public init() {
        if (IqsCurrentObjectStatesService.updateSub) { return; }
        this.organizationsService.init();

        IqsCurrentObjectStatesService.updateSub = combineLatest(
            this.organizationsService.current$.pipe(
                filter(organization => organization !== null),
                distinctUntilKeyChanged('id'),
            ),
            pausableInterval(() => this._isPaused).pipe(startWith(0))
        ).subscribe(([organization, _]: [Organization, any]) => {
            this.store.dispatch(new CurrentObjectStatesInitAction());
        });
    }

    public read() {
        this.store.dispatch(new CurrentObjectStatesInitAction());
    }

    public get states$(): Observable<ObjectState[]> {
        return this.store.select(getCurrentObjectStatesData);
    }

    public findByObjectId$(id: string): Observable<ObjectState> {
        // do not use 'distinctUntilChanged', because states will always have new time
        return this.store.select(getCurrentObjectStatesDataByObjectId, { id });
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getCurrentObjectStatesState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getCurrentObjectStatesError);
    }

    public startLive() {
        this._isPaused = false;
    }

    public stopLive() {
        this._isPaused = true;
    }
}
