import { ISmartZoomService, SmartZoomLevel } from './ISmartZoomService';

class SmartZoomService implements ISmartZoomService {
    private _zoomLevel: string;
    public callbacks: Function[] = [];
    private active: boolean = false;

    private _smartZoomLevels: SmartZoomLevel;

    private ZOOM_MIN_LARGE = 13;
    private ZOOM_MIN_MEDIUM = 10;
    private ZOOM_MAX_MEDIUM = 12;
    private ZOOM_MAX_SMALL = 9;

    public constructor(
        private $rootScope: ng.IRootScopeService
    ) {

        this._smartZoomLevels = {
            large: {
                min: this.ZOOM_MIN_LARGE,
                name: 'large'
            },
            medium: {
                min: this.ZOOM_MIN_MEDIUM,
                max: this.ZOOM_MAX_MEDIUM,
                name: 'medium'
            },
            small: {
                max: this.ZOOM_MAX_SMALL,
                name: 'small'
            }
        }
    }

    public get smartZoomLevels(): SmartZoomLevel {
        return this._smartZoomLevels;
    }

    public calculatesmartZoomLevel(organizationRaduis: number): void {
        let zoom: number = Math.round(20 - Math.log(Math.sqrt(organizationRaduis * 2) / 2) / Math.LN2) - 2;
        this._smartZoomLevels.large.min = this.ZOOM_MIN_LARGE > zoom ? zoom : this.ZOOM_MIN_LARGE;
        this._smartZoomLevels.medium.max = this._smartZoomLevels.large.min - 1;
        this._smartZoomLevels.medium.min = this.ZOOM_MAX_MEDIUM <= this._smartZoomLevels.medium.max ? this.ZOOM_MIN_MEDIUM : this._smartZoomLevels.medium.max - 2;
        this._smartZoomLevels.small.max = this._smartZoomLevels.medium.min - 1;
    }

    public addLevelChangedCallback(callback: Function) {
        this.callbacks.push(callback);
    }

    public updateZoomLevel(zoom: number) {
        let newZoomLevel = this.calcZoomLevel(zoom);
        if (newZoomLevel !== this._zoomLevel) {
            this._zoomLevel = newZoomLevel;
            _.each(this.callbacks, (callback) => {
                callback(this.zoomLevel);
            });
        }
    }

    public activate() {
        this.active = true;
    }

    public deactivate() {
        this.active = false;
    }

    public get zoomLevel() {
        return this.active ? this._zoomLevel : this.smartZoomLevels.large.name;
    }

    private calcZoomLevel(zoom: number): string {
        return zoom >= this.smartZoomLevels.large.min ?
            this.smartZoomLevels.large.name : (zoom <= this.smartZoomLevels.small.max ?
                this.smartZoomLevels.small.name : this.smartZoomLevels.medium.name);
    }
}

angular
    .module('iqsSmartZoom', [])
    .service('iqsSmartZoom', SmartZoomService);