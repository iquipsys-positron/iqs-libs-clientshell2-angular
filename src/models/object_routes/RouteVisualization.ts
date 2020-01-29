declare var google;
import { CurrentObjectRoute, TimedPosition, RoutePoints, MapPoint, RouteType, PositionShort, MapPosition } from '../../data';

export class RouteVisualization {

    // private static strokeColor = ["#4CAF50", "#F8E81C", "#F44336"]
    // private static strokeColor = ["#F8E81C", "#cddc39", "#8bc34a", "#4caf50", "#009688", "#ec407a", "#ef5350", "#ff5722", "#ff9800"];
    // private static strokeColor = ["#F8E81C", "#76FF03", "#00C853", "#00BCD4", "#303F9F", "#880E4F", "#D32F2F", "#E65100", "#F9A825"];
    private static strokeColor = ["#F8E81C", "#F7C644", "#F29C38", "#C531F0", "#64E2FB", "#6AE5B9", "#99FB4E"];

    private static CUTT_INTERVAL = 900 * 1000; // 15 min 

    private static DEFAULT_DOTTRACE_COLOR = '#F8E81C';
    // private static lineStroke = {
    //     color: '#F8E81C',
    //     weight: 3
    // };

    private static lineOptions = {
        zIndex: 19
    };

    private static highlightColor: string = './images/Circles/CircleYellow.svg';

    // private static urls: string[] = [
    //     './images/Circles/CircleGreen.svg', './images/Circles/CircleYellow.svg', './images/Circles/CircleRed.svg'
    // ];
    // private static urls: string[] = [
    //     './images/Circles/c3.svg',
    //     './images/Circles/c4.svg', './images/Circles/c5.svg', './images/Circles/c6.svg',
    //     './images/Circles/c7.svg', './images/Circles/c8.svg', './images/Circles/c9.svg',
    //     './images/Circles/c1.svg', './images/Circles/c2.svg'
    // ];

    private static notHighlightColor: string = './images/Circles/CircleBlue.svg';
    private static selectedColor: string = './images/Circles/CircleDarkBlue.svg';

    // private static notSelectedScale: number = 6;
    private static normalPointScale: number = 8;
    // private static bigPointScale: number = 12;

    private static _pointTemplate: any = {
        icon: {
            url: './images/Circles/CircleBlue.svg',
            scaledSize: new google.maps.Size(8, 8), // this.normalPointScale, this.normalPointScale
            anchor: new google.maps.Point(8 / 2, 8 / 2) // this.normalPointScale / 2, this.normalPointScale / 2
        }
    };

    private static _pointParckingTemplate: any = {
        icon: {
            url: './images/MapIcons/Parking_sign.svg',
            scaledSize: new google.maps.Size(26, 33),
            scaledBig: new google.maps.Size(26, 33),
            anchor: new google.maps.Point(13, 33)
        }
    };

    private static _pointStopTemplate: any = {
        icon: {
            url: './images/MapIcons/Stop_sign.svg',
            scaledSize: new google.maps.Size(26, 33),
            scaledBig: new google.maps.Size(26, 33),
            anchor: new google.maps.Point(13, 33)
        }
    };

    public static calcDistance(fromLat, fromLng, toLat, toLng) {
        return google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
    }

    public static getClass(word) {
        return word.length > 30 ? 'long' : word.length > 5 ? 'medium' : 'short';
    }

    public static getAnchor(word) {
        return word.length > 30 ? 80 : word.length > 5 ? 48 : 16;
    }

    public static shortLabel(label: string) {
        return label.length > 35 ? label.substr(0, 35) + '...' : label;
    }

    // public functions ------------------------------

    //isShowLabel = this.iqsSmartZoom.zoomLevel === this.iqsSmartZoom.smartZoomLevels.large.name
    public static setLabel(head, objectName: string, objectDescription: string, isShowLabel: boolean) {
        let labelContent = objectName.replace(/\s+/g, ' ');;
        let labelDescription = objectDescription.replace(/\s+/g, ' ');;
        let maxLength = labelContent.length > labelDescription.length ? labelContent : labelDescription;

        head.options = isShowLabel ? {
            labelContent: labelContent + '\n' + labelDescription,
            labelAnchor: this.getAnchor(maxLength) + ' -20',
            labelClass: 'unselected-marker-label' + ' ' + this.getClass(maxLength),
            zIndex: 30
        } : { zIndex: 30 };
    }

