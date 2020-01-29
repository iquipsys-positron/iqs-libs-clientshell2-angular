import { ObjectState } from "../../data";

export interface IIncidentCurrentObjectStateViewModel {
    initCurrentObjectStates(filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void);
    statusObject(object: ObjectState): string;
    getCurrentObjectStateByObjectId(id: string): ObjectState;
    clean(): void;

    allCurrentObjectStates: ObjectState[];

}