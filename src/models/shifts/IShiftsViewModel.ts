import { Shift } from '../../data';

export interface IShiftsViewModel {
    initShifts(filter?: string, successCallback?: (data: Shift[]) => void, errorCallback?: (error: any) => void);
    filterShifts(filter: string);
    selectItem(index?: number);
    getShiftById(shiftId: string): Shift;
    saveShift(data: Shift, callback: (item: Shift) => void, error: (err: any) => void);
    updateShift(data: Shift, callback: (item: Shift) => void, error: (err: any) => void);
    deleteShift(id, callback: () => void, error: () => void);
    clean(): void;
    getTransaction(): pip.services.Transaction;
    
    state: string;
    selectedIndex: number;
    shifts: Shift[];
    allShifts: Shift[];
    isSort: boolean;
}