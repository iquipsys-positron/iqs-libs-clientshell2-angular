import { Injectable, Inject } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import * as utils from './utility';
import { IqsSessionConfigService, WINDOW, WindowWrapper } from 'iqs-libs-clientshell2-angular';

import { MOCK_DATA_VERSION, resetToCurrentDefault } from './storage';

@Injectable()
export class MockInitService {

    constructor(
        private localStorage: LocalStorageService,
        private sessionConfig: IqsSessionConfigService,
        @Inject(WINDOW) private window: WindowWrapper
    ) { }

    init(): Promise<any> {
        return new Promise((resolve, reject) => {
            const dv = this.localStorage.get('dataVersion');
            if (dv !== MOCK_DATA_VERSION) {
                resetToCurrentDefault();
            }
            this.localStorage.set('dataVersion', MOCK_DATA_VERSION);
            const user = utils.users.find('test');
            const existing = this.localStorage.get(this.sessionConfig.lsKeys.session);
            if (!existing && this.window.location.href.startsWith('http://localhost')) {
                this.localStorage.set(this.sessionConfig.lsKeys.session, utils.sessions.create(user));
            }
            resolve();
        });
    }
}

export function mockInit(mis: MockInitService) {
    return () => mis.init();
}
