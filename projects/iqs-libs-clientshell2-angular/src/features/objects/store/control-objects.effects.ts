import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { IqsControlObjectsDataService } from '../services/control-objects.data.service';
import * as actionsFromCo from './control-objects.actions';

@Injectable()
export class ControlObjectsEffects {
    constructor(
        private actions$: Actions,
        private ds: IqsControlObjectsDataService,
    ) { }

    @Effect() controlObjects$: Observable<Action> = this.actions$.pipe(
        ofType(
            actionsFromCo.ControlObjectsActionType.ControlObjectsInit,
            actionsFromCo.ControlObjectsActionType.ControlObjectsAbort
        ),
        switchMap((action: actionsFromCo.ControlObjectsInitAction | actionsFromCo.ControlObjectsAbortAction) => {
            if (action.type !== actionsFromCo.ControlObjectsActionType.ControlObjectsAbort) {
                return this.ds.readObjects()
                    .pipe(
                        map(objects => new actionsFromCo.ControlObjectsSuccessAction({ objects })),
                        catchError(error => of(new actionsFromCo.ControlObjectsFailureAction({ error })))
                    );
            } else {
                return of();
            }
        })
    );
}
