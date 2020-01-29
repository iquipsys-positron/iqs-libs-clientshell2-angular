import { ITypeCollectionsService } from './ITypeCollectionsService';
import { TypeCollectionItem, TypeCollection, TypeNumericCollection } from './';
import {
    BeaconType,
    DeviceType,
    EmergencyActionType,
    EventRuleType,
    GatewayModel,
    IncidentSignalType,
    ObjectCategory,
    ObjectType,
    ParameterName,
    Severity,
    SignalType,
    ZoneType
} from '../../data';

class TypeCollectionsService implements ITypeCollectionsService {
    private objectCategoryCollection: TypeCollection;
    private objectTypeCollection: TypeCollection;
    private deviceTypeCollection: TypeCollection;
    private zoneTypeCollection: TypeCollection;
    private severityCollection: TypeNumericCollection;
    // collection for types rule signals
    private signalTypeCollection: TypeNumericCollection;
    private ruleTypeCollection: TypeCollection;
    private ruleMeasureTypeCollection: TypeCollection;
    private gatewayModelsCollection: TypeCollection;
    private emergencyActionTypeCollection: TypeCollection;
    private correctionParametrsCollection: TypeCollection;
    private correctionParametrsMeasure: TypeCollection;
    private beaconTypeCollection: TypeCollection;
    private incidentSignalTypeCollection: TypeCollection;

    constructor(
        private pipTranslate: pip.services.ITranslateService
    ) {
        "ngInject";

        this.initControlObjectType();
        this.initZoneType();
        this.initDeviceType();
        this.initObjectCategory();
        this.initSeverity();
        this.initEventRuleType();
        this.initBeaconType();
        this.initSignalType();
        this.initEventRuleTypeMeasure();
        this.initGatewayModels(); 
        this.initEmergencyActionType(); 
        this.initCorrectionParametrs(); 
        this.initCorrectionParametrsMeasure(); 
        this.initIncidentSignalTypeCollection(); 
    } 

    private initControlObjectType() {
        this.objectTypeCollection = {};
        this.objectTypeCollection[ObjectType.Employee] = { title: 'OBJECT_TYPE_EMPLOYEE', id: ObjectType.Employee };
        this.objectTypeCollection[ObjectType.Contractor] = { title: 'OBJECT_TYPE_CONTRACTOR', id: ObjectType.Contractor };
        this.objectTypeCollection[ObjectType.Visitor] = { title: 'OBJECT_TYPE_VISITOR', id: ObjectType.Visitor };
        this.objectTypeCollection[ObjectType.Excavator] = { title: 'OBJECT_TYPE_EXCAVATOR', id: ObjectType.Excavator };
        this.objectTypeCollection[ObjectType.HaulTruck] = { title: 'OBJECT_TYPE_HAUL_TRUCK', id: ObjectType.HaulTruck };
        this.objectTypeCollection[ObjectType.Drill] = { title: 'OBJECT_TYPE_DRILL', id: ObjectType.Drill };
        this.objectTypeCollection[ObjectType.Dozer] = { title: 'OBJECT_TYPE_DOZER', id: ObjectType.Dozer };
        this.objectTypeCollection[ObjectType.Grader] = { title: 'OBJECT_TYPE_GRADER', id: ObjectType.Grader };
        this.objectTypeCollection[ObjectType.Bus] = { title: 'OBJECT_TYPE_BUS', id: ObjectType.Bus };
        this.objectTypeCollection[ObjectType.WaterTruck] = { title: 'OBJECT_TYPE_WATER_TRUCK', id: ObjectType.WaterTruck };
        this.objectTypeCollection[ObjectType.BlastTruck] = { title: 'OBJECT_TYPE_BLUST_TRUCK', id: ObjectType.BlastTruck };
        this.objectTypeCollection[ObjectType.SpecialVehicle] = { title: 'OBJECT_TYPE_SPECIAL_VEHICLE', id: ObjectType.SpecialVehicle };
        this.objectTypeCollection[ObjectType.LightVehicle] = { title: 'OBJECT_TYPE_LIGHT_VEHICLE', id: ObjectType.LightVehicle };
        this.objectTypeCollection[ObjectType.Pump] = { title: 'OBJECT_TYPE_PUMP', id: ObjectType.Pump };
        this.objectTypeCollection[ObjectType.Generator] = { title: 'OBJECT_TYPE_GENERATOR', id: ObjectType.Generator };
        this.objectTypeCollection[ObjectType.Crane] = { title: 'OBJECT_TYPE_CRANE', id: ObjectType.Crane };
        this.objectTypeCollection[ObjectType.ForkLift] = { title: 'OBJECT_TYPE_FORK_LIFT', id: ObjectType.ForkLift };
        this.objectTypeCollection[ObjectType.AccessPoint] = { title: 'OBJECT_TYPE_ACCESS_POINT', id: ObjectType.AccessPoint };
        this.objectTypeCollection[ObjectType.Welding] = { title: 'OBJECT_TYPE_WELDING', id: ObjectType.Welding };
        this.objectTypeCollection[ObjectType.Dumpcar] = { title: 'OBJECT_TYPE_DUMPCAR', id: ObjectType.Dumpcar };
        this.objectTypeCollection[ObjectType.Locomotive] = { title: 'OBJECT_TYPE_LOCOMOTIVE', id: ObjectType.Locomotive };
        this.objectTypeCollection[ObjectType.VacuumTruck] = { title: 'OBJECT_TYPE_VACUUM', id: ObjectType.VacuumTruck };
        this.objectTypeCollection[ObjectType.Other] = { title: 'OBJECT_TYPE_OTHER', id: ObjectType.Other };
    }

