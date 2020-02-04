import { SignalType } from './SignalType';

export class Signal {
    id?: string;
    organization_id: string;
    device_id?: string;
    time?: Date;
    type: SignalType;
    sent?: boolean;
    lock_until?: number;
}
