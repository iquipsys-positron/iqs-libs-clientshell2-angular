export class EventRuleCondition {
    public "max value"?: number;
    public "min value"?: number;
    public "duration"?: number;
    public conditionString?: string;
    public conditionName?: string;

}

export class EventRule {
    public id: string;
    public org_id: string;
    public type: string;
    public name: string;
    public deleted?: boolean;
    public create_time?: Date;

    public condition?: EventRuleCondition;
    public severity?: number;
    public interval?: number; // In minutes

    public incident?: boolean;
    public show_journal?: boolean;
    // public send_email?: boolean;
    // public emails?: string[];
    // public send_sms?: boolean;
    // public phones?: string[];    
    public send_message?: boolean;
    public recipient_ids?: string[];

    public send_signal?: boolean;
    public signal?: number; //signal type


    public all_objects?: boolean;
    public include_object_ids?: string[];
    public exclude_object_ids?: string[];

    public include_group_ids?: string[];
    public exclude_group_ids?: string[];

    public all_zones?: boolean;
    public include_zone_ids?: string[];
    public exclude_zone_ids?: string[];

    // added property for interface
    
    public includeObjectsDescription?: string;
    public excludeObjectsDescription?: string;
    public recipient_names?: string;
}
