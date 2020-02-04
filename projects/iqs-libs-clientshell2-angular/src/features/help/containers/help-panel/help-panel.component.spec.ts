import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IqsHelpPanelComponent } from './help-panel.component';

describe('HelpPanelComponent', () => {
    let component: IqsHelpPanelComponent;
    let fixture: ComponentFixture<IqsHelpPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IqsHelpPanelComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqsHelpPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
