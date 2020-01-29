import { SendSignalData } from '../../data';

export interface ISendSignals {
    updateData(callback: () => void): void;
    sendById(id: string, signalType: number, successcalback?: () => void, errorcalback?: (error: any) => void): void;
    sendBatch(deviceIds: string[], signalType: number, successcalback?: () => void, errorcalback?: (error: any) => void): void;
    getDeviceIdsByObjects(object_ids: string[]): string[];
    getDeviceIdsByGroups(group_ids: string[]): string[];
    getDeviceIdsByZones(zone_ids: string[]): string[];
    sendSignals(data: SendSignalData): void;
}