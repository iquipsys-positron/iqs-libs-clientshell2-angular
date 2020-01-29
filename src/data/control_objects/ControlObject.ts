import { ObjectState } from '../';

export class ControlObject {
    id: string;
    org_id: string;
    category: string;
    type: string;
    deleted: boolean;
    name: string;
    description: string;
    phone: string;
    pin: string;
    email?: string;
    device_id: string;
    group_ids: string[];
    state?: ObjectState;
    longitude?: number;
    latitude?: number;
    icon?: any;
    // one string with groups name
    groups?: string;
    perm_assign_id?: string;
}