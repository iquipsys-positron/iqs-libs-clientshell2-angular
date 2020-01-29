import { MapPoint, RoutePoints } from '../../data';
export interface IObjectRoutesViewModel {
    updateObjectPositions(zoomLevel: string): void;
    cleanUp(): void;
    unfocus(): void
    focus(objectId: string, currentPosition?: any, toTime?: Date, state?: any, isRetro?: boolean): void;
    updateCurrentObjectPositions(currentPostion?: any, toTime?: Date, state?: any, isRetro?: boolean): void
    getRout(toTime: Date, fromTime: Date, objectId?: string, loadCurrent?: boolean, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    
    objectPositions: RoutePoints[];
    objectPoints: MapPoint[];
}