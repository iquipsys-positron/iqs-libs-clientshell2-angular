export class MultiSelectDialogData {
    public id?: string;
    public name?: string;
    public object_type?: string;
}

export class MultiSelectDialogParams {
    dialogTitle?: string;
    initCollection?: MultiSelectDialogData[];
    entityType: string;
    configState?: string;
    addButtonLabel?: string;
}

export interface IMultiSelectDialogService {
    show(params: MultiSelectDialogParams, successCallback?: (data?: any) => void, cancelCallback?: () => void): any;
}