// import { ObjectState } from '../';

import { ControlObjectCategory } from './ControlObjectCategory';
import { ControlObjectType } from './ControlObjectType';

export class ControlObject {
    id: string;
    organization_id: string;
    category: ControlObjectCategory;
    type: ControlObjectType;
    deleted: boolean;
    name: string;
    description: string;
    phone: string;
    pin: string;
    email?: string;
    device_id: string;
    group_ids: string[];
    state?: any; // ObjectState;
    longitude?: number;
    latitude?: number;
    icon?: any;
    // one string with groups name
    groups?: string;
    perm_assign_id?: string;
}
