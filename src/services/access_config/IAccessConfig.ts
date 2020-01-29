export class StateAccessAllow {
    [key: string]: number; // access level from AccessRole
}

export class AccessConfigure {
    public config: any;
    public access: any;
}

export class StateAccessConfigure {
    [key: string]: AccessConfigure; // access level from AccessRole
}

export interface IAccessConfigService {
    statesAccess: StateAccessAllow;
    statesConfigure: StateAccessConfigure;
    noAccessState: string;
    role: string;
    roleLevel: number;
    setRole(): void;    
    getStateAccess(stateName: string): number;
    getStateAccessAllow(stateName: string): boolean;
    getStateConfigureParamAccess(stateName: string, paramName): AccessConfigure;
    getStateConfigure(stateName?: string): AccessConfigure;
}

export interface IAccessConfigProvider {
    noAccessState: string;
    registerStateAccess(stateName: string, accessLevel: number): void;
    registerStateConfigure(stateName: string, config: any): void;
}

