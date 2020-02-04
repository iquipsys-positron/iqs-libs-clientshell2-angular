import { InjectionToken } from '@angular/core';

import { ShellConfig } from './models/ShellConfig';
import { SessionConfig } from '../session/models/SessionConfig';

export interface ShellModuleConfig {
    session?: Partial<SessionConfig>;
    shell?: Partial<ShellConfig>;
}

export const FR_CONFIGS = new InjectionToken<ShellModuleConfig>('For root configs');
export const TEST_ENVIRONMENT = new InjectionToken<boolean>('flag for testing environment');
