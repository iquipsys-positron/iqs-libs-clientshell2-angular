export class Zone {
    public id?: string;
    public organization_id?: string;
    public type?: string;
    public name: string;

    public center?: any; // GeoJSON
    public distance?: number; // Radius or distance from line in meters
    public geometry?: any; // GeoJSON
    public boundaries?: any; // GeoJSON

    public include_object_ids?: string[];
    public include_group_ids?: string[];
    public exclude_object_ids?: string[];
    public exclude_group_ids?: string[];

    // For client
    public path?: any[];
    public fill?: any;
    public stroke?: any;
    public included?: any[];
    public excluded?: any[];
}
