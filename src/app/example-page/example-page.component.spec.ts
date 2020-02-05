import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IqsShellModule } from 'iqs-libs-clientshell2-angular';

import { ExamplePageComponent } from './example-page.component';
import { ExamplePageModule } from './example-page.module';

describe('ExamplePageComponent', () => {
    let component: ExamplePageComponent;
    let fixture: ComponentFixture<ExamplePageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                TranslateModule.forRoot(),

                IqsShellModule.forRoot({
                    session: {
                        serverUrl: 'http://api.positron.stage.iquipsys.net:30018',
                        autorizedUrl: '/example'
                    }
                }),
                ExamplePageModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExamplePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
