import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, filter, concatMap } from 'rxjs/operators';

import { IqsApplicationsDataService } from '../services/applications.data.service';
import { ApplicationTile } from '../models/ApplicationTile';
import * as actionsFromApplications from './applications.actions';
import { SettingsActionType, SettingsUpdateSuccessAction, SettingsUpdateFailureAction } from '../../settings/store/settings.actions';

@Injectable()
export class ApplicationsEffects {
    constructor(
        private actions$: Actions,
        private applicationsDataService: IqsApplicationsDataService,
    ) { }

    @Effect() applications$: Observable<Action> = this.actions$.pipe(
        ofType(
            actionsFromApplications.ApplicationsActionType.ApplicationsInit,
            actionsFromApplications.ApplicationsActionType.ApplicationsAbort
        ),
        switchMap((action: actionsFromApplications.ApplicationsInitAction | actionsFromApplications.ApplicationsAbortAction) => {
            if (action.type !== actionsFromApplications.ApplicationsActionType.ApplicationsAbort) {
                return this.applicationsDataService.readApplications()
                    .pipe(
                        map((applications: ApplicationTile[]) => {
                            for (const app of applications) {
                                app.isFavorite = action.favorites.includes(app.id);
                                app.isHidden = false;
                            }
                            return new actionsFromApplications.ApplicationsSuccessAction(applications, action.config);
                        }),
                        catchError(error => of(new actionsFromApplications.ApplicationsFailureAction(error)))
                    );
            } else {
                return of();
            }
        })
    );

    @Effect() applicationsSuccess$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromApplications.ApplicationsActionType.ApplicationsSuccess),
        map((action: actionsFromApplications.ApplicationsSuccessAction) => {
            if (action.payload && action.payload.length > 0) {
                return new actionsFromApplications.ApplicationsDataAction(action.payload, action.config);
            } else {
                return new actionsFromApplications.ApplicationsEmptyAction();
            }
        })
    );

    @Effect() applicationToggleFavoutite$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromApplications.ApplicationsActionType.ApplicationsToggleFavorite),
        concatMap((toggleAction: actionsFromApplications.ApplicationsToggleFavoriteAction) => {
            return this.actions$.pipe(
                ofType(SettingsActionType.SettingsUpdateSuccess, SettingsActionType.SettingsUpdateFailure),
                filter((settingsAction: SettingsUpdateSuccessAction | SettingsUpdateFailureAction) =>
                    toggleAction.payload.rid === settingsAction.payload.rid
                ),
                take(1),
                map((settingsAction: SettingsUpdateSuccessAction | SettingsUpdateFailureAction) => {
                    return settingsAction.type === SettingsActionType.SettingsUpdateSuccess
                        ? new actionsFromApplications.ApplicationsToggleFavoriteSuccessAction()
                        : new actionsFromApplications.ApplicationsToggleFavoriteFailureAction({
                            error: settingsAction.payload.error,
                            ...toggleAction.payload
                        });
                })
            );
        })
    );
}
