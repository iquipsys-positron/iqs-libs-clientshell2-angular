export class SmartZoomItem  {
    public min?: number;
    public max?: number;
    public name: string;
}

export class SmartZoomLevel  {
    public large: SmartZoomItem;
    public medium: SmartZoomItem;
    public small: SmartZoomItem;
}

export interface ISmartZoomService {
    zoomLevel: string;
    addLevelChangedCallback(callback: Function): void;
    updateZoomLevel(zoom: number): void;
    activate(): void;
    deactivate(): void;
    calculatesmartZoomLevel(organizationRaduis: number): void;
    
    smartZoomLevels: SmartZoomLevel
}
