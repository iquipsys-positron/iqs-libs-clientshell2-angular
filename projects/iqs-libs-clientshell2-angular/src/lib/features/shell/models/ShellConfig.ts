import { InjectionToken } from '@angular/core';

export class ShellConfig {
    shadows?: {
        top?: boolean,
        left?: boolean,
        right?: boolean
    };
}

export const defaultShellConfig = <ShellConfig>{
    shadows: {
        top: true,
        left: true,
        right: true
    }
};
