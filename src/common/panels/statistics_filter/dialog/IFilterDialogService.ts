import { StatisticsFilterVisibility }  from '../StatisticsFilterVisibility';

export class FilterDialogData {
    public id?: string;
    public name?: string;
    public object_type?: string;
}

export class FilterDialogParams {
    filterVisibility?: StatisticsFilterVisibility
    fillData?: any;
}

export interface IFilterDialogService {
    show(params: FilterDialogParams, successCallback?: (data?: any) => void, cancelCallback?: () => void): any;
}