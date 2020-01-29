export class CommStatistics {
    public device_udi?: string;
    public init_time?: Date;
    public up_time?: Date;
    public up_packets?: number;
    public up_errors?: number;
    public down_time?: Date;
    public down_packets?: number;
    public down_errors?: number;
    //add
    public device_type?: string;
    public device_label?: string;
}