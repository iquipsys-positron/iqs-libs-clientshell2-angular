export class OperationEventReferenceRecord {
    public id?: string;
    public event_id?: string;
    public type?: string;
    public object_type?: string;
    public name?: string;
    public description?: string;
    public locationName?: string;
    public item?: any;
    public longitude?: number;
    public latitude?: number;
    public incidentValue?: string;
    public timeString?: string;
    public ref_groups?: string;
    public resolution?: string;
    public resolution_time?: string;
    public resolution_close?: string; // closing account name
    public accountName?: string;
    public assigned_name?: string;
}

export class OperationalEvent {
    public id?: string;
    public org_id?: string;
    public create_time?: string;
    public creator_id?: string;

    public rule_id?: string;
    public type?: string;
    public severity: number;
    public time: string; // может определяться пользователем
    public pos?: any; // GeoJSON

    public group_id?: string;
    public object_id?: string;
    public loc_id?: string;
    public assign_id?: string;
    public zone_id?: string;
    public ref_event_id?: string; // поле для референса на резолюцию

    public description: string;
    public expected_value?: any;
    public actual_value?: any;
    public value_units?: string;

    // added property
    public eventValue?: string;
    public ref?: OperationEventReferenceRecord;
    public timeString?: string;
}

