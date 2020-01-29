export class Beacon {
    public id: string;
    public shortUDI?: string;
    public org_id: string;
    public udi: string;
    public type?: string;
    public label?: string;
    public center?: any; // GeoJSON
    public radius?: number; 
}