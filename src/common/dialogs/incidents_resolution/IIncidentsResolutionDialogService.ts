import { Resolution } from '../../../data';

export class IncidentsResolutionDialogParams {
    public resolutions: Resolution[];
    public event: any;
}

export interface IIncidentsResolutionDialogService {
    show(event: any, params: IncidentsResolutionDialogParams, successCallback?: (data?: any) => void, cancelCallback?: () => void): any;
}
