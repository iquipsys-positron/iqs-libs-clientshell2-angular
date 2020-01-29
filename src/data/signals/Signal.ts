export class Signal {
    id?: string;
    org_id: string;
    device_id?: string;
    time?: Date;
    type: number;
    sent?: boolean;
    lock_until?: number;
}