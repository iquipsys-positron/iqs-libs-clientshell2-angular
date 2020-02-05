import { HttpClientModule } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';
import { cloneDeep } from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { Subscription, of, throwError } from 'rxjs';

import { IqsSessionService } from './session.service';
import { IqsSessionConfigService } from './session.config.service';
import { IqsSessionDataService } from './session.data.service';
import { SessionAuthInterceptorProvider } from '../http-interceptors/auth.interceptor';
import { Session, SignupUser, User } from '../models/index';
import { users, utils, mockSessionProvider, MockSessionService } from '../../../../mock/src/public_api';
import { IqsConfigService } from '../../shell/services/config.service';
import { mockShellModuleConfig, SHELL_MERGED_CONFIG } from '../../shell/tokens';

describe('[Session] session.data.service', () => {

    let service: IqsSessionDataService;
    let sessionService: MockSessionService;
    let subs: Subscription;
    let user: User;
    let session: Session;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                RouterModule.forRoot([]),

                LocalStorageModule.withConfig({
                    prefix: 'iqs-clients2',
                    storageType: 'localStorage'
                })
            ],
            providers: [
                SessionAuthInterceptorProvider,
                CookieService,
                IqsSessionConfigService,
                IqsConfigService,
                IqsSessionDataService,
                mockSessionProvider,
                {
                    provide: IqsSessionService,
                    useClass: MockSessionService
                },
                {
                    provide: SHELL_MERGED_CONFIG,
                    useValue: mockShellModuleConfig
                },
            ],
        })
            .compileComponents();
    });

    beforeEach(inject([IqsSessionService, IqsSessionDataService],
        (
            sessionsService: MockSessionService,
            sessionDataService: IqsSessionDataService,
        ) => {
            localStorage.clear();
            service = sessionDataService;
            sessionService = sessionsService;
            subs = new Subscription();
            user = users[0];
            session = utils.sessions.create(user);
        }));

    afterEach(() => {
        subs.unsubscribe();
    });

    afterAll(() => {
        localStorage.clear();
    });

    it('should signin', done => {
        subs.add(service.signin(user.login, user.password).subscribe(s => {
            expect(s).toBeTruthy();
            expect(s.user_id).toEqual(user.id);
            done();
        }));
    });

    it('shouldn\'t signin with bad data', done => {
        let count = 2;
        const subDone = () => {
            count--;
            if (!count) { done(); }
        };
        subs.add(service.signin('bad login', user.password).subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('WRONG_LOGIN'); subDone(); }
        ));
        subs.add(service.signin(user.login, 'bad password').subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('WRONG_PASSWORD'); subDone(); }
        ));
    });

    it('should signout', done => {
        sessionService.init(session);
        subs.add(service.signout().subscribe(res => {
            expect(res).toBeTruthy();
            done();
        }));
    });

    it('shouldn\'t signout', done => {
        subs.add(service.signout().subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('SESSION_CLOSE_ERROR'); done(); }
        ));
    });

    it('should signup with email only', done => {
        const newUser = <SignupUser>{
            email: 'new.user@mail.com',
            password: 'A1b2c3',
            name: 'Jhon Smith'
        };
        const sessionDataService: any = TestBed.get(IqsSessionDataService);
        const gotUser = utils.users.create({ id: 'test', login: newUser.email, settings: {}, ...newUser });
        const gotSession = utils.sessions.create(gotUser);
        spyOn(sessionDataService.httpBackend, 'post').and.returnValue(of(gotSession));
        subs.add(service.signup(newUser).subscribe(s => {
            expect(s.user).toBeTruthy();
            expect(s.user.login).toBe(newUser.email);
            expect(s.user.id).toBeTruthy();
            done();
        }));
    });

    it('should signup with login and email', done => {
        const newUser = <SignupUser>{
            login: 'new user2',
            email: 'new.user2@mail.com',
            password: 'A1b2c3',
            name: 'Jhon Smith'
        };
        const sessionDataService: any = TestBed.get(IqsSessionDataService);
        const gotUser = utils.users.create({ id: 'test', settings: {}, ...newUser });
        const gotSession = utils.sessions.create(gotUser);
        spyOn(sessionDataService.httpBackend, 'post').and.returnValue(of(gotSession));
        subs.add(service.signup(newUser).subscribe(s => {
            expect(s.user).toBeTruthy();
            expect(s.user.login).toBe(newUser.login);
            expect(s.user.id).toBeTruthy();
            done();
        }));
    });

    it('shouldn\'t signup', done => {
        const newUser = <SignupUser>{
            login: 'new user3',
            email: 'new.user3@mail.com',
            password: 'A1b2c3',
            name: 'Jhon Smith'
        };
        const sessionDataService: any = TestBed.get(IqsSessionDataService);
        spyOn(sessionDataService.httpBackend, 'post').and.returnValue(throwError({
            'code': 'WRONG_LOGIN',
            'status': 400,
            'name': 'WRONG_LOGIN',
            'details': {
                'login': newUser.login
            },
            'message': `Account ${newUser.login} already exists`,
        }));
        subs.add(service.signup(newUser).subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('WRONG_LOGIN'); done(); }
        ));
    });

    it('should restore', done => {
        sessionService.init(session);
        const sessionDataService: any = TestBed.get(IqsSessionDataService);
        spyOn(sessionDataService.httpBackend, 'post').and.returnValue(of(session));
        subs.add(service.restore(session.id).subscribe(s => {
            expect(s).toEqual(session);
            done();
        }));
    });

    it('shouldn\'t restore', done => {
        const badSession = cloneDeep(session);
        badSession.id = '11000000000000000000000000000011';
        const sessionDataService: any = TestBed.get(IqsSessionDataService);
        spyOn(sessionDataService.httpBackend, 'post').and.returnValue(throwError({
            'code': 'SESSION_NOT_FOUND_ERROR',
            'status': 400,
            'name': 'SESSION_NOT_FOUND_ERROR',
            'message': 'Session not found',
        }));
        subs.add(service.restore(badSession.id).subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('SESSION_NOT_FOUND_ERROR'); done(); }
        ));
    });

});
