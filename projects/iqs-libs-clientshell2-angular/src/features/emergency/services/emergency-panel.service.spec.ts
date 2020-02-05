import { TestBed } from '@angular/core/testing';

import { IqsEmergencyPanelService } from './emergency-panel.service';
import { IqsShellService } from '../../shell/services/shell.service';
import { IqsConfigService } from '../../shell/services/config.service';
import { SHELL_MERGED_CONFIG, mockShellModuleConfig } from '../../shell/tokens';

describe('EmergencyPanelService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            IqsShellService,
            IqsConfigService,
            {
                provide: SHELL_MERGED_CONFIG,
                useValue: mockShellModuleConfig
            }
        ]
    }));

    it('should be created', () => {
        const service: IqsEmergencyPanelService = TestBed.get(IqsEmergencyPanelService);
        expect(service).toBeTruthy();
    });
});
