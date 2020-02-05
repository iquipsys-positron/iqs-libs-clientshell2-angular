import { TestBed } from '@angular/core/testing';
import { cloneDeep } from 'lodash';

import { ShellConfig, defaultShellConfig } from '../models/index';
import { IqsShellService } from './shell.service';
import { SHELL_MERGED_CONFIG, mockShellModuleConfig } from '../tokens';
import { IqsConfigService } from './config.service';

describe('ShellService', () => {
    let service: IqsShellService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: SHELL_MERGED_CONFIG,
                    useValue: mockShellModuleConfig
                },
                IqsConfigService,
                IqsShellService
            ]
        });
        service = TestBed.get(IqsShellService);
    });

    it('should subscribe to a config$', (done) => {
        service.config$.subscribe(config => {
            expect(config).toEqual(defaultShellConfig);
            done();
        });
    });

    it('should get config', () => {
        expect(service.getConfig()).toEqual(defaultShellConfig);
    });

    it('should modify config', () => {
        const newConfig: ShellConfig = cloneDeep(defaultShellConfig);
        newConfig.shadows.left = false;
        service.setConfig(newConfig);
        expect(newConfig).toEqual(service.getConfig());
        const altConfig = { shadows: { left: false } };
        service.setConfig(defaultShellConfig);
        service.setConfig(altConfig);
        expect(newConfig).toEqual(service.getConfig());
    });

    it('should set shadows', () => {
        const keys = Object.keys(defaultShellConfig.shadows);
        for (const key of keys) {
            service.setConfig(defaultShellConfig);
            const shadows = { [key]: false };
            service.setShadows(shadows);
            for (const k2 of keys) {
                if (shadows.hasOwnProperty(k2)) { continue; }
                shadows[k2] = true;
            }
            expect(service.getConfig().shadows).toEqual(shadows);
        }
    });
});
