import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { findIndex } from 'lodash';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, map, switchMap, take, exhaustMap } from 'rxjs/operators';

import * as fromOrganizationsActions from './organizations.actions';
import { Organization } from '../models/index';
import { IqsOrganizationsDataService } from '../services/organizations.data.service';
import { SettingsActionType, SettingsDataAction, SettingsUpdateSuccessAction } from '../../settings/store/index';
import { IqsSettingsService } from '../../settings/services/settings.service';

@Injectable()
export class OrganizationsEffects {
    constructor(
        private actions$: Actions,
        private ds: IqsOrganizationsDataService,
        private settings: IqsSettingsService
    ) { }

    @Effect() organizationsInit$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromOrganizationsActions.OrganizationsActionType.OrganizationsInit,
            fromOrganizationsActions.OrganizationsActionType.OrganizationsAbort
        ),
        switchMap((action: any) => {
            if (action.type === fromOrganizationsActions.OrganizationsActionType.OrganizationsInit) {
                return this.ds.readOrganizations()
                    .pipe(
                        map(data => new fromOrganizationsActions.OrganizationsSuccessAction(data.data)),
                        catchError(error => of(new fromOrganizationsActions.OrganizationsFailureAction(error)))
                    );
            } else {
                return of();
            }
        })
    );

    @Effect() organizationsSuccess$: Observable<Action | Action[]> = this.actions$.pipe(
        ofType(fromOrganizationsActions.OrganizationsActionType.OrganizationsSuccess),
        map((action: fromOrganizationsActions.OrganizationsSuccessAction) => action.payload),
        map((data: Organization[]) => {
            return data.length > 0
                ? new fromOrganizationsActions.OrganizationsDataAction(data)
                : new fromOrganizationsActions.OrganizationsEmptyAction();
        })
    );

    @Effect() organizationsCurrent$: Observable<Action> = combineLatest(
        this.actions$.pipe(ofType(fromOrganizationsActions.OrganizationsActionType.OrganizationsData)),
        this.actions$.pipe(ofType(SettingsActionType.SettingsData))
    ).pipe(
        switchMap(([organizationsAction, settingsAction]: [fromOrganizationsActions.OrganizationsDataAction, SettingsDataAction]) => {
            const organizationId = settingsAction.payload.hasOwnProperty('org_id') ? settingsAction.payload['org_id'] : null;
            const index = Array.isArray(organizationsAction.payload) && organizationsAction.payload.length
                ? organizationId
                    ? findIndex(organizationsAction.payload, ['id', organizationId])
                    : 0
                : null;
            const organization = organizationId !== null ? organizationsAction.payload[index] : null;
            return organization ? of(new fromOrganizationsActions.OrganizationsCurrentAction(organization)) : of();
        })
    );

    @Effect() organizationsCurrentChangeInit$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromOrganizationsActions.OrganizationsActionType.OrganizationsCurrentChangeInit,
            fromOrganizationsActions.OrganizationsActionType.OrganizationsCurrentChangeAbort,
        ),
        switchMap((action: fromOrganizationsActions.OrganizationsCurrentChangeInitAction
            | fromOrganizationsActions.OrganizationsCurrentChangeAbortAction) => {
            if (action.type === fromOrganizationsActions.OrganizationsActionType.OrganizationsCurrentChangeInit) {
                this.settings.updateKey('org_id', action.payload.id);
                return of(new fromOrganizationsActions.OrganizationsCurrentChangeSettingsAction(action.payload));
            } else {
                return of();
            }
        })
    );

    @Effect() organizationsCurrentChangeSettings$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrganizationsActions.OrganizationsActionType.OrganizationsCurrentChangeSettings),
        exhaustMap((organizationsAction: fromOrganizationsActions.OrganizationsCurrentChangeSuccessAction) => this.actions$.pipe(
            ofType(SettingsActionType.SettingsUpdateSuccess),
            take(1),
            map((settingsAction: SettingsUpdateSuccessAction) => {
                const organizationId = settingsAction.payload.settings.hasOwnProperty('org_id')
                    ? settingsAction.payload.settings['org_id']
                    : null;
                if (organizationId !== organizationsAction.payload.id) {
                    return new fromOrganizationsActions.OrganizationsCurrentChangeFailureAction(new Error('Organization wasn\'t changed'));
                } else {
                    return new fromOrganizationsActions.OrganizationsCurrentChangeSuccessAction(organizationsAction.payload);
                }
            }))
        )
    );

    @Effect() organizationsCreateInit$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromOrganizationsActions.OrganizationsActionType.OrganizationsCreateInit,
            fromOrganizationsActions.OrganizationsActionType.OrganizationsCreateFailure,
        ),
        switchMap((action: fromOrganizationsActions.OrganizationsCreateInitAction
            | fromOrganizationsActions.OrganizationsCreateFailureAction) => {
            if (action.type === fromOrganizationsActions.OrganizationsActionType.OrganizationsCreateInit) {
                return this.ds.createOrganization(action.payload).pipe(
                    map(organization => new fromOrganizationsActions.OrganizationsCreateSuccessAction(organization)),
                    catchError(error => of(new fromOrganizationsActions.OrganizationsCreateFailureAction(error)))
                );
            } else {
                return of();
            }
        })
    );

    @Effect() organizationsConnectInit$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrganizationsActions.OrganizationsActionType.OrganizationsConnectInit),
        switchMap((action: fromOrganizationsActions.OrganizationsConnectInitAction) => {
            return this.ds.connectToOrganization(action.payload.id).pipe(
                map(organization => new fromOrganizationsActions.OrganizationsConnectSuccessAction(organization)),
                catchError(error => of(new fromOrganizationsActions.OrganizationsConnectFailureAction(error)))
            );
        })
    );

    @Effect() organizationsDisconnectInit$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrganizationsActions.OrganizationsActionType.OrganizationsDisconnectInit),
        switchMap((action: fromOrganizationsActions.OrganizationsDisconnectInitAction) => {
            return this.ds.disconnectFromOrganization(action.payload.id).pipe(
                map(organization => new fromOrganizationsActions.OrganizationsDisconnectSuccessAction(organization)),
                catchError(error => of(new fromOrganizationsActions.OrganizationsDisconnectFailureAction(error)))
            );
        })
    );
}
