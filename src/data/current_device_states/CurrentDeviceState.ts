export class CurrentDeviceState {
    public id: string;
    public org_id: string;
    public object_id?: string;
    public time: Date;
    public pos?: any; // GeoJSON
    public alt?: number;
    public angle?: number;
    public speed?: number;
    public quality?: number;

    public longitude?: number;
    public latitude?: number;
}