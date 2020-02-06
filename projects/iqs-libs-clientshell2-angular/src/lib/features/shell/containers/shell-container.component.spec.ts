import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { sample } from 'lodash';
import { PipSidenavService, PipRightnavService } from 'pip-webui2-layouts';
import { Subscription } from 'rxjs';

import { IqsShellContainerComponent } from './shell-container.component';
import { IqsShellContainerModule } from './shell-container.module';
import { IqsShellModule } from '../shell.module';
import { RightnavState } from '../models/index';
import { IqsShellService } from '../services/index';
import { IqsSessionService } from '../../session/index';
import { IqsOrganizationsService } from '../../organizations/index';
import { users, utils, MockSessionService, MockOrganizationsService, mockProviders } from 'iqs-libs-clientshell2-angular/mock';

describe('[Shell] containers/shell-container.component', () => {

    let component: IqsShellContainerComponent;
    let element: HTMLElement;
    let fixture: ComponentFixture<IqsShellContainerComponent>;

    let subs: Subscription;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                RouterModule.forRoot([]),
                IqsShellModule.forRoot(),
                IqsShellContainerModule
            ],
            providers: [
                mockProviders,
                {
                    provide: IqsSessionService,
                    useClass: MockSessionService
                },
                {
                    provide: IqsOrganizationsService,
                    useClass: MockOrganizationsService
                }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(IqsShellContainerComponent);
        component = fixture.componentInstance;
        const sessionService: MockSessionService = TestBed.get(IqsSessionService);
        const organizationsService: MockOrganizationsService = TestBed.get(IqsOrganizationsService);
        spyOn(sessionService, 'restore').and.callThrough();
        const session = utils.sessions.create(users[0]);
        sessionService.init(session);
        organizationsService.init();
        fixture.detectChanges();
        element = fixture.nativeElement;
        subs = new Subscription();
    });

    afterEach(() => { subs.unsubscribe(); });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should destroy', () => {
        const subsSpy = spyOn((<any>component).subs, 'unsubscribe');
        component.ngOnDestroy();
        expect(subsSpy).toHaveBeenCalledTimes(1);
    });

    it('should open and close sidenav', async () => {
        const menuIcon: HTMLButtonElement = element.querySelector('pip-nav-icon button');
        const matSidenav: HTMLElement = element.querySelector('mat-sidenav.pip-sidenav');
        const sidenavService: PipSidenavService = TestBed.get(PipSidenavService);
        expect(sidenavService.opened).toBe(false);
        expect([matSidenav.style.visibility, matSidenav.style.boxShadow]).toEqual(['hidden', 'none']);
        menuIcon.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(sidenavService.opened).toBe(true);
        expect([matSidenav.style.visibility, matSidenav.style.boxShadow]).toEqual(['visible', '']);
        menuIcon.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(sidenavService.opened).toBe(false);
        expect([matSidenav.style.visibility, matSidenav.style.boxShadow]).toEqual(['hidden', 'none']);
    });

    it('should show organizations menu', () => {
        const organizationsButton: HTMLButtonElement = element.querySelector('.iqs-shell-organizations-button');
        expect(organizationsButton).toBeTruthy();
        const organizationsButtonText: HTMLElement = organizationsButton.querySelector('span span');
        const organizationsService: MockOrganizationsService = TestBed.get(IqsOrganizationsService);
        expect(organizationsButtonText.innerText).toEqual(organizationsService.current.name);
    });

    it('should open rightnav with emergency', async () => {
        // tslint:disable-next-line:max-line-length
        const emergencyButton: HTMLButtonElement = element.querySelector('pip-primary-actions .pip-action-emergency button mat-icon');
        const matRightnav: HTMLElement = element.querySelector('pip-root-layout mat-sidenav.pip-rightnav');
        const rightnavService: PipRightnavService = TestBed.get(PipRightnavService);
        const shellService: IqsShellService = TestBed.get(IqsShellService);
        expect([matRightnav.style.visibility, matRightnav.style.boxShadow]).toEqual(['hidden', 'none']);
        emergencyButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(rightnavService.opened).toBe(true);
        expect(matRightnav.style.visibility).toEqual('visible');
        expect(shellService.rightnavState).toEqual(RightnavState.Emergency);
        expect(shellService.rightnavShowBack).toBeFalsy();
        component.closeRightnav();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(rightnavService.opened).toBe(false);
        expect(matRightnav.style.visibility).toEqual('hidden');
    });

    it('should open rightnav with help', async () => {
        const helpButton: HTMLButtonElement = element.querySelector('pip-primary-actions .pip-action-help button mat-icon');
        const matRightnav: HTMLElement = element.querySelector('pip-root-layout mat-sidenav.pip-rightnav');
        const rightnavService: PipRightnavService = TestBed.get(PipRightnavService);
        const shellService: IqsShellService = TestBed.get(IqsShellService);
        expect([matRightnav.style.visibility, matRightnav.style.boxShadow]).toEqual(['hidden', 'none']);
        helpButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(rightnavService.opened).toBe(true);
        expect(matRightnav.style.visibility).toEqual('visible');
        expect(shellService.rightnavState).toEqual(RightnavState.Help);
        expect(shellService.rightnavShowBack).toBeFalsy();
        component.closeRightnav();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(rightnavService.opened).toBe(false);
        expect(matRightnav.style.visibility).toEqual('hidden');
    });

    it('should change current organization', () => {
        const sidenavService: PipSidenavService = TestBed.get(PipSidenavService);
        const organizationsService: MockOrganizationsService = TestBed.get(IqsOrganizationsService);
        sidenavService.toggleOpened();
        component.changeCurrentOrganization(sample(organizationsService
            .organizations.filter(s => s.name !== organizationsService.current.name)) as any);
        fixture.detectChanges();
        const organizationsSpan: HTMLElement = element.querySelector('.iqs-shell-organizations-button span span');
        expect(organizationsSpan.innerText).toEqual(organizationsService.current.name);
    });

});
