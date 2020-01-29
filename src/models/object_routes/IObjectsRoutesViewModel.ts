import { MapPoint, RoutePoints, PositionShort } from '../../data';

export interface IObjectsRoutesViewModel {
    updateObjectPositions(zoomLevel: string): void;
    cleanUp(): void;
    unfocus(): void
    focus(objectId: string, position?: PositionShort, isCentered?: boolean): void;
    getRouts(toTime: Date, fromTime: Date, objectIds?: string[], successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    readObjectPositions(toTime?: Date, fromTime?: Date, objectIds?: string[], isCentered?: boolean, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    isPointsOnMap(objectId: string): boolean;
    cancelDownloading(): void;

    objectPositions: RoutePoints[];
    objectPoints: MapPoint[];
    positionsZoom: number;
    objectsHeads: any[];
    currentObjectId: string;
    state: string;
}