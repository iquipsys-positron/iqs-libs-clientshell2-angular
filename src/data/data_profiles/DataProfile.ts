export class DataProfile {
    public state_types: DataProfileStateType[];
    public command_types: DataProfileCommandType[];
    public event_types: DataProfileEventType[];
    public param_types: DataProfileParamType[];
}

export class DataProfileStateType {
    public id: number;
    public name: string;
    public algorithm: string;
}

export class DataProfileCommandType extends DataProfileStateType {
    public min_value: number;
    public max_value: number;
}

export class DataProfileEventType extends DataProfileStateType {
    public min_value: number;
    public max_value: number;
}

export class DataProfileParamType extends DataProfileStateType {
    public min_value?: number;
    public max_value?: number;
    public state?: number;
}
