export class MapPoint {
    public time: Date;
    public latitude: number;
    public longitude: number;
    public alt?: number;
    public spd?: number;
    public agl?: number;
    public object: any; // currentObject
    public object_id?: string;
    public duration_time?: number;
    public parking?: boolean;
    public stoping?: boolean;
    public options?: any; // point option
    public id?: string;
    public icon?: any; // url scaledSize anchor
    public color?: string;
}
