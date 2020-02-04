import { InjectionToken } from '@angular/core';

export interface ISessionConfigLsKeys {
    session: string;
    serverUrl: string;
}

export class SessionConfig {
    public autorizedUrl: string;
    public unautorizedUrl: string;
    public serverUrl: string;
    public lsKeys: ISessionConfigLsKeys;
}

export const SESSION_CONFIG = new InjectionToken<SessionConfig>('Session Config');

// export const defaultSessionConfig: SessionConfig = <SessionConfig>{
//     autorizedUrl: '/home/index.html',
//     unautorizedUrl: '/entry/index.html#/signin',
//     serverUrl: '/',
//     lsKeys: {
//         session: 'session',
//         serverUrl: 'serverUrl'
//     }
// };
