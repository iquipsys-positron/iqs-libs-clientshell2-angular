export class Roster  {
    public id: string;
    public org_id: string;
    public name: string;
    public shift_id?: string;

    public start_date: string;
    public start_time?: string;
    public end_time?: string;

    public objects?: RosterObject[];
}

export class RosterObject {
    public object_id: string;
    public assign_id: string;
    public planned?: boolean; 
    public actual?: boolean;
    public start_time?: string;
    public end_time?: string;
}
