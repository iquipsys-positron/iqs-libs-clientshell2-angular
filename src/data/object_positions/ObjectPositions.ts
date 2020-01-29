export class Position {
    public time: Date;
    public lat: any;
    public lng: any;
    public agl: number;
    public spd: number;
    public duration_time?: number; // mill sec
    public parking?: boolean;
    public stoping?: boolean;
}

export class ObjectPositions {
    public id: string;
    public org_id: string;
    public object_id: string;
    public start_time: Date;
    public end_time: Date;
    public last_time?: Date;
    public positions: Position[];
    public path?: any[];
    public icons?: any[];
    public stroke?: any;
    public duration_time?: number; // mill sec
    public parking?: boolean;
    public stoping?: boolean;
}