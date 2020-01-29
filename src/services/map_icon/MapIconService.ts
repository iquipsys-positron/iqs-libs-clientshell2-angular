import {
    IMapService,
    ISmartZoomService
} from '../';
import { MapIcon, MapIcons } from './MapIcons';

import { IMapIconService, IMapIconProvider, formattedMapIcon } from './IMapIconService';

class statusColorsSmall {
    public static freezed: string = '#000000';
    public static lost: string = '#A3A3A3';
    public static unexpected: string = '#4F2157';
    public static unknown: string = '#03A9F4';
    public static active: string = '#8BC34A';
    public static incidents: string = '#EF5350';
}

class statusColorsLarge {
    public static freezed: string = '#000000';
    public static lost: string = '#505050';
    public static unexpected: string = '#6D0080';//'#4F2157';
    public static unknown: string = '#036A98';
    public static active: string = '#539B00';//'#3F5921';
    public static incidents: string = '#DF0400';//'#9A3432';
}

class MapIconService implements IMapIconService {
    private preTemplate: string = 'data:image/svg+xml;charset=UTF-8;base64,';
    private replaceBackgroundWord: string = '#8B8B8B'; // {{ fillColor }}
    private replaceStrokeWord: string = "#FFFFFF"; // {{ strokeColor }}
    private selectedColor: string = '#FFFFFF';
    private replaceIconColor: string = '#FEFEFE';

    public constructor(
        private iqsMapConfig: IMapService,
        private iqsSmartZoom: ISmartZoomService
    ) { }

    public getIconByAttrs(type: string, direction: number = 0, status: string = 'active', 
        selected: boolean = false, focused: boolean = false, autofocused: boolean = false): formattedMapIcon {
        let isLarge = this.iqsSmartZoom.zoomLevel === this.iqsSmartZoom.smartZoomLevels.large.name;
        direction = isLarge ? direction : 9;

        if (!MapIcons[type]) return;

        const icon: MapIcon = _.clone(MapIcons[type][direction]);
        
        if (!icon) return;

        const tmp = _.clone(icon.template);

        return {
            direction: direction,
            template: tmp,
            templateUrl: icon.templateUrl,
            url: this.preTemplate + btoa(this.replaceColors(tmp, status, selected, focused, autofocused, isLarge)),
            scaledSize: this.getScaledSize(icon, focused),
            anchor: this.getAnchor(icon, focused)
        };

    }

    private getScaledSize(icon: MapIcon, focused: boolean) {
        switch (this.iqsSmartZoom.zoomLevel) {
            case this.iqsSmartZoom.smartZoomLevels.large.name: {
                return focused ? icon.scaledBig : icon.scaledSize;
            }

            case this.iqsSmartZoom.smartZoomLevels.medium.name: {
                // return icon.scaledSize;
                return focused ? icon.scaledMediumFocused : icon.scaledMedium;
            }

            case this.iqsSmartZoom.smartZoomLevels.small.name: {
                // return icon.scaledSize;
                return focused ? icon.scaledSmallFocused : icon.scaledSmall;
            }
        }
    }

    private getAnchor(icon: MapIcon, focused: boolean) {
        switch (this.iqsSmartZoom.zoomLevel) {
            case this.iqsSmartZoom.smartZoomLevels.large.name: {
                return focused ? icon.bigAnchor : icon.anchor;
            }

            case this.iqsSmartZoom.smartZoomLevels.medium.name: {
                return focused ? icon.anchorMediumFocused : icon.anchorMedium;
                // return  icon.anchor;
            }

            case this.iqsSmartZoom.smartZoomLevels.small.name: {
                // return icon.anchor;
                return focused ? icon.anchorSmallFocused : icon.anchorSmall;
            }
        }
    }

    private replaceColors(template: string, status: string, selected: boolean, focused: boolean, autofocused: boolean, isLarge: boolean) {
        return isLarge ?
            this.replaceColorLarge(template, status, selected, focused, autofocused) :
            this.replaceColorNotLarge(template, status, selected, focused);
    }

    private replaceColorLarge(template: string, status: string, selected: boolean, focused: boolean, autofocused: boolean): string {
        if (!template) { return };
        // Replace icon color
        let tmp = template.replace(new RegExp(this.replaceIconColor, 'g'), autofocused ? '#FFEE58' : '#FEFEFE');
        // Replace stroke color
        tmp = tmp.replace(new RegExp(this.replaceStrokeWord, 'g'), selected || focused ? '#FFEE58' : '#FFFFFF');
        // Replace background
        return tmp.replace(new RegExp(this.replaceBackgroundWord, 'g'), statusColorsLarge[status]);
    }

    private replaceColorNotLarge(template: string, status: string, selected: boolean, focused: boolean): string {
        if (!template) { return };
        // Replace stroke
        let tmp = template.replace('#000000', selected || focused ? this.selectedColor : statusColorsSmall[status]);
        // Replace stroke width and opacity
        tmp = tmp.replace(new RegExp('stroke-opacity="0.1"', 'g'), selected || focused ? 'stroke-opacity="0.8"' : 'stroke-opacity="0.1"');
        tmp = tmp.replace(new RegExp('stroke-width="1"', 'g'), focused ? 'stroke-width="3"' : selected ? 'stroke-width="2"' : 'stroke-width="1"');
        // Replace background
        return tmp.replace(new RegExp('#8B8B8B', 'g'), statusColorsSmall[status]);
    }

}

class MapIconProvider {
    private _service: IMapIconService;

    constructor() {
        "ngInject";
    }

    public setIconsTemplates() {
        _.each(MapIcons, (iconSet: MapIcon[]) => {
            _.each(iconSet, (icon: MapIcon) => {
                if (icon.templateUrl && !icon.template) {
                    $.get(icon.templateUrl, (svg) => {
                        icon.template = svg;
                    }, 'text');
                }
            });
        });
    }

    public $get(
        iqsMapConfig: IMapService,
        iqsSmartZoom: ISmartZoomService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new MapIconService(iqsMapConfig, iqsSmartZoom);
        }

        return this._service;
    }
}

function configIconsTemplates(
    iqsMapIconProvider: IMapIconProvider
) {
    iqsMapIconProvider.setIconsTemplates();
}

angular
    .module('iqsMapIcon', ['iqsMapConfig', 'iqsSmartZoom'])
    .provider('iqsMapIcon', MapIconProvider)
    .config(configIconsTemplates);