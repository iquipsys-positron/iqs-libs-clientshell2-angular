export class IncidentSettings {
    public rule_id: string;
    public rule_name: string;
    public enabled: boolean;
    public include_object_ids?: string[];
    public exclude_object_ids?: string[];
    public include_group_ids?: string[];
    public exclude_group_ids?: string[];
    public expanded?: boolean;
    public sendSignalType?: string;
}