    private initObjectCategory() {
        this.objectCategoryCollection = {};
        this.objectCategoryCollection[ObjectCategory.People] = { title: 'OBJECT_CATEGORY_PERSON', id: ObjectCategory.People };
        this.objectCategoryCollection[ObjectCategory.Equipment] = { title: 'OBJECT_CATEGORY_EQUIPMENT', id: ObjectCategory.Equipment };
        this.objectCategoryCollection[ObjectCategory.Asset] = { title: 'OBJECT_CATEGORY_ASSET', id: ObjectCategory.Asset };
    }

    private initGatewayModels() {
        this.gatewayModelsCollection = {};
        this.gatewayModelsCollection[GatewayModel.Unknown] = { title: 'GATEWAY_MODEL_UNKNOWN', id: GatewayModel.Unknown };
        this.gatewayModelsCollection[GatewayModel.MultiConnectConduit] = { title: 'GATEWAY_MODEL_MULTI_CONNECT_CONDUIT', id: GatewayModel.MultiConnectConduit };
    }

    private initDeviceType() {
        this.deviceTypeCollection = {};
        this.deviceTypeCollection[DeviceType.Unknown] = { title: 'DEVICE_TYPE_UNKNOWN', id: DeviceType.Unknown };
        this.deviceTypeCollection[DeviceType.Simulated] = { title: 'DEVICE_TYPE_SIMULATED', id: DeviceType.Simulated };
        this.deviceTypeCollection[DeviceType.IoTDevice] = { title: 'DEVICE_TYPE_IOT_TRACKER', id: DeviceType.IoTDevice };
        this.deviceTypeCollection[DeviceType.Smartphone] = { title: 'DEVICE_TYPE_SMART_PHONE', id: DeviceType.Smartphone };
        this.deviceTypeCollection[DeviceType.TeltonikaFmb] = { title: 'DEVICE_TYPE_TELTONIKA_FMB', id: DeviceType.TeltonikaFmb };
    }

    private initZoneType() {
        this.zoneTypeCollection = {};
        this.zoneTypeCollection[ZoneType.Line] = { title: 'ZONE_TYPE_LINE', id: ZoneType.Line };
        this.zoneTypeCollection[ZoneType.Polygon] = { title: 'ZONE_TYPE_POLYGON', id: ZoneType.Polygon };
        this.zoneTypeCollection[ZoneType.Cirle] = { title: 'ZONE_TYPE_CIRCLE', id: ZoneType.Cirle };
        this.zoneTypeCollection[ZoneType.Object] = { title: 'ZONE_TYPE_OBJECT', id: ZoneType.Object };
    }

