import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as fromSessionActions from './session.actions';
import { Session } from '../models/index';
import { IqsSessionDataService } from '../services/session.data.service';
import { IqsSessionConfigService } from '../services/session.config.service';
import { WINDOW, WindowWrapper } from '../../../common/services/window.service';

@Injectable()
export class SessionEffects {
    constructor(
        private actions$: Actions,
        @Inject(WINDOW) private window: WindowWrapper,
        private router: Router,
        private sessionConfigService: IqsSessionConfigService,
        private sessionDataService: IqsSessionDataService,
        private localStorageService: LocalStorageService,
    ) { }

    @Effect() SessionSigninInit$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromSessionActions.SessionActionType.SessionSigninInit,
            fromSessionActions.SessionActionType.SessionSigninAbort
        ),
        switchMap((action: any) => {
            if (action.type === fromSessionActions.SessionActionType.SessionSigninInit) {
                return this.sessionDataService.signin(action.login, action.password)
                    .pipe(
                        map(data => new fromSessionActions.SessionSigninSuccessAction(data)),
                        catchError(error => of(new fromSessionActions.SessionSigninFailureAction(error)))
                    );
            } else {
                return of();
            }
        })
    );

    @Effect() SessionSignoutInit$: Observable<Action> = this.actions$.pipe(
        ofType(
            fromSessionActions.SessionActionType.SessionSignoutInit,
            fromSessionActions.SessionActionType.SessionSignoutAbort
        ),
        switchMap((action: fromSessionActions.SessionSignoutInitAction | fromSessionActions.SessionSignoutAbortAction) => {
            if (action.type === fromSessionActions.SessionActionType.SessionSignoutInit) {
                return this.sessionDataService.signout().pipe(
                    map(() => new fromSessionActions.SessionSignoutSuccessAction()),
                    catchError(error => of(new fromSessionActions.SessionSignoutFailureAction(error)))
                );
            } else {
                return of();
            }
        })
    );

    @Effect() SessionRestoreInit$: Observable<Action> = this.actions$.pipe(
        ofType(fromSessionActions.SessionActionType.SessionRestoreInit),
        switchMap((action: fromSessionActions.SessionRestoreInitAction) => {
            return this.sessionDataService.restore(action.payload.session_id)
                .pipe(
                    map(data => new fromSessionActions.SessionRestoreSuccessAction({ session: data })),
                    catchError(error => of(new fromSessionActions.SessionRestoreFailureAction({ error })))
                );

        })
    );

    @Effect() SessionCloseAllInit$: Observable<Action> = this.actions$.pipe(
        ofType(fromSessionActions.SessionActionType.SessionCloseAllInit),
        switchMap((action: fromSessionActions.SessionCloseAllInitAction) => {
            return this.sessionDataService.closeAll()
                .pipe(
                    map(() => new fromSessionActions.SessionCloseAllSuccessAction()),
                    catchError(error => of(new fromSessionActions.SessionCloseAllFailureAction(error)))
                );
        })
    );

    @Effect({ dispatch: false }) SessionSaveSession$: Observable<void> = this.actions$.pipe(
        ofType(
            fromSessionActions.SessionActionType.SessionSigninSuccess,
            fromSessionActions.SessionActionType.SessionRestoreSuccess,
        ),
        map((action: any) => {
            if (action.type === fromSessionActions.SessionActionType.SessionRestoreSuccess) {
                this.saveSession(action.payload.session);
            } else {
                this.saveSession(action.payload);
            }
        })
    );

    @Effect({ dispatch: false }) SessionCloseSession$: Observable<void> = this.actions$.pipe(
        ofType(
            fromSessionActions.SessionActionType.SessionSignoutSuccess,
            fromSessionActions.SessionActionType.SessionRestoreFailure,
            fromSessionActions.SessionActionType.SessionCloseAllSuccess
        ),
        map((action: any) => {
            this.closeSession();
        })
    );

    @Effect({ dispatch: false }) SessionToAuthorizedUrl$: Observable<void> = this.actions$.pipe(
        ofType(fromSessionActions.SessionActionType.SessionSigninSuccess),
        map(() => {
            this.window.location.href = this.window.location.origin + this.sessionConfigService.autorizedUrl;
        })
    );

    @Effect({ dispatch: false }) SessionToUnauthorizedUrl$: Observable<void> = this.actions$.pipe(
        ofType(
            fromSessionActions.SessionActionType.SessionSignoutSuccess,
            fromSessionActions.SessionActionType.SessionRestoreFailure,
            fromSessionActions.SessionActionType.SessionCloseAllSuccess
        ),
        map((action: any) => {
            let url = this.window.location.origin + this.sessionConfigService.unautorizedUrl;
            if (action.type === fromSessionActions.SessionActionType.SessionRestoreFailure) {
                url += '?from=' + this.router.url;
            }
            this.window.location.href = url;
        })
    );

    private saveSession(session: Session): void {
        this.localStorageService.set(this.sessionConfigService.lsKeys.session, session);
    }

    private closeSession(): void {
        this.localStorageService.remove(this.sessionConfigService.lsKeys.session);
    }
}
