import { ObjectsRoutesModel } from './ObjectsRoutesModel';
import { IObjectsRoutesViewModel } from './IObjectsRoutesViewModel';
import {
    ICurrentObjectRoutesDataService,
    IObjectRoutesDataService,
    MapPoint,
    RoutePoints,
    PositionShort
} from '../../data';
import { IObjectFormatService } from '../../common';
import { IObjectsViewModel } from '../../models';
import {
    IMapIconService,
    ISmartZoomService,
    IOrganizationService
} from '../../services';

class ObjectsRoutesViewModel implements IObjectsRoutesViewModel {
    public model: ObjectsRoutesModel;

    constructor(
        pipRest: pip.rest.IRestService,
        iqsSmartZoom: ISmartZoomService,
        iqsOrganization: IOrganizationService,
        $http: ng.IHttpService,
        $timeout: ng.ITimeoutService,
        $rootScope: ng.IRootScopeService,
        iqsMapIcon: IMapIconService,
        iqsObjectFormat: IObjectFormatService,
        iqsCurrentObjectRoutesData: ICurrentObjectRoutesDataService,
        iqsObjectRoutesData: IObjectRoutesDataService,
        iqsObjectsViewModel: IObjectsViewModel,
    ) {
        this.model = new ObjectsRoutesModel(
            pipRest,
            iqsSmartZoom,
            iqsOrganization,
            $http,
            $timeout,
            $rootScope,
            iqsMapIcon,
            iqsObjectFormat,
            iqsCurrentObjectRoutesData,
            iqsObjectRoutesData,
            iqsObjectsViewModel
        );
    }

    public getRouts(toTime: Date, fromTime: Date, objectIds?: string[], successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        return this.model.getRouts(toTime, fromTime, objectIds,  successCallback, errorCallback);
    }

    public cleanUp(): void {
        this.model.cleanUp();
    }

    public updateObjectPositions(zoomLevel: string): void {
        this.model.updateObjectPositions(zoomLevel);
    }

    public unfocus(): void {
        this.model.unfocus();
    }

    public focus(objectId: string, position?: PositionShort, isCentered?: boolean): void {
        this.model.focus(objectId, position, isCentered);
    }

    public cancelDownloading(): void {
        this.model.cancelDownloading();
    }

    public readObjectPositions(toTime?: Date,fromTime?: Date, objectIds?: string[], isCentered?: boolean, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        this.model.readObjectPositions(toTime, fromTime, objectIds, isCentered, successCallback, errorCallback);
    }

    public get objectPositions(): RoutePoints[] {
        return this.model.objectPositions
    }

    public get objectPoints(): MapPoint[] {
        return this.model.objectPoints
    }

    public get positionsZoom(): number {
        return this.model.positionsZoom
    }

    public get objectsHeads(): any[] {
        return this.model.objectsHeads
    }

    public get currentObjectId(): string {
        return this.model.currentObjectId
    }

    public get state(): string {
        return this.model.state
    }

    public isPointsOnMap(objectId: string): boolean {
        return this.model.isPointsOnMap(objectId);
    }

}

angular.module('iqsObjectsRoutes.ViewModel', ['iqsCurrentObjectRoutes.Data', 'iqsObjectRoutes.Data'])
    .service('iqsObjectsRoutesViewModel', ObjectsRoutesViewModel);

 