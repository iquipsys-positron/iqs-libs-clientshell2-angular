import { InjectionToken } from '@angular/core';

import { ShellConfig, defaultShellConfig } from './models/ShellConfig';
import { SessionConfig, defaultSessionConfig } from '../session/models/SessionConfig';

export interface ShellModuleConfig {
    mock?: boolean;
    session?: SessionConfig;
    shell?: ShellConfig;
    [key: string]: any;
}

export const defaultShellModuleConfig = {
    mock: false,
    session: defaultSessionConfig,
    shell: defaultShellConfig
};

export const mockShellModuleConfig = {
    mock: true,
    session: defaultSessionConfig,
    shell: defaultShellConfig
};

export const SHELL_RUNTIME_CONFIG = new InjectionToken<ShellModuleConfig>('Shell config (runtime)');
export const SHELL_MODULE_CONFIG = new InjectionToken<ShellModuleConfig>('Shell config (function)');
export const SHELL_MERGED_CONFIG = new InjectionToken<ShellModuleConfig>('Shell config (merged)');
