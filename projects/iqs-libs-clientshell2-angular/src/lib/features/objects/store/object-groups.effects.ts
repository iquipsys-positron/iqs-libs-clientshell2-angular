import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { IqsObjectGroupsDataService } from '../services/object-groups.data.service';
import * as actionsFromOg from './object-groups.actions';

@Injectable()
export class ObjectGroupsEffects {
    constructor(
        private actions$: Actions,
        private ds: IqsObjectGroupsDataService,
    ) { }

    @Effect() objectGroups$: Observable<Action> = this.actions$.pipe(
        ofType(
            actionsFromOg.ObjectGroupsActionType.ObjectGroupsInit,
            actionsFromOg.ObjectGroupsActionType.ObjectGroupsAbort
        ),
        switchMap((action: actionsFromOg.ObjectGroupsInitAction | actionsFromOg.ObjectGroupsAbortAction) => {
            if (action.type !== actionsFromOg.ObjectGroupsActionType.ObjectGroupsAbort) {
                return this.ds.readObjectGroups()
                    .pipe(
                        map(groups => new actionsFromOg.ObjectGroupsSuccessAction({ groups })),
                        catchError(error => of(new actionsFromOg.ObjectGroupsFailureAction({ error })))
                    );
            } else {
                return of();
            }
        })
    );
}
