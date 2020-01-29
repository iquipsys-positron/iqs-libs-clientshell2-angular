import { TypeCollection, TypeNumericCollection } from './TypeCollection';

export interface ITypeCollectionsService {
    init(): void;
    getZoneType(): TypeCollection;
    getObjectType(): TypeCollection;
    getDeviceType(): TypeCollection;
    getObjectCategory(): TypeCollection;
    getSeverity(): TypeNumericCollection;
    getSignalType(): TypeNumericCollection;
    getEventRuleType(): TypeCollection;
    getBeaconType(): TypeCollection;
    getEventRuleTypeMeasure(): TypeCollection;
    getGatewayModels(): TypeCollection;
    getEmergencyActionTypes(): TypeCollection;
    getCorrectionParametrs(): TypeCollection;
    getCorrectionParametrsMeasure(): TypeCollection;
    getIncidentSignalType(): TypeCollection;
}
