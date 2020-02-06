import { Action } from '@ngrx/store';

import { Zone } from '../models/index';

export enum ZonesActionType {
    ZonesInit = '[Zones] Init',
    ZonesAbort = '[Zones] Abort',
    ZonesSuccess = '[Zones] Success',
    ZonesFailure = '[Zones] Failure',
}

export class ZonesInitAction implements Action {
    readonly type = ZonesActionType.ZonesInit;

    constructor() { }
}

export class ZonesAbortAction implements Action {
    readonly type = ZonesActionType.ZonesAbort;

    constructor() { }
}

export class ZonesSuccessAction implements Action {
    readonly type = ZonesActionType.ZonesSuccess;

    constructor(public payload: {
        zones: Zone[]
    }) { }
}

export class ZonesFailureAction implements Action {
    readonly type = ZonesActionType.ZonesFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export type ZonesAction =
    ZonesInitAction
    | ZonesAbortAction
    | ZonesSuccessAction
    | ZonesFailureAction;
