import { RouteVisualization } from './RouteVisualization';
import {
    IObjectsViewModel,
    UPDATE_MAP_MODEL_CENTER
} from '../../models';
import {
    ICurrentObjectRoutesDataService,
    IObjectRoutesDataService,
    CurrentObjectRoute,
    ObjectRoute,
    RoutePoints,
    MapPoint,
    MapPosition,
    PositionShort
} from '../../data';
import {
    IObjectFormatService,
    States
} from '../../common';
import {
    IMapIconService,
    ISmartZoomService,
    IOrganizationService,
    MapIconTypes
} from '../../services';

class downloadedPositionsParams {
    public start: string;
    public end: string;
    public id: string;
}

class PositionResult {
    public id: string;
    public result: CurrentObjectRoute[];
}

export class ObjectsRoutesModel {
    // The interval for which the traces are displayed
    private TRACE_TIME_INTERVAL = 15 * 60 * 1000;
    private MAX_CURRENT_ROUTE_DURATION = 24 * 60 * 60 * 1000;
    private PAGE_SIZE = 100;
    private compressing: number;

    private POSITION_INRERVAL = 30;
    private POSITION_COMPRESSION = [
        [2, 1000],
        [3, 2000],
        [4, 4000],
        [5, 6000],
        [6, 8000],
        [7, 10000],
        [13, 13000],
        [16, 16000],
        [20, 20000],
        [25, 23000],
        [30, 27000],
        [35, 30000],
        [45, 40000],
        [55, 50000],
        [60, 60000],
        [70, 70000],
        [80, 80000],
        [90, 90000],
        [300, 100000]
    ];

    public progress: number;

    private _positionsZoom: number = null;
    private _zoomLevel: string;

    // for focused object
    private _objectIds: string[] = null;
    private _currentObjectId: string = null;

    private _toTime: Date = null;
    private _fromTime: Date = null;

    // time for last position into current route
    private _currentRouteTime: Date = null;
    // curent route Id
    private _currentRouteId: string = null;
    private _currentRouteStartTime: Date = null;

    // points
    private _objectPoints: MapPoint[] = [];
    private _currentObjectPoints: MapPoint[] = [];
    // trace for all ??
    private _objectPositions: RoutePoints[] = [];
    private _currentObjectPositions: RoutePoints[] = [];
    // object head positions
    private _objectsHeads: any[] = [];

