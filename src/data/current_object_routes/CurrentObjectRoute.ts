import { PositionAddress } from '../object_routes';
import { TimedPosition } from './TimedPosition';

export class CurrentObjectRoute {
    public id: string;
    public org_id: string;
    public object_id: string;
    public type?: string;
    public start_time?: Date;
    public start_addr?: PositionAddress;
    public end_time?: Date;
    public end_addr?: PositionAddress;
    public duration?: number;
    public compressed?: number;
    public positions?: TimedPosition[];
}