    private initEventRuleType() {
        this.ruleTypeCollection = {};
        this.ruleTypeCollection[EventRuleType.ShowUp] = { title: 'EVENT_RULE_TYPE_SHOWUP', shortTitle: 'EVENT_RULE_TYPE_SHOWUP_SHORT', id: EventRuleType.ShowUp };
        this.ruleTypeCollection[EventRuleType.Disappear] = { title: 'EVENT_RULE_TYPE_DISAPPEAR', shortTitle: 'EVENT_RULE_TYPE_DISAPPEAR_SHORT', id: EventRuleType.Disappear };
        this.ruleTypeCollection[EventRuleType.MaxSpeed] = { title: 'EVENT_RULE_TYPE_MAX_SPEEDLIMIT', shortTitle: 'EVENT_RULE_TYPE_MAX_SPEEDLIMIT_SHORT', id: EventRuleType.MaxSpeed };
        this.ruleTypeCollection[EventRuleType.MinSpeed] = { title: 'EVENT_RULE_TYPE_MIN_SPEEDLIMIT', shortTitle: 'EVENT_RULE_TYPE_MIN_SPEEDLIMIT_SHORT', id: EventRuleType.MinSpeed };
        this.ruleTypeCollection[EventRuleType.Entry] = { title: 'EVENT_RULE_TYPE_ENTRY', shortTitle: 'EVENT_RULE_TYPE_ENTRY_SHORT', id: EventRuleType.Entry };
        this.ruleTypeCollection[EventRuleType.Exit] = { title: 'EVENT_RULE_TYPE_EXIT', shortTitle: 'EVENT_RULE_TYPE_EXIT_SHORT', id: EventRuleType.Exit };
        this.ruleTypeCollection[EventRuleType.Immobility] = { title: 'EVENT_RULE_TYPE_IMMOBILITY', shortTitle: 'EVENT_RULE_TYPE_IMMOBILITY_SHORT', id: EventRuleType.Immobility };
        this.ruleTypeCollection[EventRuleType.Presence] = { title: 'EVENT_RULE_TYPE_PRESENCE', shortTitle: 'EVENT_RULE_TYPE_PRESENCE_SHORT', id: EventRuleType.Presence };
        this.ruleTypeCollection[EventRuleType.ButtonPressed] = { title: 'EVENT_RULE_TYPE_BUTTONPRESSED', shortTitle: 'EVENT_RULE_TYPE_BUTTONPRESSED_SHORT', id: EventRuleType.ButtonPressed };
        this.ruleTypeCollection[EventRuleType.ButtonLongPressed] = { title: 'EVENT_RULE_TYPE_BUTTONLONGPRESSED', shortTitle: 'EVENT_RULE_TYPE_BUTTONLONGPRESSED_SHORT', id: EventRuleType.ButtonLongPressed };
        this.ruleTypeCollection[EventRuleType.PowerOff] = { title: 'EVENT_RULE_TYPE_POWER_OFF', shortTitle: 'EVENT_RULE_TYPE_POWER_OFF_SHORT', id: EventRuleType.PowerOff };
        this.ruleTypeCollection[EventRuleType.PowerOn] = { title: 'EVENT_RULE_TYPE_POWER_ON', shortTitle: 'EVENT_RULE_TYPE_POWER_ON_SHORT', id: EventRuleType.PowerOn };
    }

    private initBeaconType() {
        this.beaconTypeCollection = {};
        this.beaconTypeCollection[BeaconType.Unknown] = { title: 'BEACON_TYPE_UNKNOWN', shortTitle: 'BEACON_TYPE_UNKNOWN_SHORT', id: BeaconType.Unknown };
        this.beaconTypeCollection[BeaconType.AltBeacon] = { title: 'BEACON_TYPE_ALTBEACON', shortTitle: 'BEACON_TYPE_ALTBEACON_SHORT', id: BeaconType.AltBeacon };
        this.beaconTypeCollection[BeaconType.iBeacon] = { title: 'BEACON_TYPE_MAX_IBEACON', shortTitle: 'BEACON_TYPE_MAX_IBEACON_SHORT', id: BeaconType.iBeacon };
        this.beaconTypeCollection[BeaconType.EddyStoneUdi] = { title: 'BEACON_TYPE_MIN_EDDYSTONEUDI', shortTitle: 'BEACON_TYPE_MIN_EDDYSTONEUDI_SHORT', id: BeaconType.EddyStoneUdi };
    }

    private initIncidentSignalTypeCollection() {
        this.incidentSignalTypeCollection = {};
        this.incidentSignalTypeCollection[IncidentSignalType.All] = { title: 'INCIDENT_SIGNAL_TYPE_ALL', shortTitle: 'INCIDENT_SIGNAL_TYPE_ALL', id: IncidentSignalType.All };
        this.incidentSignalTypeCollection[IncidentSignalType.Email] = { title: 'INCIDENT_SIGNAL_TYPE_EMAIL', shortTitle: 'INCIDENT_SIGNAL_TYPE_EMAIL', id: IncidentSignalType.Email };
        this.incidentSignalTypeCollection[IncidentSignalType.Sms] = { title: 'INCIDENT_SIGNAL_TYPE_SMS', shortTitle: 'INCIDENT_SIGNAL_TYPE_SMS', id: IncidentSignalType.Sms };
        this.incidentSignalTypeCollection[IncidentSignalType.None] = { title: 'INCIDENT_SIGNAL_TYPE_NONE', shortTitle: 'INCIDENT_SIGNAL_TYPE_NONE', id: IncidentSignalType.None };
    }

