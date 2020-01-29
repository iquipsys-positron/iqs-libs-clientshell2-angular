import { ObjectRoutesModel } from './ObjectRoutesModel';
import { IObjectRoutesViewModel } from './IObjectRoutesViewModel';
import { IObjectFormatService } from '../../common/formats/IObjectFormatService';
import {
    ICurrentObjectRoutesDataService,
    IObjectRoutesDataService,
    MapPoint,
    RoutePoints
} from '../../data';
import { IObjectsViewModel } from '../../models';
import {
    IMapIconService,
    ISmartZoomService,
    IOrganizationService
} from '../../services';

class ObjectRoutesViewModel implements IObjectRoutesViewModel {
    public model: ObjectRoutesModel;

    constructor(
        iqsSmartZoom: ISmartZoomService,
        iqsCurrentObjectRoutesData: ICurrentObjectRoutesDataService,
        iqsObjectRoutesData: IObjectRoutesDataService,
        iqsObjectsViewModel: IObjectsViewModel
    ) {
        this.model = new ObjectRoutesModel(
            iqsSmartZoom,
            iqsCurrentObjectRoutesData,
            iqsObjectRoutesData,
            iqsObjectsViewModel
        );
    }

    public getRout(toTime: Date, fromTime: Date, objectId?: string, loadCurrent?: boolean, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        return this.model.getRout(toTime, fromTime, objectId, loadCurrent, successCallback, errorCallback);
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

    public focus(objectId: string, currentPosition?: any, toTime?: Date, state?: any, isRetro?: boolean): void {
        this.model.focus(objectId, currentPosition, toTime, state, isRetro);
    }

    public updateCurrentObjectPositions(currentPostion?: any, toTime?: Date, state?: any, isRetro?: boolean): void {
        this.model.updateCurrentObjectPositions(currentPostion, toTime, state, isRetro);
    }

    public get objectPositions(): RoutePoints[] {
        return this.model.objectPositions
    }

    public get objectPoints(): MapPoint[] {
        return this.model.objectPoints
    }

}

angular.module('iqsObjectRoutes.ViewModel', ['iqsCurrentObjectRoutes.Data', 'iqsObjectRoutes.Data', 'iqsObjects.ViewModel'])
    .service('iqsObjectRoutesViewModel', ObjectRoutesViewModel);

 