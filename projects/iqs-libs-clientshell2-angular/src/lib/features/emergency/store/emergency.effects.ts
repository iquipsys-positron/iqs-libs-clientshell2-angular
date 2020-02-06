import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { IqsEmergencyDataService } from '../services/emergency.data.service';
import { EmergencyPlan } from '../models/index';
import * as actionsFromEmergency from './emergency.actions';

@Injectable()
export class EmergencyEffects {
    constructor(
        private actions$: Actions,
        private emergencyData: IqsEmergencyDataService,
    ) { }

    @Effect() read$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromEmergency.EmergencyActionType.EmergencyInit),
        switchMap((action: actionsFromEmergency.EmergencyInitAction) => {
            return this.emergencyData.readEmergencyPlans()
                .pipe(
                    map((plans: EmergencyPlan[]) => new actionsFromEmergency.EmergencySuccessAction({ plans })),
                    catchError(error => of(new actionsFromEmergency.EmergencyFailureAction({ error })))
                );
        })
    );

    @Effect() create$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromEmergency.EmergencyActionType.EmergencyCreateInit),
        switchMap((action: actionsFromEmergency.EmergencyCreateInitAction) => {
            return this.emergencyData.createEmergencyPlan(action.payload.plan)
                .pipe(
                    map(plan => new actionsFromEmergency.EmergencyCreateSuccessAction({ plan })),
                    catchError(error => of(new actionsFromEmergency.EmergencyCreateFailureAction({ error })))
                );
        })
    );

    @Effect() update$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromEmergency.EmergencyActionType.EmergencyUpdateInit),
        switchMap((action: actionsFromEmergency.EmergencyUpdateInitAction) => {
            return this.emergencyData.updateEmergencyPlan(action.payload.plan.id, action.payload.plan)
                .pipe(
                    map(plan => new actionsFromEmergency.EmergencyUpdateSuccessAction({ plan })),
                    catchError(error => of(new actionsFromEmergency.EmergencyUpdateFailureAction({ error })))
                );
        })
    );

    @Effect() delete$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromEmergency.EmergencyActionType.EmergencyDeleteInit),
        switchMap((action: actionsFromEmergency.EmergencyDeleteInitAction) => {
            return this.emergencyData.deleteEmergencyPlan(action.payload.planId)
                .pipe(
                    map(planId => new actionsFromEmergency.EmergencyDeleteSuccessAction({ planId })),
                    catchError(error => of(new actionsFromEmergency.EmergencyDeleteFailureAction({ error })))
                );
        })
    );
}
