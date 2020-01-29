import { States } from '../../common/States';
import {
    IShiftsDataService,
    DataPage,
    Shift
} from '../../data';

export class ShiftParams {
    skip: number = 0;
    total: boolean = true;
    size: number = 100;
    type?: string;
}

export class ShiftsModel {
    public state: string;
    public allShifts: Shift[];
    public shifts: Shift[];
    public selectedIndex: number;
    private _isSort: boolean;
    private selectedItem: Shift;

    private readonly THRESHOLD: number = 15 * 60 * 1000; // 15 min
    private transaction: pip.services.Transaction;

    constructor(
        private $location: ng.ILocationService,
        private iqsShiftsData: IShiftsDataService,
        private pipTransaction: pip.services.ITransactionService
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('shifts');
    }

    private sortCollection(data: Shift[]): Shift[] {
        let collection = _.sortBy(data, function (item: Shift) {
            return item.name ? item.name.toLocaleLowerCase() : '';
        });

        return collection;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public get isSort(): boolean {
        return this._isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this._isSort = value;
        }
    }

    public getShifts(filter: string, successCallback?: (data: Shift[]) => void, errorCallback?: (error: any) => void) {
        this.state = States.Progress;
        let params: ShiftParams = new ShiftParams();
        this.transaction.begin('read');
        this.iqsShiftsData.readShifts(
            params,
            (data: DataPage<Shift>) => {
                this.getShiftsCallback(data, filter, successCallback);
                this.transaction.end();
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback(err);
                }
            });
    }

    public filterShifts(filter: string = 'all') {
        _.each(this.allShifts, (item: Shift, index: number) => {
            this.allShifts[index].startDate = new Date(2018, 1, 1, 0, item.start, 0);
            this.allShifts[index].endDate = new Date(2018, 1, 1, 0, item.duration + item.start, 0);
        })
        this.shifts = this.allShifts;
        this.setState();
    }

    public getShiftById(shiftId: string) {
        return _.find(this.allShifts, (shift) => { return shift.id === shiftId; });
    }

    private getShiftsCallback(data: DataPage<Shift>, filter?: string, successCallback?: (data: Shift[]) => void) {
        this.allShifts = data.data;
        this.allShifts = this.sortCollection(this.allShifts);
        this.filterShifts(filter);
        let index: number = null;
        if (this.$location.search()['shift_id']) {
            index = _.findIndex(this.shifts, { id: this.$location.search()['shift_id'] });
        } else {
            if (this.shifts.length > 0) {
                index = 0;
                this.$location.search('shift_id', this.shifts[0].id)
            }
        }
        this.selectedIndex = index;
        this.selectItem(index);

        if (successCallback) {
            successCallback(this.allShifts);
        }
    }

    public saveShift(data: Shift, callback?: (item: Shift) => void, errorCallback?: (err: any) => void) {
        this.transaction.begin('create');
        this.iqsShiftsData.saveShift(data,
            (item: Shift) => {
                this.allShifts.push(item);
                this.allShifts = this.sortCollection(this.allShifts);
                this.$location.search('shift_id', data.id);
                this.filterShifts();
                this.selectItem();
                this.setState();
                this.transaction.end();
                if (callback) {
                    callback(item);
                }
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback(err);
                }
            })
    }

    private setState() {
        this.state = (this.shifts && this.shifts.length > 0) ? States.Data : States.Empty;
    }

    public remove(id: string): void {
        _.remove(this.shifts, { id: id });
        _.remove(this.allShifts, { id: id });
    }

    public deleteShift(id: string, callback?: () => void, errorCallback?: () => void) {
        this.transaction.begin('delete');
        let index: number;
        if (this.selectedItem && this.selectedItem.id == id) {
            index = this.selectedIndex < this.shifts.length - 1 ? this.selectedIndex : this.selectedIndex - 1;
        } else {
            index = this.selectedIndex;
        }

        this.iqsShiftsData.deleteShift(id,
            (item) => {
                this.remove(id);
                this.selectItem();
                this.setState();
                this.transaction.end();
                if (callback) {
                    callback();
                }
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback();
                }
            })
    }

    public updateShift(data: Shift, callback?: (item) => void, errorCallback?: (err) => void) {
        this.transaction.begin('update');
        this.iqsShiftsData.updateShift(data.id, data,
            (item: Shift) => {
                let index: number = _.findIndex(this.shifts, { id: item.id });
                if (index > -1) {
                    this.shifts[index] = item;
                    this.shifts[index].startDate = new Date(2018, 1, 1, 0, item.start, 0);
                    this.shifts[index].endDate = new Date(2018, 1, 1, 0, item.duration + item.start, 0);
                }

                index = _.findIndex(this.allShifts, { id: item.id });
                if (index > -1) {
                    this.allShifts[index] = item;
                    this.allShifts[index].startDate = new Date(2018, 1, 1, 0, item.start, 0);
                    this.allShifts[index].endDate = new Date(2018, 1, 1, 0, item.duration + item.start, 0);
                }
                this.allShifts = this.sortCollection(this.allShifts);
                this.shifts = this.sortCollection(this.shifts);
                this.$location.search('shift_id', data.id);
                this.setState();
                this.selectItem();
                if (callback) {
                    callback(item);
                }

                this.transaction.end();
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback(err);
                }
            })
    }

    public selectItem(index?: number) {
        if (index === undefined || index === null || index < 0 || index > this.shifts.length - 1) {
            let id: string = this.$location.search()['shift_id'];
            if (id) {
                index = _.findIndex(this.shifts, (item: Shift) => {
                    return item.id == id;
                });
            }
            if (!index || index == -1) {
                index = 0;
            }
        }

        this.selectedIndex = index;

        this.selectedItem = (this.shifts && this.shifts.length > 0) ? this.shifts[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('shift_id', this.selectedItem.id);
        }
    }

    public clean(): void {
        this.allShifts = [];
        this.shifts = [];
        this.state = States.Empty;
        this.selectedIndex = -1;
    }

}