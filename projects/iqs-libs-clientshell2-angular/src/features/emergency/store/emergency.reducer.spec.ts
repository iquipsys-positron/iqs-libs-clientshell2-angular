import cloneDeep from 'lodash/cloneDeep';
import sample from 'lodash/sample';

import * as fromEmergencyActions from './emergency.actions';
import { emergencyReducer, emergencyInitialState } from './emergency.reducer';
import { EntityState } from '../../../common/models/index';
import { emergencyPlans, resetToCurrentDefault } from '../../../../mock/src/public_api';

describe('[Emergency] store/reducer', () => {

    const joc = jasmine.objectContaining;

    beforeEach(() => {
        resetToCurrentDefault();
    });

    it('should have initial state', () => {
        expect(emergencyReducer(undefined, <fromEmergencyActions.EmergencyAction>{ type: null })).toEqual(emergencyInitialState);
        expect(emergencyReducer(emergencyInitialState,
            <fromEmergencyActions.EmergencyAction>{ type: null })).toEqual(emergencyInitialState);
    });

    it('should reduce emergency read states', () => {
        expect(emergencyReducer({ ...emergencyInitialState, error: 'error' },
            new fromEmergencyActions.EmergencyInitAction()))
            .toEqual(joc({ state: EntityState.Progress, error: null }));
        expect(emergencyReducer({ ...emergencyInitialState, error: 'error' },
            new fromEmergencyActions.EmergencySuccessAction({ plans: emergencyPlans })))
            .toEqual(joc({ state: EntityState.Data, error: null, plans: emergencyPlans }));
        expect(emergencyReducer(emergencyInitialState,
            new fromEmergencyActions.EmergencyFailureAction({ error: 'error' })))
            .toEqual(joc({ state: EntityState.Error, error: 'error' }));
    });

    it('should reduce emergency create states', () => {
        const plan = cloneDeep(sample(emergencyPlans));
        delete plan.id;
        plan.name = 'test';
        expect(emergencyReducer({ ...emergencyInitialState, error: 'error' },
            new fromEmergencyActions.EmergencyCreateInitAction({ plan })
        )).toEqual(joc({ state: EntityState.Progress, error: null }));
        expect(emergencyReducer({ ...emergencyInitialState, error: 'error' },
            new fromEmergencyActions.EmergencyCreateSuccessAction({ plan })
        )).toEqual(joc({ state: EntityState.Data, error: null, plans: [plan] }));
        expect(emergencyReducer(emergencyInitialState,
            new fromEmergencyActions.EmergencyCreateFailureAction({ error: 'error' })
        )).toEqual(joc({ state: EntityState.Error, error: 'error' }));
    });

    it('should reduce emergency update states', () => {
        const planSource = cloneDeep(sample(emergencyPlans));
        const planDest = cloneDeep(planSource);
        planDest.name = 'test';
        expect(emergencyReducer({ ...emergencyInitialState, error: 'error', plans: [planSource] },
            new fromEmergencyActions.EmergencyUpdateInitAction({ plan: planDest })
        )).toEqual(joc({ state: EntityState.Progress, error: null }));
        expect(emergencyReducer({ ...emergencyInitialState, error: 'error', plans: [planSource] },
            new fromEmergencyActions.EmergencyUpdateSuccessAction({ plan: planDest })
        )).toEqual(joc({ state: EntityState.Data, error: null, plans: [planDest] }));
        expect(emergencyReducer(emergencyInitialState,
            new fromEmergencyActions.EmergencyUpdateFailureAction({ error: 'error' })
        )).toEqual(joc({ state: EntityState.Error, error: 'error' }));
    });

    it('should reduce emergency delete states', () => {
        const plan = cloneDeep(sample(emergencyPlans));
        const plan2 = cloneDeep(plan);
        plan.id = '11';
        expect(emergencyReducer({ ...emergencyInitialState, error: 'error' },
            new fromEmergencyActions.EmergencyDeleteInitAction({ planId: plan.id })
        )).toEqual(joc({ state: EntityState.Progress, error: null }));
        expect(emergencyReducer({ ...emergencyInitialState, error: 'error', plans: [plan, plan2] },
            new fromEmergencyActions.EmergencyDeleteSuccessAction({ planId: plan.id })
        )).toEqual(joc({ state: EntityState.Data, error: null, plans: [plan2] }));
        expect(emergencyReducer({ ...emergencyInitialState, error: 'error', plans: [plan] },
            new fromEmergencyActions.EmergencyDeleteSuccessAction({ planId: plan.id })
        )).toEqual(joc({ state: EntityState.Empty, error: null, plans: [] }));
        expect(emergencyReducer(emergencyInitialState,
            new fromEmergencyActions.EmergencyDeleteFailureAction({ error: 'error' })
        )).toEqual(joc({ state: EntityState.Error, error: 'error' }));
    });
});
