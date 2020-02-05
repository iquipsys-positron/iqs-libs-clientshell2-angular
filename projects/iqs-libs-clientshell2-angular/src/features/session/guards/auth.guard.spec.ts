import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { CookieService } from 'ngx-cookie-service';

import { IqsSessionService } from '../services/session.service';
import { IqsSessionConfigService } from '../services/session.config.service';
import { users, utils, mockSessionProvider, MockSessionService } from '../../../../mock/src/public_api';

import { WINDOW, WindowWrapper } from '../../../common/services/window.service';
import { AuthGuard } from './auth.guard';
import { IqsConfigService } from '../../shell/services/config.service';
import { mockShellModuleConfig, ShellModuleConfig, SHELL_MERGED_CONFIG } from '../../shell/tokens';

@Component({
    selector: 'iqs-mock',
    template: '<div></div>',
})
export class MockComponent { }

describe('[Session] guards/auth', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MockComponent],
            imports: [
                RouterModule.forRoot([
                    { path: 'example', component: MockComponent, canActivate: [AuthGuard] },
                    { path: 'another', component: MockComponent },
                ]),
                LocalStorageModule.withConfig({
                    prefix: 'iqs-clients2',
                    storageType: 'localStorage'
                })
            ],
            providers: [
                AuthGuard,
                CookieService,
                IqsSessionConfigService,
                IqsConfigService,
                mockSessionProvider,
                {
                    provide: IqsSessionService,
                    useClass: MockSessionService
                },
                {
                    provide: SHELL_MERGED_CONFIG,
                    useValue: mockShellModuleConfig
                },
                {
                    provide: WINDOW,
                    useValue: {
                        location: {
                            origin: '',
                            href: ''
                        }
                    },
                }
            ],
        })
            .compileComponents();
    });

    it('should verify', async () => {
        const sessionService: MockSessionService = TestBed.get(IqsSessionService);
        const router: Router = TestBed.get(Router);
        const w: WindowWrapper = TestBed.get(WINDOW);
        const config: ShellModuleConfig = TestBed.get(SHELL_MERGED_CONFIG);
        expect(await router.navigate(['example'])).toBeFalsy();
        expect(w.location.href).toEqual(w.location.origin + config.session.unautorizedUrl + '?from=' + router.url);
        sessionService.init(utils.sessions.create(users[0]));
        expect(await router.navigate(['example'])).toBeTruthy();
    });

});
