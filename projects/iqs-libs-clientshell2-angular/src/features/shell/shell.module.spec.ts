import { TestBed } from '@angular/core/testing';
import merge from 'lodash/merge';

import { ShellConfig, defaultShellConfig } from './models/index';
import { IqsShellService } from './services/shell.service';
import { IqsShellModule } from './shell.module';
import { AuthGuard, IqsSessionService } from '../session/index';

describe('ShellModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IqsShellModule]
    });
  });

  it(`should not provide 'AuthGuard' service`, () => {
    expect(() => TestBed.get(AuthGuard)).toThrowError(/No provider for/);
  });

  it(`should not provide 'SessionService' service`, () => {
    expect(() => TestBed.get(IqsSessionService)).toThrowError(/No provider for/);
  });

  it(`should not provide 'ShellService' service`, () => {
    expect(() => TestBed.get(IqsShellService)).toThrowError(/No provider for/);
  });
});

describe('ShellModule.forRoot()', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IqsShellModule.forRoot()]
    });
  });

  it(`should provide 'AuthGuard' service`, () => {
    expect(() => TestBed.get(AuthGuard)).toBeTruthy();
  });

  it(`should provide 'SessionService' service`, () => {
    expect(() => TestBed.get(IqsSessionService)).toBeTruthy();
  });

  it(`should provide 'ShellService' service`, () => {
    expect(() => TestBed.get(IqsShellService)).toBeTruthy();
  });
});

describe('ShellModule.forRoot() with config', () => {
  const config: ShellConfig = {
    shadows: {
      top: false
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IqsShellModule.forRoot({ shell: config })]
    });
  });

  it(`should provide 'ShellService' with config`, () => {
    const service: IqsShellService = TestBed.get(IqsShellService);
    const expectedConfig = merge({}, defaultShellConfig, config);
    expect(service.getConfig()).toEqual(expectedConfig);
  });
});
