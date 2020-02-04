import { TestBed } from '@angular/core/testing';

import { IqsEmergencyPanelService } from './emergency-panel.service';
import { SHELL_CONFIG, defaultShellConfig } from '../../shell/models/ShellConfig';
import { IqsShellService } from '../../shell/services/shell.service';

describe('EmergencyPanelService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            IqsShellService,
            {
                provide: SHELL_CONFIG,
                useValue: defaultShellConfig
            }
        ]
    }));

    it('should be created', () => {
        const service: IqsEmergencyPanelService = TestBed.get(IqsEmergencyPanelService);
        expect(service).toBeTruthy();
    });
});
