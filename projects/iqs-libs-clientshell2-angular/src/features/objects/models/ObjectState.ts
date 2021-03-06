import { ControlObject } from './ControlObject';
import { ZonePresence } from '../../zones/models/index';

export class ObjectState {

    public id: string;
    public organization_id: string;
    public device_id: string;
    public object_id: string;
    public time: Date;

    public pos: any;
    public alt?: number;
    public angle?: number;
    public speed?: number;
    public quality?: number;

    public expected?: boolean; // expected in roster
    public connected?: boolean; // just joined
    public online: number; // In seconds
    public offline?: number;
    public freezed: number; // In seconds
    public immobile: number; // In seconds
    public pressed?: boolean;
    public long_pressed?: boolean;
    public power?: boolean;
    public power_changed?: boolean;

    public groups_ids?: string[];
    public zones?: ZonePresence[];
    public beacons?: string[];

    public pos_time?: Date;
    public pos_rec?: any; // GeoJSON
    public state_time?: Date;
    public rule_time?: Date;
    public attend_time?: Date;
    public attend_start?: Date;


    public assign_id?: string;
    public assign_time?: Date;
    public assigner?: boolean;
    public assignee?: boolean;

    // -------
    public emergency: number; // count emergency
    public rules?: any[]; // TODO: EventRule[];
    public zone_ids: string[];

    lat?: any;
    lng?: any;

    device?: any; // TODO: Device;
    object?: ControlObject;
    highlighted?: boolean;
    selected?: boolean;
    focused?: boolean;
    direction?: number;
    status?: string;
    icon?: any;

    // TODO Remove later after removing of angular-google-maps
    longitude?: number;
    latitude?: number;
    options?: any;

    isActive?: boolean;

    public assigned_name?: string;

    public last_pos?: any;
    public last_pos_time?: Date;
    public extra?: any;
    public im_pos?: any;
    public im_time?: Date;
    public states?: any;
    public commands?: any;
    public events?: any;
    public params?: any;
    public group_ids?: any;
}