    public static getDirection(angle): number {
        if (angle >= 337.5 || angle <= 22.5) {
            return 0;
        }

        if (angle > 22.5 && angle <= 67.5) {
            return 1;
        }

        if (angle > 67.5 && angle <= 112.5) {
            return 2;
        }

        if (angle > 112.5 && angle <= 157.5) {
            return 3;
        }

        if (angle > 157.5 && angle <= 202.5) {
            return 4;
        }

        if (angle > 202.5 && angle <= 247.5) {
            return 5;
        }

        if (angle > 247.5 && angle <= 292.5) {
            return 6;
        }

        if (angle > 292.5 && angle <= 337.5) {
            return 7;
        }


        return 8;
    }

    private static getIconTemplate(type: string): any {
        if (type == RouteType.Stay) {
            return _.cloneDeep(this._pointParckingTemplate);
        }

        if (type == RouteType.Stop) {
            return _.cloneDeep(this._pointStopTemplate);
        }

        return _.cloneDeep(this._pointTemplate);
    }

    private static getColorOfPoints(index: number): string {
        if (index === undefined || index === null || index === -1) {
            return this.highlightColor;
        }
        // if (index === -2) {
        //     return this.notHighlightColor;
        // }
        // let i = index % this.urls.length;

        // return this.urls[i];
        if (index === -2) {
            return this.notHighlightColor;
        }

        return this.selectedColor;
    }

    // index = -1 - highlightColor url
    // index = -2 - nothighlightColor url
    // index > -1 - choose url from array or selectedColor
    private static getPosition(p: TimedPosition, tmpObject: any, route: CurrentObjectRoute, index: number = -1): MapPoint {
        let pos: MapPoint;
        let template = this.getIconTemplate(route.type)

        pos = angular.extend({
            latitude: p.lat,
            longitude: p.lng,
            object_id: route.object_id,
            object: tmpObject,
            time: p.time,
            agl: p.angle,
            spd: p.speed,
            id: p.time + route.type,
            parking: route.type == RouteType.Stay,
            stoping: route.type == RouteType.Stop,
            options: {
                zIndex: route.type == RouteType.Stay ? 12 : route.type == RouteType.Stop ? 11 : 10
                // labelClass: 'unselected-marker-label medium text-overflow',
            }
        }, _.cloneDeep(template));

        if (!pos.parking && !pos.stoping) {
            pos.icon.url = this.getColorOfPoints(index);
        }

        if (pos.parking || pos.stoping) {
            pos.duration_time = route.duration;
        }

        return pos;
    }

    // RouteInfo
    public static getRoutInfo(route: RoutePoints,  pos: MapPosition): MapPoint {
        if (!route || !route.path || route.path.length == 0) return null;
        let point: MapPoint;
        let position: MapPosition = this.getNearestPoint(route, pos);

        if (!position) return null;

        point = {
            latitude: position.latitude,
            longitude: position.longitude,
            object_id: route.object_id,
            object: route.obj,
            time: position.time,
            id: position.time + route.type,
            options: {
                zIndex:  10
            }
        };

        return point;
    }

    private static getNearestPoint(route: RoutePoints,  pos: MapPosition): MapPosition {
        let j: number = 0;
        let distance: number = this.calcDistance(route.path[j].latitude, route.path[j].longitude, pos.latitude, pos.longitude);
        for (let i = 1; i < route.path.length; i++) {
            let newDistance = this.calcDistance(route.path[i].latitude, route.path[i].longitude, pos.latitude, pos.longitude);

            if (distance > newDistance) {
                distance = newDistance;
                j = i;
            }
        }

        return route.path[j];
    }

    // set color for line (all point have one color) 
    public static setColoredPath(objectPositions: RoutePoints[], color?: string): RoutePoints[] {
        return _.map(objectPositions, (rp: RoutePoints) => {
            if (rp.stroke) rp.stroke.color = color ? color : this.DEFAULT_DOTTRACE_COLOR;

            return rp;
        });
    }

