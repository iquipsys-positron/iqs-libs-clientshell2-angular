export class StatisticsValue {
    public value: number;
}

export class Statistics {
    public group: string;
    public name: string;
    public type: number | string;
    public values: StatisticsValue[];
}