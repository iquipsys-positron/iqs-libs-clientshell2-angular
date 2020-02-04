import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material';
import { mockProviders } from '@iquipsys/iqs-clients2-shell/mock';

import { IqsSendSignalDialogComponent } from './send-signal-dialog.component';
import { IqsShellModule } from '../../shell.module';

describe('SendSignalDialogComponent', () => {
    let component: IqsSendSignalDialogComponent;
    let fixture: ComponentFixture<IqsSendSignalDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,

                IqsShellModule.forRoot(),
            ],
            providers: [
                mockProviders,
                {
                    provide: MatDialogRef,
                    useValue: { close: () => { } }
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqsSendSignalDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