    // set color for line (all point have one color) 
    public static getColoredPath(objectPositions: RoutePoints[]): RoutePoints[] {
        // get objects routes
        let i: number = 0;
        let colorIndex: number = 0;
        let travelCount: number = 0;
        for (i = 0; i < objectPositions.length; i++) {
            objectPositions[i].positions = _.map(objectPositions[i].positions, (point: MapPoint) => {
                if (!point.parking && !point.stoping) {
                    let p = _.cloneDeep(point)
                    p.icon.url = this.selectedColor; //this.getColorOfPoints(colorIndex);
                    point = p;
                }
                return point;
            });
            objectPositions[i].stroke.color = this.strokeColor[colorIndex % this.strokeColor.length];
            if (objectPositions[i].type == RouteType.Travel || objectPositions[i].type == RouteType.Stop) travelCount = 1;
            if (objectPositions[i].type == RouteType.Stay && travelCount > 0) {
                colorIndex++;
                objectPositions[i].stroke.color = this.strokeColor[colorIndex % this.strokeColor.length];
                travelCount = 0;
            }
        }

        return objectPositions;
    }

    // take last points time 
    private static takeLastTime(r: RoutePoints): number {
        if (!r || !r.path || r.path.length == 0) return null;

        return moment(r.path[r.path.length - 1].time).valueOf();
    }

    // take first points time 
    private static takeFirstTime(r: RoutePoints): number {
        if (!r || !r.path || r.path.length == 0) return null;

        return moment(r.path[0].time).valueOf();
    }

    private static isEquivPosition(pos1: MapPosition , pos2: MapPosition): boolean {
        return pos1.latitude == pos2.latitude && pos1.longitude == pos2.longitude;
    }

    private static checkCuttInterval(current: RoutePoints, next: RoutePoints, isCompressing: boolean): boolean {
        let currTiks: number = this.takeLastTime(current);
        let nextTiks: number = this.takeFirstTime(next);

        return currTiks && nextTiks && (currTiks + this.CUTT_INTERVAL >= nextTiks) || isCompressing;
    }

    private static updateStopStopPath(current: RoutePoints, next: RoutePoints): MapPosition[] {
        if (!current || !current.path || current.path.length == 0) return current.path;
        if (!next || !next.path || next.path.length == 0) return current.path;

        current.path.push(next.path[0]);

        return current.path;
    }

    private static updateStopTravelPath(current: RoutePoints, next: RoutePoints): MapPosition[] {
        if (!current || !current.path || current.path.length == 0) return current.path;
        if (!next || !next.path || next.path.length == 0) return current.path;

        if (!this.isEquivPosition(current.path[0], next.path[0])) {
            current.path.push(next.path[0]);
        } 

        return current.path;
    }

    private static updateTravelStopPath(current: RoutePoints, next: RoutePoints): MapPosition[] {
        if (!current || !current.path || current.path.length == 0) return current.path;
        if (!next || !next.path || next.path.length == 0) return current.path;

        if (!this.isEquivPosition(current.path[current.path.length - 1], next.path[0])) {
            current.path.push(next.path[0]);
        } 

        return current.path;
    }
    
    private static updateTravelTravelPath(current: RoutePoints, next: RoutePoints): MapPosition[] {
        if (!current || !current.path || current.path.length == 0) return current.path;
        if (!next || !next.path || next.path.length == 0) return current.path;

        if (!this.isEquivPosition(current.path[current.path.length - 1], next.path[0])) {
            current.path.push(next.path[0]);
        } 

        return current.path;
    }

    // fix move afterStop path and stopAter move path 
    public static fixPath(positions: RoutePoints[], isCompressing: boolean): RoutePoints[] {
        if (positions.length == 0) return positions;

        let objectPositions: RoutePoints[] = _.cloneDeep(positions);
        let i: number = 0;

        for (i = 1; i < objectPositions.length; i++) {
            let current: RoutePoints = objectPositions[i - 1];
            let next: RoutePoints = objectPositions[i];
            if (this.checkCuttInterval(current, next, isCompressing)) {

                // stop && stop route
                if (current.type == RouteType.Stop && next.type == RouteType.Stop ||
                    current.type == RouteType.Stay && next.type == RouteType.Stop ||
                    current.type == RouteType.Stop && next.type == RouteType.Stay) {
                    current.path = this.updateStopStopPath(current, next);
                }
                // stop && travel route
                if ((current.type == RouteType.Stop || current.type == RouteType.Stay)
                     && next.type == RouteType.Travel) {
                    current.path = this.updateStopTravelPath(current, next);
                }
                // travel && stop route
                if (current.type == RouteType.Travel && (next.type == RouteType.Stop || next.type == RouteType.Stay)) {
                    current.path = this.updateTravelStopPath(current, next);
                }
                // travel && travel route
                if (current.type == RouteType.Travel && next.type == RouteType.Travel) {
                    current.path = this.updateTravelTravelPath(current, next);
                }
            }
        }

        // sort last path
        let path = _.sortBy(objectPositions[objectPositions.length - 1].path, (r) => {
            return moment(r.time).valueOf();
        });
        // delete dublicat
        path = _.uniqBy(path, (p) => p.time);
        objectPositions[objectPositions.length - 1].path = path;

        return objectPositions;
    }

