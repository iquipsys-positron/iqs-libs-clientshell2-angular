declare var google;

import {
    ICurrentObjectRoutesDataService,
    IObjectRoutesDataService,
    CurrentObjectRoute,
    MapPoint,
    MapPosition,
    ObjectRoute,
    RoutePoints,
    TimedPosition } from '../../data';
import { IObjectsViewModel } from '../../models';
import {
    ISmartZoomService
} from '../../services';
import { RouteVisualization } from './RouteVisualization';

class downloadedPositionsParams {
    public start: string;
    public end: string;
    public id: string;
}

class PositionResult {
    public id: string;
    public result: CurrentObjectRoute[];
}

export class ObjectRoutesModel {
    // The interval for which the traces are displayed
    private TRACE_TIME_INTERVAL = 15 * 60 * 1000;
    private PAGE_SIZE = 100;

    public progress: number;

    private _positionsZoom: number = null;
    private _zoomLevel: string;
    // for focused object
    private _currentObjectId: string = null;
    private _currentPosition: any = null;
    private _currentPositionTime: Date = null;
    private _toTime: Date = null;

    // time for last position into current route
    private _currentRouteTime: Date = null;
    // curent route Id
    private _currentRouteId: string = null;
    private _currentRouteStartTime: Date = null;

    // points
    private _currentObjectPoints: MapPoint[] = [];
    // trace
    private _objectPositions: RoutePoints[] = [];
    // object_id for requested routes
    private _routesObjectId: string = null;

