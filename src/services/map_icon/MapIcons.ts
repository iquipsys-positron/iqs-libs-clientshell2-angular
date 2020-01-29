declare var google: any;

export class MapIcon {
    template?: string;
    templateUrl?: string;
    size?: any;
    anchor?: any;
    scaledSize?: any;
    scaledBig?: any;
    scaledMedium?: any;
    scaledSmall?: any;
    scaledMediumFocused?: any;
    scaledSmallFocused?: any;
    bigAnchor?: any;
    anchorMedium?: any;
    anchorSmall?: any;
    anchorMediumFocused?: any;
    anchorSmallFocused?: any;
}

var NOT_SELECTED_SIZE: number = 36;
var SELECTED_SIZE: number = 48;
var MEDIUM_SIZE: number = 15
var SMALL_SIZE: number = 15; //12;//30
var MEDIUM_SIZE_FOCUSED: number = 18;
var SMALL_SIZE_FOCUSED: number = 18; //15;//37

export class MapIconTypes {
    public static Person: string = 'person';
    public static Equipment: string = 'equipment';
    public static Asset: string = 'asset';
    public static All: string[] = ['person', 'equipment', 'asset'];
}

export class MapIcons {
    static readonly person: MapIcon[] = [
        {
            templateUrl: 'images/MapIcons/People N.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/People NE.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/People E.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/People SE.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/People S.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/People SW.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/People W.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/People NW.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/People.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/People small.svg',
            scaledMedium: new google.maps.Size(MEDIUM_SIZE, MEDIUM_SIZE),
            scaledSmall: new google.maps.Size(SMALL_SIZE, SMALL_SIZE),
            anchorMedium: new google.maps.Point(MEDIUM_SIZE / 2, MEDIUM_SIZE / 2),
            anchorSmall: new google.maps.Point(SMALL_SIZE / 2, SMALL_SIZE / 2),
            scaledMediumFocused: new google.maps.Size(MEDIUM_SIZE_FOCUSED, MEDIUM_SIZE_FOCUSED),
            scaledSmallFocused: new google.maps.Size(SMALL_SIZE_FOCUSED, SMALL_SIZE_FOCUSED),
            anchorMediumFocused: new google.maps.Point(MEDIUM_SIZE_FOCUSED / 2, MEDIUM_SIZE_FOCUSED / 2),
            anchorSmallFocused: new google.maps.Point(SMALL_SIZE_FOCUSED / 2, SMALL_SIZE_FOCUSED / 2)
        }
    ]

    static readonly equipment: MapIcon[] = [
        {
            templateUrl: 'images/MapIcons/Equipment N.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Equipment NE.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Equipment E.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Equipment SE.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Equipment S.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Equipment SW.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Equipment W.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Equipment NW.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Equipment.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Equipment small.svg',
            scaledMedium: new google.maps.Size(MEDIUM_SIZE, MEDIUM_SIZE),
            scaledSmall: new google.maps.Size(SMALL_SIZE, SMALL_SIZE),
            anchorMedium: new google.maps.Point(MEDIUM_SIZE / 2, MEDIUM_SIZE / 2),
            anchorSmall: new google.maps.Point(SMALL_SIZE / 2, SMALL_SIZE / 2),
            scaledMediumFocused: new google.maps.Size(MEDIUM_SIZE_FOCUSED, MEDIUM_SIZE_FOCUSED),
            scaledSmallFocused: new google.maps.Size(SMALL_SIZE_FOCUSED, SMALL_SIZE_FOCUSED),
            anchorMediumFocused: new google.maps.Point(MEDIUM_SIZE_FOCUSED / 2, MEDIUM_SIZE_FOCUSED / 2),
            anchorSmallFocused: new google.maps.Point(SMALL_SIZE_FOCUSED / 2, SMALL_SIZE_FOCUSED / 2)
        }
    ]

    static readonly asset: MapIcon[] = [
        {
            templateUrl: 'images/MapIcons/Assets N.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Assets NE.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Assets E.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Assets SE.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Assets S.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Assets SW.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Assets W.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Assets NW.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Assets.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Assets small.svg',
            scaledMedium: new google.maps.Size(MEDIUM_SIZE, MEDIUM_SIZE),
            scaledSmall: new google.maps.Size(SMALL_SIZE, SMALL_SIZE),
            anchorMedium: new google.maps.Point(MEDIUM_SIZE / 2, MEDIUM_SIZE / 2),
            anchorSmall: new google.maps.Point(SMALL_SIZE / 2, SMALL_SIZE / 2),
            scaledMediumFocused: new google.maps.Size(MEDIUM_SIZE_FOCUSED, MEDIUM_SIZE_FOCUSED),
            scaledSmallFocused: new google.maps.Size(SMALL_SIZE_FOCUSED, SMALL_SIZE_FOCUSED),
            anchorMediumFocused: new google.maps.Point(MEDIUM_SIZE_FOCUSED / 2, MEDIUM_SIZE_FOCUSED / 2),
            anchorSmallFocused: new google.maps.Point(SMALL_SIZE_FOCUSED / 2, SMALL_SIZE_FOCUSED / 2)
        }
    ]

    static readonly undefined: MapIcon[] = [
        {
            templateUrl: 'images/MapIcons/Unknown N.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Unknown NE.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Unknown E.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Unknown SE.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Unknown S.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Unknown SW.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Unknown W.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Unknown NW.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Unknown.svg',
            scaledSize: new google.maps.Size(NOT_SELECTED_SIZE, NOT_SELECTED_SIZE),
            scaledBig: new google.maps.Size(SELECTED_SIZE, SELECTED_SIZE),
            anchor: new google.maps.Point(NOT_SELECTED_SIZE / 2, NOT_SELECTED_SIZE / 2),
            bigAnchor: new google.maps.Point(SELECTED_SIZE / 2, SELECTED_SIZE / 2)
        },
        {
            templateUrl: 'images/MapIcons/Unknown small.svg',
            scaledMedium: new google.maps.Size(MEDIUM_SIZE, MEDIUM_SIZE),
            scaledSmall: new google.maps.Size(SMALL_SIZE, SMALL_SIZE),
            anchorMedium: new google.maps.Point(MEDIUM_SIZE / 2, MEDIUM_SIZE / 2),
            anchorSmall: new google.maps.Point(SMALL_SIZE / 2, SMALL_SIZE / 2),
            scaledMediumFocused: new google.maps.Size(MEDIUM_SIZE_FOCUSED, MEDIUM_SIZE_FOCUSED),
            scaledSmallFocused: new google.maps.Size(SMALL_SIZE_FOCUSED, SMALL_SIZE_FOCUSED),
            anchorMediumFocused: new google.maps.Point(MEDIUM_SIZE_FOCUSED / 2, MEDIUM_SIZE_FOCUSED / 2),
            anchorSmallFocused: new google.maps.Point(SMALL_SIZE_FOCUSED / 2, SMALL_SIZE_FOCUSED / 2)
        }
    ]
}