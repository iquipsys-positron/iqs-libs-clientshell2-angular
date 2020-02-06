import { Action } from '@ngrx/store';

import { ObjectState } from '../models/index';

export enum CurrentObjectStatesActionType {
    CurrentObjectStatesInit = '[CurrentObjectStates] Init',
    CurrentObjectStatesAbort = '[CurrentObjectStates] Abort',
    CurrentObjectStatesSuccess = '[CurrentObjectStates] Success',
    CurrentObjectStatesFailure = '[CurrentObjectStates] Failure',
}

export class CurrentObjectStatesInitAction implements Action {
    readonly type = CurrentObjectStatesActionType.CurrentObjectStatesInit;

    constructor() { }
}

export class CurrentObjectStatesAbortAction implements Action {
    readonly type = CurrentObjectStatesActionType.CurrentObjectStatesAbort;

    constructor() { }
}

export class CurrentObjectStatesSuccessAction implements Action {
    readonly type = CurrentObjectStatesActionType.CurrentObjectStatesSuccess;

    constructor(public payload: {
        states: ObjectState[]
    }) { }
}

export class CurrentObjectStatesFailureAction implements Action {
    readonly type = CurrentObjectStatesActionType.CurrentObjectStatesFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export type CurrentObjectStatesAction =
    CurrentObjectStatesInitAction
    | CurrentObjectStatesAbortAction
    | CurrentObjectStatesSuccessAction
    | CurrentObjectStatesFailureAction;
