import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageModule } from 'angular-2-local-storage';
import { CookieService } from 'ngx-cookie-service';

import { IqsNotFoundPagePageComponent } from './not-found-page.component';
import { IqsNotFoundPageModule } from './not-found-page.module';
import { SESSION_CONFIG, DEFAULT_SESSION_CONFIG, IqsSessionConfigService } from '../../../session/index';
import { WINDOW_PROVIDERS } from '../../../../common/services/window.service';

describe('NotFoundPageComponent', () => {
    let component: IqsNotFoundPagePageComponent;
    let fixture: ComponentFixture<IqsNotFoundPagePageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                IqsNotFoundPageModule,
                RouterModule.forRoot([]),
                TranslateModule.forRoot(),
                LocalStorageModule.withConfig({
                    prefix: 'iqs-clients2',
                    storageType: 'localStorage'
                }),
            ],
            providers: [
                CookieService,
                IqsSessionConfigService,
                {
                    provide: SESSION_CONFIG,
                    useValue: DEFAULT_SESSION_CONFIG
                },
                WINDOW_PROVIDERS
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqsNotFoundPagePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