    public _state: string = States.Empty;

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsSmartZoom: ISmartZoomService,
        private iqsOrganization: IOrganizationService,
        private $http: ng.IHttpService,
        private $timeout: ng.ITimeoutService,
        private $rootScope: ng.IRootScopeService,
        private iqsMapIcon: IMapIconService,
        private iqsObjectFormat: IObjectFormatService,
        private iqsCurrentObjectRoutesData: ICurrentObjectRoutesDataService,
        private iqsObjectRoutesData: IObjectRoutesDataService,
        private iqsObjectsViewModel: IObjectsViewModel
    ) {
        "ngInject";

        this.iqsSmartZoom.addLevelChangedCallback((zoomLevel) => {
            this.updateObjectPositions(zoomLevel);
            // this.updateHeads();
        });
    }

    private getStartTime(toTime: Date, fromTime: Date): Date {
        return fromTime ? moment(fromTime).toDate() : new Date(toTime.getTime() - this.TRACE_TIME_INTERVAL);
    }

    private getRouteObjectIndex(route: CurrentObjectRoute): number {
        if (this._objectIds.length == 0) return 0;
        if (this._objectIds.length > 3) return -2;
        let index = this._objectIds.indexOf(route.object_id);

        return index != -1 ? index : 0;
    }

    private convertObjectPositions(route: CurrentObjectRoute, index: number): RoutePoints {
        if (!route) return null;
        let objectId = this.getRouteObjectId(route)
        let tmpObject = this.iqsObjectsViewModel.getObjectById(objectId);
        let objectIndex = -2;// all point  have one color //this.getRouteObjectIndex(route); 

        let result: RoutePoints = RouteVisualization.getRoutePoints(route, tmpObject, index) // 0 - for not selected; -2 all blue
        result.obj = tmpObject;

        return result;
    }

    // take currentRoute
    private takeCurrRoutes(source: any): CurrentObjectRoute[] {
        let currRoutes: CurrentObjectRoute[] = null;
        if (!source || source.length == 0) {
            return null;
        } else {
            currRoutes = _.sortBy(source, (r: CurrentObjectRoute) => {
                return r.start_time;
            });
        }

        return currRoutes;
    }

    // take historyRoute
    private takeHistoryRoutes(source: any): ObjectRoute[] {
        let historyRoute: ObjectRoute[] = [];

        if (!source || source.length == 0) {
            return null;
        } else {
            historyRoute = _.sortBy(source, (r: ObjectRoute) => {
                return r.start_time;
            });
        }

        return historyRoute;
    }

    private filterPositions(positions: any[], toTime: Date, fromTime: Date): any[] {
        let toTimeString = new Date(toTime.getTime() + 1000).toISOString();
        let fromTimeString = fromTime.toISOString();

        if (positions == null || positions.length == 0) return positions;
        if (fromTimeString != null) {
            positions = _.filter(positions, p => p.time >= fromTimeString);
        }

        if (toTimeString != null) {
            positions = _.filter(positions, p => p.time < toTimeString);
        }

        return positions;
    }

    // route: ObjectRoute || CurrentObjectRoute);
    private getRouteObjectId(route: any): string {
        if (!route || !route.object_id) return null;

        return route.object_id;
    }

    private getLastTime(objectPositions: RoutePoints[], objectId: string): Date {
        let lastTime: Date = null;
        _.each(objectPositions, (op: RoutePoints) => {
            if (op.object_id == objectId) {
                if (op.positions && op.positions.length > 0) {
                    lastTime = moment(op.positions[op.positions.length - 1].time).toDate();
                }
            }
        });

        return lastTime;
    }

    private createPositions(data: any, toTime: Date): void {
        let currRoutes: CurrentObjectRoute[] = null;
        let historyRoutes: ObjectRoute[];
        let objectPositions: RoutePoints[] = [];
        let objectPoints: MapPoint[] = [];
        let objectsHeads: any[] = [];

        if (!data || data.length == 0) return;

        currRoutes = this.takeCurrRoutes(data[1])
        historyRoutes = this.takeHistoryRoutes(data[0]);
        let lastTime: Date;

        if (historyRoutes && historyRoutes.length > 0) {
            for (let i = 0; i < historyRoutes.length; i++) {
                let r: ObjectRoute = historyRoutes[i];
                let op: RoutePoints = this.convertObjectPositions(<CurrentObjectRoute>r, -2);

                lastTime = this.getLastTime(objectPositions, op.object_id);
                op.positions = this.filterPositions(op.positions, this._toTime, lastTime ? lastTime : this._fromTime);
                op.path = this.filterPositions(op.path, this._toTime, lastTime ? lastTime : this._fromTime);

                objectPoints = _.union(objectPoints, op.positions);
                objectPositions.push(op);

                // add last positions to heads
                let position = op.path.length > 0 ? op.path[op.path.length - 1] : null
                if (position) objectsHeads = this.updateObjectsHead(objectsHeads, position, op.obj);
            }
        }
        if (currRoutes) {
            for (let i = 0; i < currRoutes.length; i++) {
                let cr: CurrentObjectRoute = currRoutes[i];
                let op: RoutePoints = this.convertObjectPositions(<CurrentObjectRoute>cr, -2);
                op.positions = this.filterPositions(op.positions, this._toTime, this._fromTime);
                op.path = this.filterPositions(op.path, this._toTime, this._fromTime);

                objectPoints = _.union(objectPoints, op.positions);
                objectPositions.push(op);

                // add last positions to heads
                let position = op.path.length > 0 ? op.path[op.path.length - 1] : null
                if (position) objectsHeads = this.updateObjectsHead(objectsHeads, position, op.obj);
            }
        }

        this._objectPoints = objectPoints;
        this._objectPositions = objectPositions;
        this._objectsHeads = objectsHeads;
        this._currentObjectPositions = _.cloneDeep(this._objectPositions);
    }

    public getAllCurrentObjectsRoutes(toTime: Date, fromTime: Date, objectIds: string[], compressing: number,
        successCallback?: (data?: CurrentObjectRoute[]) => void, errorCallback?: (error?: any) => void): void {
        if (!objectIds || objectIds.length == 0) {
            // return empty
            if (successCallback) successCallback([]);

            return
        }

        let params: any = {
            object_ids: objectIds.toString(),
            from_time: fromTime.toISOString(),
            to_time: toTime.toISOString()
        };
        if (compressing) params.compress = compressing;

        this.iqsCurrentObjectRoutesData.readAllObjectsPositions(
            params,
            (data: CurrentObjectRoute[]) => {
                if (successCallback) successCallback(data);
            },
            (error: any) => {
                if (errorCallback) errorCallback(error);
            });
    }


    private getAllObjectRoutes(toTime: Date, fromTime: Date, objectIds: string[], compressing: number,
        successCallback?: (data?: ObjectRoute[]) => void, errorCallback?: (error?: any) => void): void {
        if (!objectIds || objectIds.length == 0) {
            // return empty
            if (successCallback) successCallback([]);

            return
        }

        let params: any = {
            object_ids: objectIds.toString(),
            from_time: fromTime.toISOString(),
            to_time: toTime.toISOString()
        };
        if (compressing) params.compress = compressing;

        this.iqsObjectRoutesData.readAllObjectsPositions(
            params,
            (data: ObjectRoute[]) => {
                if (successCallback) successCallback(data);
            },
            (error: any) => {
                if (errorCallback) errorCallback(error);
            });
    }

    private isCurrentTime(toTime: Date): boolean {
        let time = new Date();
        let dif = moment(time).valueOf() - moment(toTime).valueOf()

        return dif <= 0 || dif <= this.MAX_CURRENT_ROUTE_DURATION
    }

    private getDescription(object) {
        return this.iqsObjectFormat.formatSubtitle(object);
    }

    private updateObjectsHead(objectsHeads: any[], position: MapPosition, object: any): any[] {
        if (!position) return objectsHeads;
        let index: number;

        let tmpObject = object ? object : {};
        let objectDescription = this.getDescription(tmpObject);
        let objectName: string = RouteVisualization.shortLabel(tmpObject.name);
        let isShowLabel: boolean = this.iqsSmartZoom.zoomLevel === this.iqsSmartZoom.smartZoomLevels.large.name
        let type = tmpObject && MapIconTypes.All.includes(tmpObject.category) ? tmpObject.category : 'undefined';

        // create head position
        // let direct = RouteVisualization.getDirection(pos.agl);
        let direct = 0;
        let head: any = {
            id: object.id,
            icon: this.iqsMapIcon.getIconByAttrs(type, direct),
            latitude: position.latitude,
            longitude: position.longitude,
            object_id: object.id,
            object: tmpObject,
            type: type,
            direct: direct,
            time: position.time,
            // agl: pos.agl,
            // spd: pos.spd,
            options: {
                zIndex: 30
            }
        };
        RouteVisualization.setLabel(head, objectName, objectDescription, isShowLabel);

        index = _.findIndex(objectsHeads, { object_id: object.id });

        if (index == -1) {
            objectsHeads.push(head);
        } else {
            objectsHeads.splice(index, 1, head);
        }

        return objectsHeads;
    }

    private setCenter(pos: PositionShort): void {
        this.$rootScope.$broadcast(UPDATE_MAP_MODEL_CENTER, { latitude: pos.lat, longitude: pos.lng });
    }

    private setHighlightsCenter(objectPoints: MapPoint[], objectid: string): void {
        let pos: PositionShort = RouteVisualization.getHighlightCenter(objectPoints, objectid);

        this.setCenter(pos);
    }

    private getLastPosition(objectId: string): PositionShort {
        let pos: PositionShort = null;
        let index = _.findIndex(this._objectsHeads, { object_id: objectId });

        if (index != -1) {
            pos = {
                lat: this._objectsHeads[index].latitude,
                lng: this._objectsHeads[index].longitude
            };
        }
        return pos;
    }

    // Calculate the compression values
    private getCompressing(toTime: Date, fromTime: Date, objectCount: number): number {
        let compress: number = 0;

        // calculate time interval in second
        let interval = (toTime.getTime() - fromTime.getTime()) / 1000;

        // calculate max point count
        let pointCount = Math.floor(interval / this.POSITION_INRERVAL) * objectCount;
        // if (pointCount < 1000) return 0;
        //         let a = Math.floor(pointCount/1000) + 1;
        // return a;
        // Compression is not necessary
        if (pointCount < this.POSITION_COMPRESSION[0][1]) return 0;

        let i: number = 0;

        while (i < this.POSITION_COMPRESSION.length && this.POSITION_COMPRESSION[i][1] < pointCount) {
            i++;
        }
        i = i == this.POSITION_COMPRESSION.length ? i - 1 : i;

        return this.POSITION_COMPRESSION[i][0];
    }

    private selectById(objectId: string, position?: PositionShort, isCentered?: boolean): void {

        let objectPoints: MapPoint[] = [];//RouteVisualization.addHighlights(this._objectPoints, objectId);
        let objectPositions: RoutePoints[] = RouteVisualization.selectPath(this._objectPositions, objectId);
        objectPositions = RouteVisualization.getColoredPath(objectPositions);
        objectPositions = RouteVisualization.fixPath(objectPositions, !this.compressing && this.compressing > 1);

        // add colored points
        // objectPositions = RouteVisualization.getColoredPath(objectPositions);
        _.each(objectPositions, (op: RoutePoints) => {
            objectPoints = _.union(objectPoints, op.positions);
        });

        // add other points
        // _.each(this._objectPositions, (op: RoutePoints) => {
        //     if (op.object_id != objectId) {
        //         objectPoints = _.union(objectPoints, _.cloneDeep(op.positions));
        //     }
        // });

        let objectsHeads: any = _.cloneDeep(this._objectsHeads);
        _.each(objectsHeads, (obj: any) => {
            obj.icon = this.iqsMapIcon.getIconByAttrs(obj.type, obj.direct, undefined, obj.id == objectId);
        });


        this._objectsHeads = objectsHeads;
        this._currentObjectPoints = objectPoints;
        this._currentObjectPositions = objectPositions;
        this._currentObjectId = objectId;

        if (position) {
            this.setCenter(position);
        } else if (isCentered) {
            let lastPosition: PositionShort = this.getLastPosition(objectId);
            if (lastPosition) this.setCenter(lastPosition);
        }

    }

    private setAutoZoom(objectPosition: RoutePoints[]) {
        let right: number = -1000;
        let left: number = 1000;
        let top: number = -1000;
        let bottom: number = 1000;
        let topPoint, rightPoint, bottomPoint, leftPoint;

        for (let i = 0; i < objectPosition.length; i++) {
            if (objectPosition[i] && objectPosition[i].path.length > 0) {
                _.each(objectPosition[i].path, (point) => {
                    if (point.latitude > top) {
                        top = point.latitude;
                        topPoint = point;
                    }
                    if (point.latitude < bottom) {
                        bottom = point.latitude;
                        bottomPoint = point;
                    }
                    if (point.longitude > right) {
                        right = point.longitude;
                        rightPoint = point;
                    }
                    if (point.longitude < left) {
                        left = point.longitude;
                        leftPoint = point;
                    }
                });
            }
        }

        if (topPoint && rightPoint && bottomPoint && leftPoint) {
            let a;
            if (Math.abs(top - bottom) > Math.abs(right - left)) {
                a = RouteVisualization.calcDistance(topPoint.latitude, topPoint.longitude, bottomPoint.latitude, topPoint.longitude);
            } else {
                a = RouteVisualization.calcDistance(rightPoint.latitude, rightPoint.longitude, rightPoint.latitude, leftPoint.longitude);
            }

            let zoom: number = Math.round(20 - Math.log(Math.sqrt(a) / 2) / Math.LN2) - 1;
            this._positionsZoom = zoom;
        }

    }

    private centeredFirstTrace() {
        if (!this._objectPositions || this._objectPositions.length == 0) return;

        let latitude: number;
        let longitude: number;
        let objectId: string = this._objectPositions[0].object_id;
        let right: number = -1000;
        let left: number = 1000;
        let top: number = -1000;
        let bottom: number = 1000;

        for (let i = 0; i < this._objectPositions.length; i++) {
            if (this._objectPositions[i].object_id == objectId && this._objectPositions[i] && this._objectPositions[i].path.length > 0) {
                _.each(this._objectPositions[i].path, (point) => {
                    if (point.latitude > top) { top = point.latitude }
                    if (point.latitude < bottom) { bottom = point.latitude }
                    if (point.longitude > right) { right = point.longitude }
                    if (point.longitude < left) { left = point.longitude }
                });
            }
        }
        if (top != -1000 && bottom != 1000 && right != -1000 && left != 1000) {
            latitude = (top + bottom) / 2;
            longitude = (right + left) / 2;
            this.$rootScope.$broadcast(UPDATE_MAP_MODEL_CENTER, { latitude: latitude, longitude: longitude });
        }
    }
    // property section ==========================

    public get objectPositions(): RoutePoints[] {
        return this._zoomLevel === this.iqsSmartZoom.smartZoomLevels.large.name ? this._currentObjectPositions : [];
    }

    public get objectPoints(): MapPoint[] {
        return this._zoomLevel !== this.iqsSmartZoom.smartZoomLevels.large.name ? [] : this._currentObjectId ? this._currentObjectPoints : this._objectPoints;
    }

    public get positionsZoom(): number {
        return this._positionsZoom;
    }

    public get objectsHeads(): any[] {
        return this._objectsHeads;
    }

    public get state(): string {
        return this._state;
    }

    public get currentObjectId(): string {
        return this._currentObjectId;
    }

    // public section ==========================

    // clear data 
    public cleanUp(): void {
        this._currentObjectId = null;
        this._currentRouteTime = null;
        this._currentRouteId = null;
        this._currentRouteStartTime = null;
        this._objectIds = [];
        this._objectPoints = [];
        this._objectPositions = [];
        this._currentObjectPositions = [];
        this._currentObjectPoints = [];
        this._toTime = null;
        this._fromTime = null;
        this._objectsHeads = [];
    }

    public cancelDownloading(): void {
        this.cleanUp();
        this.progress = 0;
        this.unfocus();
        this._state = States.Empty
    }

    public updateObjectPositions(zoomLevel: string): void {
        this._zoomLevel = zoomLevel;
        // this._objectPositions = zoomLevel === smartZoomLevels.large.name ? this._objectPositions : [];
        // this._objectPoints = zoomLevel === smartZoomLevels.large.name ? this._objectPoints : [];
    }

    public unfocus(): void {
        this._currentObjectId = null;
        this._currentObjectPoints = [];
        this._currentObjectPositions = [];

        this._objectsHeads = _.map(this._objectsHeads, (obj: any) => {
            obj.icon = this.iqsMapIcon.getIconByAttrs(obj.type, obj.direct, undefined, false);

            return obj;
        });

        this._currentObjectPositions = _.cloneDeep(this._objectPositions);
    }

    public focus(objectId: string, position?: PositionShort, isCentered?: boolean): void {
        if (this._currentObjectId === objectId) return;

        this.unfocus();
        this.selectById(objectId, position, isCentered);
    }

    public readObjectPositions(toTime?: Date, fromTime?: Date, objectIds?: string[], isCentered?: boolean, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        if (!objectIds || objectIds.length == 0) return;

        let currentObjectId: string;
        if (this._currentObjectId && objectIds.indexOf(this._currentObjectId) != -1) {
            currentObjectId = this._currentObjectId;
        }
        this.cleanUp();

        this._currentObjectId = currentObjectId ? currentObjectId : null;
        this._objectIds = objectIds;
        this._toTime = toTime ? toTime : new Date();
        this._fromTime = this.getStartTime(toTime, fromTime);
        this.getRouts(this._toTime, this._fromTime, this._objectIds, (data: any) => {
            this.createPositions(data, toTime);
            if (this._currentObjectId) {
                this.selectById(this._currentObjectId, null, true);
            } else if (isCentered) {
                this.setAutoZoom(this._objectPositions);
                this.centeredFirstTrace();
            }
            if (successCallback) successCallback(data);
            this.updateObjectPositions(this.iqsSmartZoom.zoomLevel);
        });
    }

    public isPointsOnMap(objectId: string): boolean {
        for (let i = 0; i < this._objectPositions.length; i++) {
            if (this._objectPositions[i].object_id === objectId) return true;
        }

        return false;
    }

    public getRouts(toTime: Date, fromTime: Date, objectIds?: string[], successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        if (!toTime || !objectIds || objectIds.length == 0) {
            // return empty
            if (successCallback) successCallback([]);

            return
        }
        this._state = States.Progress;
        // if route some days??
        this.compressing = this.getCompressing(toTime, fromTime, objectIds.length);

        let getCurrentRoute: boolean;
        getCurrentRoute = this.isCurrentTime(toTime);

        async.parallel([
            (callback) => {
                this.getAllObjectRoutes(
                    toTime, fromTime, objectIds, this.compressing,
                    (data: ObjectRoute[]) => {
                        callback(null, data);
                    }, callback);
            },
            (callback) => {
                this.getAllCurrentObjectsRoutes(
                    toTime, fromTime, objectIds, this.compressing,
                    (data: CurrentObjectRoute[]) => {
                        callback(null, data);
                    }, callback);
            }
        ],
            // optional callback
            (error, results) => {
                if (error) {
                    if (errorCallback) errorCallback(error);
                } else if (successCallback) {
                    this._state = States.Data;
                    successCallback(results);
                }

            });
    }

}



