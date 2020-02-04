import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { IqsCurrentObjectStatesDataService } from '../services/current-object-states.data.service';
import * as actionsFromCos from './current-object-states.actions';

@Injectable()
export class CurrentObjectStatesEffects {
    constructor(
        private actions$: Actions,
        private ds: IqsCurrentObjectStatesDataService,
    ) { }

    @Effect() currentObjectStates$: Observable<Action> = this.actions$.pipe(
        ofType(
            actionsFromCos.CurrentObjectStatesActionType.CurrentObjectStatesInit,
            actionsFromCos.CurrentObjectStatesActionType.CurrentObjectStatesAbort
        ),
        switchMap((action: actionsFromCos.CurrentObjectStatesInitAction | actionsFromCos.CurrentObjectStatesAbortAction) => {
            if (action.type !== actionsFromCos.CurrentObjectStatesActionType.CurrentObjectStatesAbort) {
                return this.ds.readCurrentObjectStates()
                    .pipe(
                        map(states => new actionsFromCos.CurrentObjectStatesSuccessAction({ states })),
                        catchError(error => of(new actionsFromCos.CurrentObjectStatesFailureAction({ error })))
                    );
            } else {
                return of();
            }
        })
    );
}
