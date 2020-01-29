import { SendSignalData } from '../../../data';

export interface ISendSignalDialogService {
    show(successCallback?: (data?: SendSignalData) => void, cancelCallback?: () => void): any;
}