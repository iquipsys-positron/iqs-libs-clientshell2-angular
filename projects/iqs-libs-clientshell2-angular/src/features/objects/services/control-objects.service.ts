import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, distinctUntilKeyChanged, startWith, take, distinctUntilChanged } from 'rxjs/operators';

import { ControlObject } from '../models/index';
import {
    ControlObjectsState,
    ControlObjectsInitAction,
    getControlObjectsData,
    getControlObjectById,
    getControlObjectsState,
    getControlObjectsError
} from '../store/index';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { Organization } from '../../organizations/models/Organization';
import { EntityState } from '../../../common/models/EntityState';
import { pausableInterval } from '../../../common/utils/interval';

@Injectable({
    providedIn: 'root'
})
export class IqsControlObjectsService {

    static updateSub = null;

    private _isPaused = true;

    constructor(
        private store: Store<ControlObjectsState>,
        private organizationsService: IqsOrganizationsService
    ) { }

    public init() {
        if (IqsControlObjectsService.updateSub) { return; }
        this.organizationsService.init();

        IqsControlObjectsService.updateSub = combineLatest(
            this.organizationsService.current$.pipe(
                filter(organization => organization !== null),
                distinctUntilKeyChanged('id'),
            ),
            pausableInterval(() => this._isPaused).pipe(startWith(0))
        ).subscribe(([organization, _]: [Organization, any]) => {
            this.store.dispatch(new ControlObjectsInitAction());
        });
    }

    public read() {
        this.store.dispatch(new ControlObjectsInitAction());
    }

    public get objects$(): Observable<ControlObject[]> {
        return this.store.select(getControlObjectsData);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getControlObjectsState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getControlObjectsError);
    }

    public findById$(id: string): Observable<ControlObject> {
        return this.store.select(getControlObjectById, { id }).pipe(
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
        );
    }

    public findById(id: string): ControlObject {
        let ret: ControlObject;
        this.findById$(id).pipe(take(1)).subscribe(o => ret = o);
        return ret;
    }

    public startLive() {
        this._isPaused = false;
    }

    public stopLive() {
        this._isPaused = true;
    }
}
