import { ControlObject } from '../control_objects';

export class Device {
    public id: string;
    public org_id: string;
    public type: string;
    public udi: string;
    public label?: string;
    public create_time?: Date;
    public status?: string;
    public version?: number;
    public deleted?: boolean;
    public object_id?: string;
    public rec_time?: Date;
    public ping_time?: Date;    
    // add for Client
    public object?: ControlObject;
}