    private initEventRuleTypeMeasure() {
        this.ruleMeasureTypeCollection = {};
        // this.ruleMeasureTypeCollection[EventRuleType.ShowUp] = { title: 'EVENT_RULE_MEASURE_EMPTY', id: EventRuleType.ShowUp };
        // this.ruleMeasureTypeCollection[EventRuleType.Disappear] = { title: 'EVENT_RULE_MEASURE_EMPTY', id: EventRuleType.Disappear };
        this.ruleMeasureTypeCollection[EventRuleType.MaxSpeed] = { title: 'EVENT_RULE_MEASURE_TYPE_MAX_SPEEDLIMIT', id: EventRuleType.MaxSpeed };
        this.ruleMeasureTypeCollection[EventRuleType.MinSpeed] = { title: 'EVENT_RULE_MEASURE_TYPE_MIN_SPEEDLIMIT', id: EventRuleType.MinSpeed };
        // this.ruleMeasureTypeCollection[EventRuleType.Entry] = { title: 'EVENT_RULE_MEASURE_EMPTY', id: EventRuleType.Entry };
        // this.ruleMeasureTypeCollection[EventRuleType.Exit] = { title: 'EVENT_RULE_MEASURE_EMPTY', id: EventRuleType.Exit };
        this.ruleMeasureTypeCollection[EventRuleType.Immobility] = { title: 'EVENT_RULE_MEASURE_TYPE_IMMOBILITY', id: EventRuleType.Immobility };
        this.ruleMeasureTypeCollection[EventRuleType.Presence] = { title: 'EVENT_RULE_MEASURE_TYPE_PRESENCE', id: EventRuleType.Presence };
        // this.ruleMeasureTypeCollection[EventRuleType.ButtonPressed] = { title: 'EVENT_RULE_MEASURE_EMPTY', id: EventRuleType.ButtonPressed };
        // this.ruleMeasureTypeCollection[EventRuleType.ButtonLongPressed] = { title: 'EVENT_RULE_MEASURE_EMPTY', id: EventRuleType.ButtonLongPressed };
    }

    private initSeverity() {
        this.severityCollection = {};
        this.severityCollection[Severity.Low] = { title: 'SEVERITY_LOW', id: Severity.Low, icon: 'icons:info-circle', class: 'fg-cyan' };
        this.severityCollection[Severity.Medium] = { title: 'SEVERITY_MEDIUM', id: Severity.Medium, icon: 'icons:warn-triangle', class: 'fg-orange' };
        this.severityCollection[Severity.High] = { title: 'SEVERITY_HIGH', id: Severity.High, icon: 'icons:stop', class: 'color-error' };
    }

    private initSignalType() {
        this.signalTypeCollection = {};
        // this.signalTypeCollection[SignalType.None] = { title: 'SIGNAL_TYPE_NONE', id: SignalType.None };
        this.signalTypeCollection[SignalType.Attention] = { title: 'SIGNAL_TYPE_ATTENTION', id: SignalType.Attention };
        this.signalTypeCollection[SignalType.Warning] = { title: 'SIGNAL_TYPE_WARNING', id: SignalType.Warning };
        this.signalTypeCollection[SignalType.Emergency] = { title: 'SIGNAL_TYPE_EMERGENCY', id: SignalType.Emergency };
        this.signalTypeCollection[SignalType.Confirmation] = { title: 'SIGNAL_TYPE_CONFIRMATION', id: SignalType.Confirmation };
    }
    
    private initEmergencyActionType() {
        
        this.emergencyActionTypeCollection = {};
        this.emergencyActionTypeCollection[EmergencyActionType.Note] = { title: 'EMERGENCY_ACTION_TYPE_NOTE', id: EmergencyActionType.Note };
        this.emergencyActionTypeCollection[EmergencyActionType.CallPhone] = { title: 'EMERGENCY_ACTION_TYPE_CALL_PHONE', id: EmergencyActionType.CallPhone };
        this.emergencyActionTypeCollection[EmergencyActionType.LocalLink] = { title: 'EMERGENCY_ACTION_TYPE_LOCAL_LINK', id: EmergencyActionType.LocalLink };
        this.emergencyActionTypeCollection[EmergencyActionType.GlobalLink] = { title: 'EMERGENCY_ACTION_TYPE_GLOBAL_LINK', id: EmergencyActionType.GlobalLink };
    }

