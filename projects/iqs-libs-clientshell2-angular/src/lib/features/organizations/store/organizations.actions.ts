import { Action } from '@ngrx/store';

import { Organization } from '../models/index';

export enum OrganizationsActionType {
    OrganizationsInit = '[Organizations] Init',
    OrganizationsAbort = '[Organizations] Abort',
    OrganizationsSuccess = '[Organizations] Success',
    OrganizationsFailure = '[Organizations] Failure',
    OrganizationsData = '[Organizations] Data',
    OrganizationsEmpty = '[Organizations] Empty',
    OrganizationsCurrent = '[Organizations] Current',
    OrganizationsCurrentChangeInit = '[Organizations] CurrentChangeInit',
    OrganizationsCurrentChangeAbort = '[Organizations] CurrentChangeAbort',
    OrganizationsCurrentChangeSettings = '[Organizations] CurrentChangeSettings',
    OrganizationsCurrentChangeSuccess = '[Organizations] CurrentChangeSuccess',
    OrganizationsCurrentChangeFailure = '[Organizations] CurrentChangeFailure',
    OrganizationsCreateInit = '[Organizations] CreateInit',
    OrganizationsCreateAbort = '[Organizations] CreateAbort',
    OrganizationsCreateSuccess = '[Organizations] CreateSuccess',
    OrganizationsCreateFailure = '[Organizations] CreateFailure',
    OrganizationsConnectInit = '[Organizations] ConnectInit',
    OrganizationsConnectSuccess = '[Organizations] ConnectSuccess',
    OrganizationsConnectFailure = '[Organizations] ConnectFailure',
    OrganizationsDisconnectInit = '[Organizations] DisconnectInit',
    OrganizationsDisconnectSuccess = '[Organizations] DisconnectSuccess',
    OrganizationsDisconnectFailure = '[Organizations] DisconnectFailure',
}

export class OrganizationsInitAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsInit;

    constructor() { }
}

export class OrganizationsAbortAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsAbort;

    constructor() { }
}

export class OrganizationsSuccessAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsSuccess;

    constructor(public payload: Organization[]) { }
}

export class OrganizationsFailureAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsFailure;

    constructor(public payload: any) { }
}

export class OrganizationsDataAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsData;

    constructor(public payload: Organization[]) { }
}

export class OrganizationsEmptyAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsEmpty;

    constructor() { }
}

export class OrganizationsCurrentAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsCurrent;

    constructor(public payload: Organization) { }
}

export class OrganizationsCurrentChangeInitAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsCurrentChangeInit;

    constructor(public payload: Organization) { }
}

export class OrganizationsCurrentChangeAbortAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsCurrentChangeAbort;

    constructor() { }
}

export class OrganizationsCurrentChangeSettingsAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsCurrentChangeSettings;

    constructor(public payload: Organization) { }
}

export class OrganizationsCurrentChangeSuccessAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsCurrentChangeSuccess;

    constructor(public payload: Organization) { }
}

export class OrganizationsCurrentChangeFailureAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsCurrentChangeFailure;

    constructor(public payload: any) { }
}

export class OrganizationsCreateInitAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsCreateInit;

    constructor(public payload: Organization) {}
}

export class OrganizationsCreateAbortAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsCreateAbort;

    constructor() {}
}

export class OrganizationsCreateSuccessAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsCreateSuccess;

    constructor(public payload: Organization) {}
}

export class OrganizationsCreateFailureAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsCreateFailure;

    constructor(public payload: any) {}
}

export class OrganizationsConnectInitAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsConnectInit;

    constructor(public payload: Organization) { }
}

export class OrganizationsConnectSuccessAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsConnectSuccess;

    constructor(public payload: Organization) { }
}

export class OrganizationsConnectFailureAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsConnectFailure;

    constructor(public payload: any) { }
}

export class OrganizationsDisconnectInitAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsDisconnectInit;

    constructor(public payload: Organization) { }
}

export class OrganizationsDisconnectSuccessAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsDisconnectSuccess;

    constructor(public payload: Organization) { }
}

export class OrganizationsDisconnectFailureAction implements Action {
    readonly type = OrganizationsActionType.OrganizationsDisconnectFailure;

    constructor(public payload: any) { }
}



export type OrganizationsAction = OrganizationsInitAction
    | OrganizationsAbortAction
    | OrganizationsSuccessAction
    | OrganizationsFailureAction
    | OrganizationsDataAction
    | OrganizationsEmptyAction
    | OrganizationsCurrentAction
    | OrganizationsCurrentChangeInitAction
    | OrganizationsCurrentChangeAbortAction
    | OrganizationsCurrentChangeSettingsAction
    | OrganizationsCurrentChangeSuccessAction
    | OrganizationsCurrentChangeFailureAction
    | OrganizationsCreateInitAction
    | OrganizationsCreateAbortAction
    | OrganizationsCreateSuccessAction
    | OrganizationsCreateFailureAction
    | OrganizationsConnectInitAction
    | OrganizationsConnectSuccessAction
    | OrganizationsConnectFailureAction
    | OrganizationsDisconnectInitAction
    | OrganizationsDisconnectSuccessAction
    | OrganizationsDisconnectFailureAction;
