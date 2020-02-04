// DO NOT DELETE "SessionConfig" from imports!
import { TEST_ENVIRONMENT, SESSION_CONFIG, SessionConfig, IqsSessionConfigService } from 'iqs-libs-clientshell2-angular';
import { APP_INITIALIZER } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { CookieService } from 'ngx-cookie-service';

import * as utils from './utility';
import { mockApplicationsProvider } from './applications';
import { mockCurrentObjectStatesProvider } from './current-object-states';
import { mockEmergencyPlansProvider } from './emergencyPlans';
import { mockNotificationsProvider } from './notifications';
import { mockObjectGroupsProvider } from './object-groups';
import { mockControlObjectsProvider } from './objects';
import { mockSessionProvider } from './session/interceptor';
import { mockSettingsProvider } from './settings';
import { mockOrganizationsProvider } from './organizations/interceptor';
import { mockUsersProvider } from './users/interceptor';
import { mockZonesProvider } from './zones';
import { MockInitService, mockInit } from './init.service';


export const mockProviders = [
    mockApplicationsProvider,
    mockCurrentObjectStatesProvider,
    mockEmergencyPlansProvider,
    mockNotificationsProvider,
    mockObjectGroupsProvider,
    mockControlObjectsProvider,
    mockSessionProvider,
    mockSettingsProvider,
    mockOrganizationsProvider,
    mockUsersProvider,
    mockZonesProvider,
    {
        provide: TEST_ENVIRONMENT,
        useValue: true
    },
];

export const mockServices = [
    MockInitService,
    {
        provide: APP_INITIALIZER,
        useFactory: mockInit,
        multi: true,
        deps: [MockInitService, LocalStorageService, SESSION_CONFIG, CookieService, IqsSessionConfigService]
    },
];

export const mockProvidersAndServices = [
    ...mockProviders,
    ...mockServices
];

//#region exports/providers
export { mockApplicationsProvider } from './applications';
export { mockEmergencyPlansProvider } from './emergencyPlans';
export { mockNotificationsProvider } from './notifications';
export * from './session/index';
export { mockSettingsProvider } from './settings';
export * from './organizations/index';
export * from './users/index';
//#endregion

export * from './init.service';
export * from './storage';
export { utils };