    private initCorrectionParametrs() {
        this.correctionParametrsCollection = {};
        this.correctionParametrsCollection[ParameterName.Distance] = { title: 'CORRECTION_PARAMETR_DISTANCE', id: ParameterName.Distance };
        this.correctionParametrsCollection[ParameterName.Online] = { title: 'CORRECTION_PARAMETR_ONLINE', id: ParameterName.Online };
        this.correctionParametrsCollection[ParameterName.Freezed] = { title: 'CORRECTION_PARAMETR_FREEZED', id: ParameterName.Freezed };
        this.correctionParametrsCollection[ParameterName.Emergency] = { title: 'CORRECTION_PARAMETR_EMERGENCY', id: ParameterName.Emergency };
    }

    private initCorrectionParametrsMeasure() {
        this.correctionParametrsMeasure = {};
        this.correctionParametrsMeasure[ParameterName.Distance] = { title: 'CORRECTION_PARAMETR_MEASURE_DISTANCE', id: ParameterName.Distance };
        this.correctionParametrsMeasure[ParameterName.Online] = { title: 'CORRECTION_PARAMETR_MEASURE_ONLINE', id: ParameterName.Online };
        this.correctionParametrsMeasure[ParameterName.Freezed] = { title: 'CORRECTION_PARAMETR_MEASURE_FREEZED', id: ParameterName.Freezed };
        this.correctionParametrsMeasure[ParameterName.Emergency] = { title: 'CORRECTION_PARAMETR_MEASURE_EMERGENCY', id: ParameterName.Emergency };
    }

    private translateCollection(collection) {
        _.each(collection, (item: TypeCollectionItem) => {
            item['name'] = this.pipTranslate.translate(item.title);
        });
    }

    // public
    public getZoneType(): TypeCollection {
        return this.zoneTypeCollection;
    }

    public getObjectType(): TypeCollection {
        return this.objectTypeCollection;
    }

    public getDeviceType(): TypeCollection {
        return this.deviceTypeCollection;
    }

    public getObjectCategory(): TypeCollection {
        return this.objectCategoryCollection;
    }

    public getSeverity(): TypeNumericCollection {
        return this.severityCollection;
    }

    public getIncidentSignalType(): TypeCollection {
        return this.incidentSignalTypeCollection;
    }

    public getSignalType(): TypeNumericCollection {
        return this.signalTypeCollection;
    }

    public getEventRuleType(): TypeCollection {
        return this.ruleTypeCollection;
    }

    public getBeaconType(): TypeCollection {
        return this.beaconTypeCollection;
    }

    public getEventRuleTypeMeasure(): TypeCollection {
        return this.ruleMeasureTypeCollection;
    }

    public getGatewayModels(): TypeCollection {
        return this.gatewayModelsCollection;
    }

    public getEmergencyActionTypes(): TypeCollection {
        return this.emergencyActionTypeCollection;
    }

    public getCorrectionParametrs(): TypeCollection {
        return this.correctionParametrsCollection;
    }

    public getCorrectionParametrsMeasure(): TypeCollection {
        return this.correctionParametrsMeasure;
    }
 
    public init(): void {
        this.translateCollection(this.objectTypeCollection);
        this.translateCollection(this.objectCategoryCollection);
        this.translateCollection(this.deviceTypeCollection);
        this.translateCollection(this.zoneTypeCollection);
        this.translateCollection(this.severityCollection);
        this.translateCollection(this.signalTypeCollection);
        this.translateCollection(this.ruleTypeCollection);
        this.translateCollection(this.ruleMeasureTypeCollection);
        this.translateCollection(this.gatewayModelsCollection);
        this.translateCollection(this.emergencyActionTypeCollection);
        this.translateCollection(this.correctionParametrsCollection);
        this.translateCollection(this.correctionParametrsMeasure);
        this.translateCollection(this.incidentSignalTypeCollection);
    }
}


angular
    .module('iqsTypeCollections.Service', ['pipTranslate'])
    .service('iqsTypeCollectionsService', TypeCollectionsService);

import './TypeCollectionsStrings';