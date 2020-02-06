export interface ISessionConfigLsKeys {
    session: string;
    serverUrl: string;
}

export class SessionConfig {
    autorizedUrl?: string;
    unautorizedUrl?: string;
    serverUrl?: string;
    lsKeys?: ISessionConfigLsKeys;
}

export const defaultSessionConfig: SessionConfig = <SessionConfig>{
    autorizedUrl: '/home/index.html',
    unautorizedUrl: '/entry/index.html#/signin',
    serverUrl: '/',
    lsKeys: {
        session: 'session',
        serverUrl: 'serverUrl'
    }
};
