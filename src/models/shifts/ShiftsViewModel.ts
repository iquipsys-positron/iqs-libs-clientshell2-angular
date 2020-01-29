import { ShiftsModel } from './ShiftsModel';
import { IShiftsViewModel } from './IShiftsViewModel';
import {
    IShiftsDataService,
    Shift
} from '../../data';

class ShiftsViewModel implements IShiftsViewModel {
    public model: ShiftsModel;

    constructor(
        $location: ng.ILocationService,
        iqsShiftsData: IShiftsDataService,
        pipTransaction: pip.services.ITransactionService
    ) {

        this.model = new ShiftsModel($location, iqsShiftsData, pipTransaction);
    }

    public initShifts(filter?: string, successCallback?: (data: Shift[]) => void, errorCallback?: (error: any) => void) {
        this.model.getShifts(filter || 'all', successCallback, errorCallback);
    }

    public filterShifts(filter: string = 'all') {
        this.model.filterShifts(filter);
    }

    public getTransaction(): pip.services.Transaction {
        return this.model.getTransaction();
    }

    public get shifts() {
        return this.model.shifts;
    }

    public get isSort(): boolean {
        return this.model.isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this.model.isSort = value;
        }
    }

    public get allShifts() {
        return this.model.allShifts;
    }

    public selectItem(index?: number) {
        this.model.selectItem(index);

    }

    public get state(): string {
        return this.model.state;
    }

    public set state(state: string) {
        this.model.state = state;
    }

    public get selectedIndex(): number {
        return this.model.selectedIndex;
    }

    public set selectedIndex(index: number) {
        this.model.selectedIndex = index;
    }

    public getShiftById(shiftId: string): Shift {
        return this.model.getShiftById(shiftId)
    }

    public saveShift(data: Shift, callback: (item: Shift) => void, error: (err: any) => void) {
        this.model.saveShift(data, callback, error);
    }

    public deleteShift(id, callback: () => void, error: () => void) {
        this.model.deleteShift(id, callback, error);
    }

    public updateShift(data: Shift, callback: (item: Shift) => void, error: (err: any) => void) {
        this.model.updateShift(data, callback, error);
    }

    public clean(): void {
        this.model.clean();
    }
}

angular.module('iqsShifts.ViewModel', ['iqsShifts.Data'])
    .service('iqsShiftsViewModel', ShiftsViewModel);