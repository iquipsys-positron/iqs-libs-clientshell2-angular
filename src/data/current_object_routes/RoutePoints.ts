import { PositionAddress } from '../object_routes';
import { MapPosition, MapPoint } from './';

export class RoutePoints {
    public id: string;
    public object_id: string;
    public start_time: Date;
    public end_time: Date;
    public type?: string;
    public start_addr?: PositionAddress;
    public end_addr?: PositionAddress;
    public positions: MapPoint[];
    public path?: MapPosition[];
    public icons?: any[];
    public obj?: any;
    public stroke?: any;
    public options?: any;
    public color?: string;
    public route_index?: number;
}