    constructor(
        private iqsSmartZoom: ISmartZoomService,
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

    private getStartTime(toTime: Date): Date {
        return this._currentRouteTime && this._currentRouteId ? this._currentRouteTime : new Date(toTime.getTime() - this.TRACE_TIME_INTERVAL);
    }

    private getFromTime(toTime: Date): Date {
        return new Date(toTime.getTime() - this.TRACE_TIME_INTERVAL);
    }

    private convertCurrentObjectPositions(route: CurrentObjectRoute, tmpObject: any, index: number): RoutePoints {
        if (!route) return null;
        let result: RoutePoints = RouteVisualization.getRoutePoints(route, tmpObject, index)//_.clone(positions[0]);

        return result;
    }

    // take currentRoute
    private takeCurrRoute(source: any): CurrentObjectRoute {
        let currRoute: CurrentObjectRoute = null;
        if (!source) {
            return null;
        } else {
            // check empty
            if (source.positions && source.positions.length > 0) {
                currRoute = source;
            }
        }

        return currRoute;
    }

    // take historyRoute
    private takeHistoryRoutes(source: any): ObjectRoute[] {
        let historyRoute: ObjectRoute[] = [];

        if (!source || source.length == 0) {
            return null;
        } else {
            _.each(source, (r: ObjectRoute) => {
                if (r.object_id == this._currentObjectId && r.positions && r.positions.length > 0) {
                    historyRoute.push(r);
                }
            })
        }

        return historyRoute;
    }

    private setLastRouteTime(route: CurrentObjectRoute): void {
        if (!route || !route.positions || route.positions.length == 0) {
            this._currentRouteTime = null;

            return;
        }

        this._currentRouteTime = route.positions[route.positions.length - 1].time ? moment(route.positions[route.positions.length - 1].time).toDate() : null;
    }

    private reloadRoute(toTime?: Date): void {
        this._currentRouteId = null;
        this._currentRouteStartTime = null;
        this._currentRouteTime = null;
        toTime = toTime ? toTime : new Date();
        let fromTime = this.getStartTime(toTime);

        this.getRout(toTime, fromTime, this._currentObjectId, true, (data: any) => {
            this.createPositions(data, toTime);
            this.updateObjectPositions(this.iqsSmartZoom.zoomLevel);
        });
    }

    private insertCurrentPosition(path: MapPosition[]): MapPosition[] {
        if (this._currentPosition) {
            let time = this._currentPositionTime || this._currentPosition.time || new Date().toISOString();
            let i;
            for (i = path.length - 1; i < 0; i--) {
                if (moment(path[i].time).valueOf() < moment(time).valueOf()) {
                    break;
                }
            }

            // cutt position after current
            if (i != path.length - 1) {
                path = _.take(path, i + 1)
            }
            // add current position
            path.push({
                latitude: _.clone(this._currentPosition.latitude),
                longitude: _.clone(this._currentPosition.longitude),
                time: time
            });
        }

        return path;
    }

    private insertCurrentPoints(points: TimedPosition[]): TimedPosition[] {
        if (this._currentPosition) {
            let newPos = _.cloneDeep(this._currentPosition);
            let time = this._currentPositionTime || this._currentPosition.time || new Date().toISOString();
            newPos.time = time;
            let i;
            for (i = points.length - 1; i < 0; i--) {
                if (moment(points[i].time).valueOf() < moment(time).valueOf()) {
                    break;
                }
            }

            // cutt position after current
            if (i != points.length - 1) {
                points = _.take(points, i + 1)
            }
            // add current position
            points.push(newPos);
        }

        return points;
    }

    private filterPositions(positions: any[], toTime: Date): any[] {
        let fromTime = this.getFromTime(toTime);
        let toTimeString: string;

        if (this._currentPosition) {
            if (moment(this._currentPosition.time).valueOf() < moment(toTime).valueOf()) {
                toTimeString = new Date(moment(this._currentPosition.time).valueOf()).toISOString();
            } else {
                toTimeString = new Date(toTime.getTime()).toISOString();
            }
        } else {
            toTimeString = new Date(toTime.getTime()).toISOString();
        }

        let fromTimeString = fromTime.toISOString();
        if (this._currentPosition) {
            toTimeString = new Date(toTime.getTime()).toISOString();
            toTimeString = toTimeString > this._currentPosition.time ? this._currentPosition.time : toTimeString;
        }

        if (positions == null || positions.length == 0) return positions;
        if (fromTimeString != null) {
            positions = _.filter(positions, p => p.parking || p.stoping || p.time >= fromTimeString);
        }

        if (toTimeString != null) {
            positions = _.filter(positions, p => p.parking || p.stoping || p.time <= toTimeString);
        }

        return positions;
    }

    private extractObjectId(data: any): string {
        let objectId: string;

        if (data[1]) {
            objectId = data[1].object_id;
        }

        if (objectId) return objectId;


        if (data[0] && data[0].length > 0) {
            for (let i = 0; i < data[0].length; i++) {
                if (data[0][i].object_id) {
                    objectId = data[0][i].object_id;

                    return objectId;
                }
            }
        }

        return objectId;
    }

    private createPositions(data: any, toTime: Date): void {
        let currRoute: CurrentObjectRoute = null;
        let historyRoute: ObjectRoute[];
        let objectPositions: RoutePoints[] = [];
        let currentObjectPoints: MapPoint[] = [];

        if (!data || data.length == 0) return;

        let tmpObject = this.iqsObjectsViewModel.getObjectById(this._currentObjectId);
        currRoute = this.takeCurrRoute(data[1])
        historyRoute = this.takeHistoryRoutes(data[0]);

        if (currRoute) {
            // check currentRouteId
            // if (this._currentRouteId && this._currentRouteId != currRoute.id) {
            if (this._currentRouteStartTime && this._currentRouteStartTime != currRoute.start_time) {
                this.reloadRoute();
                return;
            }
            if (!this._currentRouteId) {
                this._currentRouteId = currRoute.id;
                this._currentRouteStartTime = currRoute.start_time;
            }
            // set last position time
            this.setLastRouteTime(currRoute);
        }

        if (historyRoute && historyRoute.length > 0) {
            // sort route
            historyRoute = _.sortBy(historyRoute, (r: ObjectRoute) => {
                return -moment(r.start_time).valueOf();
            });
            let lastTime: Date = null;
            for (let i = historyRoute.length - 1; i >= 0; i--) {
                let r: ObjectRoute = historyRoute[i];
                let endTime = moment(r.end_time).toDate();
                if (!lastTime || lastTime && endTime && endTime.getTime() > lastTime.getTime()) {
                    let op: RoutePoints = this.convertCurrentObjectPositions(<CurrentObjectRoute>r, tmpObject, historyRoute.length - 1 - i);
                    objectPositions.push(op);
                    currentObjectPoints = _.union(currentObjectPoints, op.positions);

                    if (op.positions && op.positions.length > 0) {
                        lastTime = moment(op.positions[op.positions.length - 1].time).toDate();
                    }
                }
            }
        }
        if (currRoute) {
            currRoute.positions = currRoute.positions ? currRoute.positions : [];
            if (this._currentPosition) {
                currRoute.positions = this.insertCurrentPoints(currRoute.positions);
            }
            let op: RoutePoints = this.convertCurrentObjectPositions(currRoute, tmpObject, historyRoute ? historyRoute.length : 0);

            objectPositions.push(op);
            currentObjectPoints = _.union(currentObjectPoints, op.positions);
        }

        currentObjectPoints = this.filterPositions(currentObjectPoints, toTime);;
        this._currentObjectPoints = currentObjectPoints;
        _.each(objectPositions, (op) => {
            op.positions = this.filterPositions(op.positions, toTime);
            op.path = this.filterPositions(op.path, toTime);
        });
        // add current position to path
        if (objectPositions.length > 0 && this._currentPosition) {
            objectPositions[objectPositions.length - 1].path = this.insertCurrentPosition(objectPositions[objectPositions.length - 1].path);
        }

        objectPositions = RouteVisualization.getColoredPath(objectPositions);
        this._objectPositions = RouteVisualization.fixPath(objectPositions, false);
    }

    private filteredOldPositions(currRoute: CurrentObjectRoute): CurrentObjectRoute {
        if (!this._objectPositions || this._objectPositions.length == 0) return currRoute;

        let positions = this._objectPositions[this._objectPositions.length - 1].positions;
        if (!positions || positions.length == 0) return currRoute;

        let time = positions[positions.length - 1].time;
        currRoute.positions = _.filter(currRoute.positions, p => p.time > time);

        return currRoute;
    }

    private updatePositions(data: any, toTime: Date): void {
        let currRoute: CurrentObjectRoute = null;
        if (!data || data.length == 0) return;

        let tmpObject = this.iqsObjectsViewModel.getObjectById(this._currentObjectId);
        currRoute = this.takeCurrRoute(data[1])

        if (currRoute) {
            // check currentRouteId
            // if (this._currentRouteId && this._currentRouteId != currRoute.id) {
            if (this._currentRouteStartTime && this._currentRouteStartTime != currRoute.start_time) {
                this.reloadRoute(this._toTime);
                return;
            }
            if (!this._currentRouteId) {
                this._currentRouteId = currRoute.id;
                this._currentRouteStartTime = currRoute.start_time;
            }
            // update trace
            let index = _.findIndex(this._objectPositions, (p) => { return p.id == currRoute.id });
            // identity routeIndex
            let routeIndex: number = this._objectPositions.length > 0 ? this._objectPositions[this._objectPositions.length - 1].route_index : 0;
            routeIndex = index == -1 ? routeIndex + 1 : routeIndex;

            // filter current Route Positions By time
            currRoute = this.filteredOldPositions(currRoute);
            // add current position
            if (this._currentPosition) {
                currRoute.positions = this.insertCurrentPoints(currRoute.positions);
            }

            let op: RoutePoints = this.convertCurrentObjectPositions(currRoute, tmpObject, routeIndex);
            // add points to end
            this._currentObjectPoints = this.filterPositions(_.union(this._currentObjectPoints, op.positions), toTime);
            let objectPositions = _.cloneDeep(this._objectPositions);
            if (index == -1) {
                // insert positions
                objectPositions.push(op);
            } else {
                // add positions
                objectPositions[index].positions = _.union(objectPositions[index].positions, op.positions);
                objectPositions[index].path = _.union(objectPositions[index].path, op.path);
            }

            _.each(objectPositions, (op) => {
                op.positions = this.filterPositions(op.positions, toTime);
                op.path = this.filterPositions(op.path, toTime);
            });

            // add current position to path
            if (objectPositions.length > 0) {
                objectPositions[objectPositions.length - 1].path = this.insertCurrentPosition(objectPositions[objectPositions.length - 1].path);
            }
            objectPositions = RouteVisualization.getColoredPath(objectPositions);
            this._objectPositions = RouteVisualization.fixPath(objectPositions, false);;
            // set last position time
            this.setLastRouteTime(currRoute);
        }
    }

    private getCurrentObjectRoute(toTime: Date, fromTime: Date, objectId: string, successCallback?: (data?: CurrentObjectRoute) => void, errorCallback?: (error?: any) => void): void {
        if (!objectId) {
            // return empty
            if (successCallback) successCallback(null);

            return
        }

        this.iqsCurrentObjectRoutesData.readObjectPositions(
            {
                object_id: objectId,
                from_time: fromTime.toISOString(),
                to_time: toTime.toISOString(),
            },
            (data: CurrentObjectRoute) => {
                if (successCallback) successCallback(data);
            },
            (error: any) => {
                if (errorCallback) errorCallback(error);
            });
    }

    private getAllObjectRoutes(toTime: Date, fromTime: Date, objectIds?: string[], successCallback?: (data?: ObjectRoute[]) => void, errorCallback?: (error?: any) => void): void {
        if (!objectIds || objectIds.length == 0) {
            // return empty
            if (successCallback) successCallback([]);

            return
        }

        this.iqsObjectRoutesData.readAllObjectsPositions(
            {
                object_ids: objectIds.toString(),
                from_time: fromTime.toISOString(),
                to_time: toTime.toISOString()
            },
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

        return dif <= 0 || dif <= this.TRACE_TIME_INTERVAL
    }

    // property section ==========================

    public get objectPositions(): RoutePoints[] {
        return this._zoomLevel === this.iqsSmartZoom.smartZoomLevels.large.name && this._currentObjectId ? this._objectPositions : [];
    }

    public get objectPoints(): MapPoint[] {
        return this._zoomLevel === this.iqsSmartZoom.smartZoomLevels.large.name && this._currentObjectId ? this._currentObjectPoints : [];
    }

    // public section ==========================

    // clear data 
    public cleanUp(): void {
        this._currentObjectId = null;
        this._currentPosition = null;
        this._currentPositionTime = null;
        this._currentRouteTime = null;
        this._currentRouteId = null;
        this._currentRouteStartTime = null;
        this._routesObjectId = null;
        this._currentObjectPoints = [];
        this._objectPositions = [];
    }

    public updateObjectPositions(zoomLevel: string): void {
        this._zoomLevel = zoomLevel;
        // this._objectPositions = zoomLevel === this.iqsSmartZoom.smartZoomLevels.large.name ? this._objectPositions : [];
        // this._currentObjectPoints = zoomLevel === this.iqsSmartZoom.smartZoomLevels.large.name ? this._currentObjectPoints : [];
    }

    public unfocus(): void {
        this.cleanUp();
    }

    public focus(objectId: string, currentPosition?: any, toTime?: Date, state?: any, isRetro?: boolean): void {
        if (this._currentObjectId === objectId) return;

        let time = toTime ? toTime.getTime() : Date.now();

        this.unfocus();

        this._currentObjectId = objectId;
        this.updateCurrentObjectPositions(currentPosition, toTime, state, isRetro);
    }

    public updateCurrentObjectPositions(currentPostion?: any, toTime?: Date, state?: any, isRetro?: boolean): void {
        if (!this._currentObjectId) return;
        // skip double request
        if (this._routesObjectId == this._currentObjectId) return;

        // start request for object
        this._routesObjectId = this._currentObjectId;
        if (currentPostion) this._currentPosition = currentPostion;
        if (state) this._currentPositionTime = state.time || currentPostion.time;
        else this._currentPositionTime = null;
        
        toTime = toTime ? toTime : new Date();
        let fromTime = this.getStartTime(toTime);

        let getCurrentRoute: boolean;
        getCurrentRoute = this.isCurrentTime(toTime);

        this.getRout(toTime, fromTime, this._currentObjectId, getCurrentRoute, (data: any) => {
            // skip if select other object
            if (this._currentObjectId != this.extractObjectId(data)) return;
            if (!this._routesObjectId) return;

            this._routesObjectId = null;

            if (isRetro) {
                let objectId = this._currentObjectId;
                this.cleanUp();
                this._currentObjectId = objectId;
                this._currentPosition = currentPostion;
                this.createPositions(data, toTime);
            } else {
                if (this._currentRouteId && this._currentRouteStartTime) {
                    this.updatePositions(data, toTime);
                } else {

                    this.createPositions(data, toTime);
                }
            }

            this.updateObjectPositions(this.iqsSmartZoom.zoomLevel);
        });
    }

    public getRout(toTime: Date, fromTime: Date, objectId?: string, loadCurrent?: boolean, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {

        if (!toTime || !objectId) {
            // return empty
            if (successCallback) successCallback([]);

            return
        }
        this._toTime = toTime;

        async.parallel([
            (callback) => {
                if (this._currentRouteId && this._currentRouteStartTime) {
                    callback(null, []);

                    return;
                }
                this.getAllObjectRoutes(
                    toTime, fromTime, [objectId],
                    (data: ObjectRoute[]) => {
                        callback(null, data);
                    }, callback);
            },
            (callback) => {
                if (!loadCurrent) {
                    callback(null, []);

                    return;
                }
                this.getCurrentObjectRoute(
                    toTime, fromTime, objectId,
                    (data: CurrentObjectRoute) => {
                        callback(null, data);
                    }, callback);
            }
        ],
            // optional callback
            (error, results) => {
                if (error) {
                    this._routesObjectId = null;
                    if (errorCallback) errorCallback(error);
                } else if (successCallback) successCallback(results);

            });
    }


}