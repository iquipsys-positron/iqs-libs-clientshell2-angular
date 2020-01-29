import { TabRecord } from './TabRecord';
import { ITabStateService } from './ITabStateService';

class TabState implements ITabStateService {
    private tabStateRecords: TabRecord;

    constructor(

    ) {
        "ngInject";

        this.tabStateRecords = {};
    }

    public set(key: string, value: string): void {
        this.tabStateRecords[key] = value;
    }

    public get(key: string): string {
        return this.tabStateRecords[key];
    }
}

angular
    .module('iqsTabState', [])
    .service('iqsTabState', TabState);
