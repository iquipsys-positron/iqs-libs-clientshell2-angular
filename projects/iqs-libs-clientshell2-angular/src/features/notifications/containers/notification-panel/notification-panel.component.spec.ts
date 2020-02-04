import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IqsNotificationPanelComponent } from './notification-panel.component';

describe('NotificationPanelComponent', () => {
    let component: IqsNotificationPanelComponent;
    let fixture: ComponentFixture<IqsNotificationPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IqsNotificationPanelComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqsNotificationPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