    public static mapPositions(route: CurrentObjectRoute, tmpObject: any, routeIndex: number): MapPoint[] {
        if (route.type == RouteType.Travel) {
            return [];
            // return _.map(route.positions, (p: TimedPosition) => {
            //     return this.getPosition(p, tmpObject, route, routeIndex)
            // })
        } else {
            if (route.positions.length > 0) return [this.getPosition(route.positions[0], tmpObject, route, routeIndex)]
        }

        return [];
    }

    public static mapPath(route: CurrentObjectRoute): MapPosition[] {
        if (route.type == RouteType.Travel) {
            return _.map(route.positions, (p: TimedPosition) => {
                return {
                    time: p.time,
                    latitude: p.lat,
                    longitude: p.lng
                }
            })
        } else {
            if (route.positions.length > 0) return [{
                time: route.positions[0].time,
                latitude: route.positions[0].lat,
                longitude: route.positions[0].lng
            }]
        }

        return [];
    }

    public static getRoutePoints(route: CurrentObjectRoute, tmpObject: any, colorIndex: number): RoutePoints {
        if (!route) return null;

        let obj = {
            name: tmpObject.name,
            id: tmpObject.id,
            type: tmpObject.type,
            description: tmpObject.description,
            category: tmpObject.category
        }
        colorIndex = colorIndex % this.strokeColor.length;
        return {
            id: route.id || route.object_id,
            object_id: route.object_id,
            start_time: route.start_time,
            end_time: route.end_time,
            obj: obj,
            type: route.type,
            positions: this.mapPositions(route, obj, colorIndex),
            path: this.mapPath(route),
            start_addr: route.start_addr,
            end_addr: route.end_addr,
            stroke: {
                // color: '#F8E81C',
                color: this.strokeColor[colorIndex] || this.DEFAULT_DOTTRACE_COLOR,
                weight: 3
            },
            // route_index: routeIndex,
            options: this.lineOptions,
            icons: [{
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 2
                },
                // offset: '50%',
                repeat: '50px'
            }]
          
        }
    }

    public static addHighlights(objectsPoints: MapPoint[], objectId?: string): MapPoint[] {
        _.each(objectsPoints, (point) => {
            if (point.object_id === objectId) {
                if (!point.parking && !point.stoping) {
                    point.icon.url = this.highlightColor;
                    point.icon.scaledSize = new google.maps.Size(this.normalPointScale, this.normalPointScale);
                    point.icon.anchor = new google.maps.Point(this.normalPointScale / 2, this.normalPointScale / 2);
                }
            }
        });

        return objectsPoints;
    }

    public static selectPath(objectPositions: RoutePoints[], objectId?: string): RoutePoints[] {
        let path: RoutePoints[] = [];
        if (!objectId) return path;

        _.each(objectPositions, (op: RoutePoints) => {
            if (op.object_id == objectId) {
                path.push(_.cloneDeep(op));
            }
        });

        return path;
    }

    // return center of points
    public static getHighlightCenter(objectPoints: MapPoint[], objectId?: string): PositionShort {
        let latitude: number;
        let longitude: number;
        let right: number = -1000;
        let left: number = 1000;
        let top: number = -1000;
        let bottom: number = 1000;

        _.each(objectPoints, (point) => {
            if (!objectId || point.object_id === objectId) {
                if (point.latitude > top) { top = point.latitude }
                if (point.latitude < bottom) { bottom = point.latitude }
                if (point.longitude > right) { right = point.longitude }
                if (point.longitude < left) { left = point.longitude }
            }
        });
        latitude = (top + bottom) / 2;
        longitude = (right + left) / 2;

        return <PositionShort>{
            lat: latitude,
            lng: longitude
        }
    }
}