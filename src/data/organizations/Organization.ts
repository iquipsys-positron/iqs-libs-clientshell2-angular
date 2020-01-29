export class OrganizationsIndustry {
    public static readonly Mining = 'Mining';
    public static readonly Quarries = 'Quarries';
    public static readonly Oil = 'Oil & Gas';
    public static readonly Civil = 'Civil and Industrial Construction';
    public static readonly Road = 'Road Construction';
    public static readonly Tourism = 'Tourism & Recreation';
    public static readonly Other = 'Other';
}


export class Organization {
    public id: string;
    public code?: string;
    public create_time: Date;
    public creator_id: string;
    public deleted?: boolean;
    public active: boolean;
    public version?: number;

    public name: string;
    public description?: string;
    public address?: string;

    public center?: any; // GeoJSON
    public radius?: number; // In km
    public geometry?: any; //GeoJSON
    public boundaries?: any; //GeoJSON
    public language?: string;
    public timezone?: string;
    public industry?: OrganizationsIndustry;
    public org_size?: number;
    public total_organizations?: number;
    public purpose?: string;
    public active_int?: number; // In seconds
    public inactive_int?: number; // In seconds
    public offorganization_int?: number; // In seconds
    public offline_timeout?: number; // In seconds
    public data_rate?: number;
    public params?: any;

    public map_id?: string; // Blob id with map background
    public map_north?: number;
    public map_south?: number;
    public map_west?: number;
    public map_east?: number;
}
