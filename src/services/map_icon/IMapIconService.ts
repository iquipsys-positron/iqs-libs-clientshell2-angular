export class formattedMapIcon {
    url: string;
    scaledSize: any;
    anchor: any;
    direction?: any;
    templateUrl?: string;
    template?: string;
}

export interface IMapIconService {
    getIconByAttrs(type: string, direction: number, status?: string, highlight?: boolean, selected?: boolean, focused?: boolean): formattedMapIcon
}

export interface IMapIconProvider {
    setIconsTemplates(): void;
}