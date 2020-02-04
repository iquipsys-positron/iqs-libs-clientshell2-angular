import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { IqsZonesDataService } from '../services/zones.data.service';
import * as actionsFromZones from './zones.actions';

@Injectable()
export class ZonesEffects {
    constructor(
        private actions$: Actions,
        private ds: IqsZonesDataService,
    ) { }

    @Effect() Zones$: Observable<Action> = this.actions$.pipe(
        ofType(
            actionsFromZones.ZonesActionType.ZonesInit,
            actionsFromZones.ZonesActionType.ZonesAbort
        ),
        switchMap((action: actionsFromZones.ZonesInitAction | actionsFromZones.ZonesAbortAction) => {
            if (action.type !== actionsFromZones.ZonesActionType.ZonesAbort) {
                return this.ds.readZones()
                    .pipe(
                        map(zones => new actionsFromZones.ZonesSuccessAction({ zones })),
                        catchError(error => of(new actionsFromZones.ZonesFailureAction({ error })))
                    );
            } else {
                return of();
            }
        })
    );
}
