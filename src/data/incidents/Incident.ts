import { ControlObject } from '../control_objects';

export class Incident {
    public id: string;
    public org_id: string;
    public create_time?: string;
    public closed?: boolean;
    public close_time?: string;
    public closer_id?: string;
    public closer_name?: string;

    public event_id: string;
    public rule_id: string;
    public severity: number;
    public time: Date;
    public pos?: any; // GeoJSON

    public group_id?: string;
    public object_id?: string;
    public assign_id?: string;
    public loc_id?: string;
    public zone_id?: string;

    public resolution?: string;
    public resolution_id?: string;

    public description: string;
    public expected_value?: any;
    public actual_value?: any;
    public value_units?: string;
    
    // reference add
    public object?: ControlObject;
    public ref_name?: string;    
    public ref_id?: string;    
    public timeString?: string;
    public assigned_name?: string;
}