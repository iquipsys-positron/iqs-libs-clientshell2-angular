import { Injectable } from '@angular/core';
import { EntityState, Organization } from 'iqs-libs-clientshell2-angular';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { organizations } from '../storage';

@Injectable()
export class MockOrganizationsService {

    private _error$: BehaviorSubject<any>;
    private _organizations$: BehaviorSubject<Organization[]>;
    private _organization$: BehaviorSubject<Organization>;

    constructor() {
        this._error$ = new BehaviorSubject<any>(null);
        this._organizations$ = new BehaviorSubject<Organization[]>([]);
        this._organization$ = new BehaviorSubject<Organization>(null);
    }

    public init(): void {
        this._organizations$.next(organizations);
        if (organizations && organizations.length) {
            this._organization$.next(organizations[0]);
        }
    }

    public read(): void {
        this.init();
    }

    public get organizations$(): Observable<Organization[]> {
        return this._organizations$.asObservable();
    }

    public get organizations(): Organization[] {
        return this._organizations$.getValue();
    }

    public get current$(): Observable<Organization> {
        return this._organization$.asObservable();
    }

    public get current(): Organization {
        return this._organization$.getValue();
    }

    public set current(organization: Organization) {
        this._organization$.next(organization);
    }

    public get state$(): Observable<EntityState> {
        return of(EntityState.Data);
    }

    public get error$(): Observable<any> {
        return this._error$.asObservable();
    }

    public get error(): any {
        return this._error$.getValue();
    }

    public set error(val: any) {
        this._error$.next(val);
    }
}
