declare module iqs.shell {

export const ShellStateName = "shell";
export const ClientConfiguration: {
    AddOrganizationNav: boolean;
    AddOrganizationLanding: boolean;
    RemoveOrganizationNav: boolean;
    AddToDemo: boolean;
};



class HttpResponseInterceptor implements ng.IHttpInterceptor {
    private $q;
    private $location;
    private $rootScope;
    private $injector;
    private incrementalTimeout;
    constructor($q: ng.IQService, $location: ng.ILocationService, $rootScope: ng.IRootScopeService, $injector: ng.auto.IInjectorService);
    private retryRequest(httpConfig);
    responseError: (rejection: any) => ng.IPromise<any>;
}
function configureHttpInterceptor($stateProvider: ng.ui.IStateProvider, $httpProvider: ng.IHttpProvider): void;


export class TimeZones {
    static allZones: string[];
    static zones: string[];
}

export class MultiString {
    [language: string]: string;
}

export class States {
    static readonly Progress: string;
    static readonly Data: string;
    static readonly Empty: string;
    static readonly Add: string;
    static readonly Edit: string;
}

export class DataPage<T> {
    constructor(data?: T[], total?: number);
    total: number;
    data: T[];
}

export enum GridTypes {
    Group = "group",
    Formated = "formated",
    Time = "time",
}


export const enum Severity {
    Low = 0,
    Medium = 50,
    High = 100,
}
















































function configAccountsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configActivitiesResources(pipRestProvider: pip.rest.IRestProvider): void;

function configManualAgreementResources(pipRestProvider: pip.rest.IRestProvider): void;

function configApplicationsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configAttendancesResources(pipRestProvider: pip.rest.IRestProvider): void;

function configBeaconsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configControlObjectsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configManualCorrectionsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configCountersResources(pipRestProvider: pip.rest.IRestProvider): void;

function configManualCreditCardResources(pipRestProvider: pip.rest.IRestProvider): void;

function configCurrentDeviceStateResources(pipRestProvider: pip.rest.IRestProvider): void;

function configCurrObjectRoutesResources(pipRestProvider: pip.rest.IRestProvider): void;

function configCurrentObjectStateResources(pipRestProvider: pip.rest.IRestProvider): void;

function configDataProfilesResources(pipRestProvider: pip.rest.IRestProvider): void;

function configDevicesResources(pipRestProvider: pip.rest.IRestProvider): void;

function configEmergencyPlansResources(pipRestProvider: pip.rest.IRestProvider): void;

function configEventRulesResources(pipRestProvider: pip.rest.IRestProvider): void;

function configEventsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configEventTemplateResources(pipRestProvider: pip.rest.IRestProvider): void;

function configGatewaysResources(pipRestProvider: pip.rest.IRestProvider): void;

function configHelpArticlesResources(pipRestProvider: pip.rest.IRestProvider): void;

function configHelpTopicsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configIncidentsResources(pipRestProvider: pip.rest.IRestProvider): void;


function configInvitationsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configLocationsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configLoggingResources(pipRestProvider: pip.rest.IRestProvider): void;

function configObjectGroupsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configObjectPositionsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configObjectRoutesResources(pipRestProvider: pip.rest.IRestProvider): void;

function configObjectStateResources(pipRestProvider: pip.rest.IRestProvider): void;

function configOperationalEventResources(pipRestProvider: pip.rest.IRestProvider): void;

function configPipStatisticsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configResolutionsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configRolesResources(pipRestProvider: pip.rest.IRestProvider): void;

function configRostersResources(pipRestProvider: pip.rest.IRestProvider): void;

function configSessionsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configSettingsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configShiftsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configSignalsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configOrganizationResources(pipRestProvider: pip.rest.IRestProvider): void;

function configStatisticsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configZonesResources(pipRestProvider: pip.rest.IRestProvider): void;


export interface IShellService {
    hideNav: string[];
    hideBar: string[];
    hideAux: string[];
    addOrganizations: string;
    panel: string;
    hideMain(): string[];
}
export interface IShellProvider {
    hideNav: string[];
    hideBar: string[];
    hideAux: string[];
    addOrganizations: string;
    addHideBar(value: string): any;
    addHideNav(value: string): any;
    addHideAux(value: string): any;
}


export {};




export interface IValidatorsService {
    validatePhone(value: string): boolean;
    setPhoneValidity(value: string, form: any, fieldName: string, fieldValidatorName: string): void;
    validateEmail(email: any): boolean;
    setEmailValidity(value: string, form: any, fieldName: string, fieldValidatorName: string): void;
}

const EMAIL_REGEXP: RegExp;
function EmailValidator(): ng.IDirective;

const PHONE_REGEXP: RegExp;
function PhoneValidator(): ng.IDirective;

function UniqueValidator($parse: ng.IParseService): ng.IDirective;

export {};


export class SearchResultChecked extends SearchResult {
    checked?: boolean;
}


export {};

export interface IEventRuleFormatService {
    formatObjectsList(item: EventRule): string;
}


export interface IObjectFormatService {
    formatSubtitle(item: ControlObject): string;
}














export const UnauthorizedStateName: string;

export {};

function setUnauthorizedErrorPageResources($injector: angular.auto.IInjectorService): void;

export class AccessRole {
    static readonly empty: number;
    static readonly user: number;
    static readonly manager: number;
    static readonly admin: number;
    static readonly roles: string[];
}


export class Account {
    roles?: any[];
    theme?: string;
    language?: string;
    time_zone?: string;
    create_time?: string;
    change_pwd_time?: string;
    login: string;
    name?: string;
    id?: string;
    organizations?: Organization[];
}

export {};

export interface IAccountsDataService {
    readAllAccounts(params: any, successCallback?: (data: DataPage<Account>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readAccounts(params: any, successCallback?: (data: DataPage<Account>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readAccount(id: string, successCallback?: (data: Account) => void, errorCallback?: (error: any) => void): any;
    saveAccount(data: Account, successCallback?: (data: Account) => void, errorCallback?: (error: any) => void): any;
    updateAccount(id: string, data: Account, successCallback?: (data: Account) => void, errorCallback?: (error: any) => void): any;
    deleteAccount(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
}
export interface IAccountsDataProvider {
}


export {};

export class Activity {
    id: string;
    time: Date;
    type: string;
    party: any;
    ref_item: any;
    ref_parents: any;
    ref_party: any;
    details: string;
}

export interface IActivitiesDataService {
    readActivities(id: string, params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createActivity(data: Activity, successCallback?: (data: Activity) => void, errorCallback?: (error: any) => void): void;
    readActivity(id: string, successCallback?: (data: Activity) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateActivity(id: string, data: Activity, successCallback?: (data: Activity) => void, errorCallback?: (error: any) => void): void;
    deleteActivity(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    removeActivity(params: any, successCallback?: any, errorCallback?: any): any;
}
export interface IActivitiesDataProvider {
}


export class Application {
    id: string;
    name: MultiString;
    description?: MultiString;
    product: string;
    group?: string;
    copyrights?: string;
    url?: string;
    icon?: string;
    min_ver?: number;
    max_ver?: number;
}

export {};

export class ApplicationTile extends Application {
    isFavourite: boolean;
}

export interface IApplicationsDataService {
    readApplications(params: any, successCallback?: (data: DataPage<Application>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readApplication(id: string, successCallback?: (data: Application) => void, errorCallback?: (error: any) => void): any;
    saveApplication(data: Application, successCallback?: (data: Application) => void, errorCallback?: (error: any) => void): any;
    updateApplication(id: string, data: Application, successCallback?: (data: Application) => void, errorCallback?: (error: any) => void): any;
    deleteApplication(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
}
export interface IApplicationsDataProvider {
}


export class Agreement {
    id?: string;
    number: string;
    create_time?: Date;
    active?: boolean;
    start_time?: Date;
    end_time?: Date;
    company?: string;
    content?: string;
    inn?: string;
}

export const enum AgreementCategory {
    Card = "card",
    Agreement = "agreement",
}

export {};

export interface IAgreementsDataService {
    readAgreements(params: any, successCallback?: (data: DataPage<Agreement>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readAgreement(params: any, successCallback?: (data: DataPage<Agreement>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createAgreement(data: Agreement, successCallback?: (data: Agreement) => void, errorCallback?: (error: any) => void): any;
    updateAgreement(id: string, data: Agreement, successCallback?: (data: Agreement) => void, errorCallback?: (error: any) => void): void;
    deleteAgreement(id: string, customer_id?: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
    verifyAgreement(number: string, successCallback?: (data: DataPage<Agreement>) => void, errorCallback?: (error: any) => void): void;
}
export interface IAgreementsDataProvider {
}


expoorg_ids Attendance {
    organization_id: string;
    object_id: string;
    start_date?: string;
    end_date?: string;
    start_time: string;
    end_time: string;
}

export class Attendances {
    org_iding;
    organization_id: string;
    start_time: string;
    end_time: string;
    objects?: ObjectAttendance[];
}

export {};

export interface IAttendancesDataService {
    readAttendances(params: any, successCallback?: (data: Attendances) => void, errorCallback?: (error: any) => void): any;
    readAttendance(id: string, successCallback?: (data: Attendance) => void, errorCallback?: (error: any) => void): any;
    saveAttendance(data: Attendance, successCallback?: (data: Attendance) => void, errorCallback?: (error: any) => void): any;
    deleteAttendance(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
}
export interface IAttendancesDataProvider {
}


export class ObjectAttendance {
    object_id: string;
    start_time: string;
    end_time: string;
}

export class Beacon {
    id: string;
    org_idI?: string;
    organization_id: string;
    udi: string;
    type?: string;
    label?: string;
    center?: any;
    radius?: number;
}

export {};

export const enum BeaconType {
    Unknown = "unknown",
    AltBeacon = "altbeacon",
    iBeacon = "ibeacon",
    EddyStoneUdi = "eddystone-udi",
}

export interface IBeaconsDataService {
    readBeacon(params: any, successCallback?: (data: Beacon) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readBeacons(params: any, successCallback?: (data: DataPage<Beacon>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createBeacon(data: Beacon, successCallback?: (data: Beacon) => void, errorCallback?: (error: any) => void): void;
    updateBeacon(id: string, data: Beacon, successCallback?: (data: Beacon) => void, errorCallback?: (error: any) => void): void;
    deleteBeacon(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    verifyBeaconUdi(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    calculatePosition(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
}
export interface IBeaconsDataProvider extends ng.IServiceProvider {
}


export class ControlObject {
    org_iding;
    organization_id: string;
    category: string;
    type: string;
    deleted: boolean;
    name: string;
    description: string;
    phone: string;
    pin: string;
    email?: string;
    device_id: string;
    group_ids: string[];
    state?: ObjectState;
    longitude?: number;
    latitude?: number;
    icon?: any;
    groups?: string;
    perm_assign_id?: string;
}

export {};

export interface IControlObjectsDataService {
    readControlObjects(params: any, successCallback?: (data: DataPage<ControlObject>) => void, errorCallback?: (error: any) => void): any;
    readControlObject(id: string, successCallback?: (data: ControlObject) => void, errorCallback?: (error: any) => void): any;
    saveControlObject(data: ControlObject, successCallback?: (data: ControlObject) => void, errorCallback?: (error: any) => void): any;
    updateControlObject(id: string, data: ControlObject, successCallback?: (data: ControlObject) => void, errorCallback?: (error: any) => void): any;
    deleteControlObject(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
}
export interface IControlObjectsDataProvider {
}


export const enum ObjectCategory {
    People = "person",
    Equipment = "equipment",
    Asset = "asset",
}

export const enum ObjectType {
    Employee = "employee",
    Contractor = "contractor",
    Visitor = "visitor",
    Excavator = "excavator",
    HaulTruck = "haul",
    Drill = "drill",
    Dozer = "dozer",
    Grader = "grader",
    Bus = "bus",
    WaterTruck = "water",
    BlastTruck = "blast",
    SpecialVehicle = "special",
    LightVehicle = "light",
    Locomotive = "locomotive",
    Dumpcar = "dumpcar",
    VacuumTruck = "vacuum",
    Pump = "pump",
    Generator = "generator",
    Crane = "crane",
    ForkLift = "fork lift",
    AccessPoint = "access point",
    Welding = "welding",
    Other = "other",
}

export class Correction {
    org_iding;
    organization_id: string;
    object_id?: string;
    group_id?: string;
    affected_ids?: string[];
    reason?: string;
    status: string;
    time?: Date;
    create_time: Date;
    creator_id?: string;
    creator_name?: string;
    close_time?: Date;
    closer_id?: string;
    closer_name?: string;
    changes?: CorrectionChange[];
}

export class CorrectionChange {
    param_name?: string;
    event_rule_id?: string;
    zone_id?: string;
    value: number;
}

export {};

export const enum CorrectionStatus {
    Requested = "requested",
    Approved = "approved",
    Rejected = "rejected",
}

export interface ICorrectionsDataService {
    readCorrection(id: string, successCallback?: (data: Correction) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readCorrections(params: any, successCallback?: (data: DataPage<Correction>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createCorrection(data: Correction, successCallback?: (data: Correction) => void, errorCallback?: (error: any) => void): void;
    updateCorrection(id: string, data: Correction, successCallback?: (data: Correction) => void, errorCallback?: (error: any) => void): void;
    deleteCorrection(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}
export interface ICorrectionsDataProvider extends ng.IServiceProvider {
}


export const enum ParameterName {
    Distance = "distance",
    Online = "online",
    Offline = "offline",
    Freezed = "freezed",
    immobile = "immobile",
    Emergency = "emergency",
}

export class Address {
    line1: string;
    line2?: string;
    city: string;
    zip?: string;
    postal_code?: string;
    country_code: string;
}

export class CreditCard {
    id?: string;
    customer_id?: string;
    create_time?: Date;
    update_time?: Date;
    type?: string;
    number?: string;
    expire_month?: number;
    expire_year?: number;
    first_name?: string;
    last_name?: string;
    billing_address?: Address;
    state?: string;
    ccv?: string;
    name?: string;
    saved?: boolean;
    default?: boolean;
}

export {};

export const enum CreditCardState {
    Ok = "ok",
    Expired = "expired",
}

export const enum CreditCardType {
    Visa = "visa",
    Mastercard = "mastercard",
    AmericanExpress = "amex",
    Discover = "discover",
    Maestro = "maestro",
}

export interface ICreditCardsDataService {
    readCreditCards(params: any, successCallback?: (data: DataPage<CreditCard>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readCreditCard(params: any, successCallback?: (data: DataPage<CreditCard>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createCreditCard(data: CreditCard, successCallback?: (data: CreditCard) => void, errorCallback?: (error: any) => void): any;
    updateCreditCard(id: string, data: CreditCard, successCallback?: (data: CreditCard) => void, errorCallback?: (error: any) => void): void;
    deleteCreditCard(id: string, customer_id?: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
}
export interface ICreditCardsDataProvider {
}


export class CurrentDeviceState {
    org_iding;
    organization_id: string;
    object_id?: string;
    time: Date;
    pos?: any;
    alt?: number;
    angle?: number;
    speed?: number;
    quality?: number;
    longitude?: number;
    latitude?: number;
}

export {};

export interface ICurrentDeviceStatesDataService {
    readCurrentDeviceState(id: string, successCallback?: (data: CurrentDeviceState) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readCurrentDeviceStates(successCallback?: (data: DataPage<CurrentDeviceState>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}
export interface ICurrentDeviceStatesDataProvider {
}


export class CurrentObjectRoute {
    org_iding;
    organization_id: string;
    object_id: string;
    type?: string;
    start_time?: Date;
    start_addr?: PositionAddress;
    end_time?: Date;
    end_addr?: PositionAddress;
    duration?: number;
    compressed?: number;
    positions?: TimedPosition[];
}

export {};

export interface ICurrentObjectRoutesDataService {
    readObjectsPositions(params: any, successCallback?: (data: DataPage<CurrentObjectRoute>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readObjectPositions(params: any, successCallback?: (data: CurrentObjectRoute) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readAllObjectsPositions(params: any, successCallback?: (data: CurrentObjectRoute[]) => void, errorCallback?: (error: any) => void): void;
}
export interface ICurrentObjectRoutesDataProvider {
}


export class MapPoint {
    time: Date;
    latitude: number;
    longitude: number;
    alt?: number;
    spd?: number;
    agl?: number;
    object: any;
    object_id?: string;
    duration_time?: number;
    parking?: boolean;
    stoping?: boolean;
    options?: any;
    id?: string;
    icon?: any;
    color?: string;
}

export class MapPosition {
    time: Date;
    latitude: number;
    longitude: number;
}

expoorg_ids ObjectPosition {
    organization_id: string;
    object_id: string;
    time: Date;
    lat: number;
    lng: number;
    alt?: number;
    speed?: number;
    angle?: number;
}

export class RoutePoints {
    id: string;
    object_id: string;
    start_time: Date;
    end_time: Date;
    type?: string;
    start_addr?: PositionAddress;
    end_addr?: PositionAddress;
    positions: MapPoint[];
    path?: MapPosition[];
    icons?: any[];
    obj?: any;
    stroke?: any;
    options?: any;
    color?: string;
    route_index?: number;
}

export const enum RouteType {
    Travel = "travel",
    Stop = "stop",
    Stay = "stay",
}

export class TimedPosition {
    time: Date;
    lat: number;
    lng: number;
    alt?: number;
    speed?: number;
    angle?: number;
}

export {};

export interface ICurrentObjectStatesDataService {
    readCurrentObjectState(object_id: string, successCallback?: (data: ObjectState) => void, errorCallback?: (error: any) => void): any;
    readCurrentObjectStates(successCallback?: (data: DataPage<ObjectState>) => void, errorCallback?: (error: any) => void): void;
}
export interface ICurrentObjectStatesDataProvider {
}


export class DataProfile {
    state_types: DataProfileStateType[];
    command_types: DataProfileCommandType[];
    event_types: DataProfileEventType[];
    param_types: DataProfileParamType[];
}
export class DataProfileStateType {
    id: number;
    name: string;
    algorithm: string;
}
export class DataProfileCommandType extends DataProfileStateType {
    min_value: number;
    max_value: number;
}
export class DataProfileEventType extends DataProfileStateType {
    min_value: number;
    max_value: number;
}
export class DataProfileParamType extends DataProfileStateType {
    min_value?: number;
    max_value?: number;
    state?: number;
}

export {};

export interface IDataProfilesDataService {
    readDataProfiles(successCallback?: (data: DataProfile) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}
export interface IDataProfilesDataProvider {
}


export class EventRuleCondition {
    "max value"?: number;
    "min value"?: number;
    "duration"?: number;
    conditionString?: string;
    conditionName?: string;
}
export class EventRule {
    org_iding;
    organization_id: string;
    type: string;
    name: string;
    deleted?: boolean;
    create_time?: Date;
    condition?: EventRuleCondition;
    severity?: number;
    interval?: number;
    incident?: boolean;
    show_journal?: boolean;
    send_message?: boolean;
    recipient_ids?: string[];
    send_signal?: boolean;
    signal?: number;
    all_objects?: boolean;
    include_object_ids?: string[];
    exclude_object_ids?: string[];
    include_group_ids?: string[];
    exclude_group_ids?: string[];
    all_zones?: boolean;
    include_zone_ids?: string[];
    exclude_zone_ids?: string[];
    includeObjectsDescription?: string;
    excludeObjectsDescription?: string;
    recipient_names?: string;
}

export class EventRuleAction {
    type: string;
    params: any;
}

export const enum EventRuleActionParam {
    Resolution = "resolution",
    Count = "count",
    Phone = "phone",
    Email = "email",
}

export const enum EventRuleActionType {
    Incident = "incident",
    SendSignal = "signal",
    SendSms = "sms",
    SendEmail = "email",
}

export const enum EventRuleConditionParam {
    MaxValue = "max value",
    MinValue = "min value",
    Duration = "duration",
}

export {};

export const enum EventRuleType {
    ShowUp = "show up",
    Disappear = "disappear",
    MaxSpeed = "max speed",
    MinSpeed = "min speed",
    Entry = "entry",
    Exit = "exit",
    Immobility = "immobility",
    Presence = "presence",
    ButtonPressed = "button pressed",
    ButtonLongPressed = "button long pressed",
    PowerOn = "power on",
    PowerOff = "power off",
}

export interface IEventRulesDataService {
    readEventRules(params: any, successCallback?: (data: DataPage<EventRule>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createEventRule(data: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void;
    readEventRule(id: string, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateEventRule(id: string, data: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void;
    deleteEventRule(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}
export interface IEventRulesDataProvider {
}


export class EventTemplate {
    org_iding;
    organization_id: string;
    severity: number;
    description: string;
    set_time: boolean;
    set_object: boolean;
    set_pos: boolean;
}

export {};

export interface IEventTemplatesDataService {
    readEventTemplate(id: string, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readEventTemplates(params: any, successCallback?: (data: DataPage<EventTemplate>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createEventTemplate(data: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void;
    updateEventTemplate(id: string, data: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void;
    deleteEventTemplate(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}
export interface IEventTemplatesDataProvider extends ng.IServiceProvider {
}


export class CommStatistics {
    device_udi?: string;
    init_time?: Date;
    up_time?: Date;
    up_packets?: number;
    up_errors?: number;
    down_time?: Date;
    down_packets?: number;
    down_errors?: number;
    device_type?: string;
    device_label?: string;
}

export class Gateway {
    org_iding;
    organization_id: string;
    model?: string;
    version?: number;
    udi: string;
    label?: string;
    create_time?: Date;
    active?: boolean;
    rec_time?: Date;
    ping_time?: Date;
    stats_time?: Date;
    stats?: CommStatistics[];
}

export const enum GatewayModel {
    Unknown = "unknown",
    MultiConnectConduit = "multiconnect conduit",
}

export {};

export interface IGatewaysDataService {
    readGateway(params: any, successCallback?: (data: Gateway) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readGateways(params: any, successCallback?: (data: DataPage<Gateway>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createGateway(data: Gateway, successCallback?: (data: Gateway) => void, errorCallback?: (error: any) => void): void;
    updateGateway(id: string, data: Gateway, successCallback?: (data: Gateway) => void, errorCallback?: (error: any) => void): void;
    deleteGateway(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    verifyGatewayUdi(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    statsGateway(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    pingGateway(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
}
export interface IGatewaysDataProvider extends ng.IServiceProvider {
}


export const enum GuideStatus {
    New = "new",
    Writing = "writing",
    Translating = "translating",
    Verifying = "verifying",
    Completed = "completed",
}

export const enum GuideType {
    Introduction = "introduction",
    NewRelease = "new release",
}


export class HelpArticle {
    id: string;
    topic_id?: string;
    app: string;
    index?: number;
    min_ver?: number;
    max_ver?: number;
    create_time?: Date;
    content: HelpArticleContent[];
    tags?: string[];
    all_tags?: string[];
    status?: string;
    custom_hdr?: any;
    custom_dat?: any;
}

export class HelpArticleContent {
    language: string;
    title: string;
    content?: pip.compoorganization.ContentBlock[];
}

export {};

export const enum HelpArticleStatus {
    New = "new",
    Writing = "writing",
    Translating = "translating",
    Verifying = "verifying",
    Completed = "completed",
}

export class HelpTopic {
    id: string;
    parent_id?: string;
    app: string;
    index?: number;
    title: any;
    popular?: boolean;
    custom_hdr?: any;
    custom_dat?: any;
    translateTitle: string;
}

export class HelpTopicListItem extends HelpTopicTreeItem {
    sub_topics_count?: number;
    listIndex?: number;
    level?: number;
    showCurrent?: boolean;
}

export {};

export class HelpTopicTreeItem extends HelpTopic {
    super_topic: HelpTopicTreeItem[];
    sub_topic: HelpTopicTreeItem[];
    showTopic: boolean;
}

export interface IHelpArticlesDataService {
    readHelpArticles(params: any, successCallback?: (data: DataPage<HelpArticle>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readHelpArticle(id: any, successCallback?: (data: HelpArticle) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export interface IHelpTopicsDataService {
    readHelpTopics(params: any, successCallback?: (data: DataPage<HelpTopic>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readHelpTopic(id: any, successCallback?: (data: HelpTopic) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createHelpTopic(data: HelpTopic, successCallback?: (data: HelpTopic) => void, errorCallback?: (error: any) => void): void;
}


export interface IIncidentsDataService {
    readIncidentsCount(successCallback?: (cnt: number) => void, errorCallback?: (error: any) => void): void;
    readIncident(id: string, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readIncidents(params: any, successCallback?: (data: DataPage<Incident>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createIncident(data: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void;
    updateIncident(id: string, data: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void;
    deleteIncident(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}
export interface IIncidentsDataProvider extends ng.IServiceProvider {
}

export class Incident {
    org_iding;
    organization_id: string;
    create_time?: string;
    closed?: boolean;
    close_time?: string;
    closer_id?: string;
    closer_name?: string;
    event_id: string;
    rule_id: string;
    severity: number;
    time: Date;
    pos?: any;
    group_id?: string;
    object_id?: string;
    assign_id?: string;
    loc_id?: string;
    zone_id?: string;
    resolution?: string;
    resolution_id?: string;
    description: string;
    expected_value?: any;
    actual_value?: any;
    value_units?: string;
    object?: ControlObject;
    ref_name?: string;
    ref_id?: string;
    timeString?: string;
    assigned_name?: string;
}

export const enum IncidentActions {
    Open = "INCIDENT_OPEN",
    Close = "INCIDENT_CLOSE",
    Hide = "INCIDENT_HIDE",
}

export {};

export class IncidentSettings {
    rule_id: string;
    rule_name: string;
    enabled: boolean;
    include_object_ids?: string[];
    exclude_object_ids?: string[];
    include_group_ids?: string[];
    exclude_group_ids?: string[];
    expanded?: boolean;
    sendSignalType?: string;
}

export const enum IncidentSignalType {
    All = "all",
    None = "none",
    Sms = "sms",
    Email = "email",
}


export interface IInvitationsDataService {
    readInvitations(params: any, successCallback?: (data: DataPage<Invitation>) => void, errorCallback?: (error: any) => void): any;
    saveInvitation(data: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void): any;
    updateInvitation(id: string, data: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void): any;
    deleteInvitation(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
    resendInvitation(invite: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void): any;
    denyInvitation(invite: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void): any;
    approveInvitation(invite: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void): any;
    sendNotifyMessage(invite: Invitation, successCallback?: (data?: Invitation) => void, errorCallback?: (error: any) => void): any;
}
export interface IInvitationsDataProvider {
}


export class Invitation {
    id: string;
    org_id string;
    organization_id: string;
    organization_name?: string;
    role?: string;
    language?: string;
    create_time?: Date;
    creator_name?: string;
    creator_id: string;
    invitee_name?: string;
    invitee_email?: string;
    invitee_id?: string;
    sent_time?: Date;
    expire_time?: Date;
}

export const enum InvitationAction {
    Approve = "approve",
    Activate = "activate",
    Notify = "notify",
}

export {};

export interface ILocationsDataService {
    readLocation(id: string, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readLocations(params: any, successCallback?: (data: DataPage<Location>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createLocation(data: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void;
    updateLocation(id: string, data: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void;
    deleteLocation(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}
export interface ILocationsDataProvider {
}


export class Location {
    org_iding;
    organization_id: string;
    name: string;
    pos: any;
}

export {};


export interface IObjectGroupsDataService {
    readObjectGroup(id: string, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readObjectGroups(params: any, successCallback?: (data: DataPage<ObjectGroup>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createObjectGroup(data: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void;
    updateObjectGroup(id: string, data: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void;
    deleteObjectGroup(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}
export interface IObjectGroupsDataProvider {
}

export class ObjectGroup {
    org_iding;
    organization_id: string;
    name: string;
    deleted: boolean;
    object_ids: string[];
}

export {};


export interface IObjectPositionsDataService {
    readObjectsPositions(params: any, successCallback?: (data: DataPage<ObjectPositions>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readObjectPositions(params: any, successCallback?: (data: DataPage<ObjectPositions>) => void, errorCallback?: (error: any) => void): void;
    getObjectsPositionsCount(params: any, successCallback?: (data: number) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}
export interface IObjectPositionsDataProvider {
}

export class Position {
    time: Date;
    lat: any;
    lng: any;
    agl: number;
    spd: number;
    duration_time?: number;
    parking?: boolean;
    stoping?: boolean;
}
export class ObjectPositions {
    org_iding;
    organization_id: string;
    object_id: string;
    start_time: Date;
    end_time: Date;
    last_time?: Date;
    positions: Position[];
    path?: any[];
    icons?: any[];
    stroke?: any;
    duration_time?: number;
    parking?: boolean;
    stoping?: boolean;
}

export {};


export interface IObjectRoutesDataService {
    readObjectsPositions(params: any, successCallback?: (data: DataPage<ObjectRoute>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readObjectPositions(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readAllObjectsPositions(params: any, successCallback?: (data: ObjectRoute[]) => void, errorCallback?: (error: any) => void): void;
}
export interface IObjectRoutesDataProvider {
}

export class ObjectRoute {
    org_iding;
    organization_id: string;
    object_id: string;
    type: string;
    start_time: Date;
    start_addr?: PositionAddress;
    end_time: Date;
    end_addr?: PositionAddress;
    duration: number;
    positions: PositionShort[];
}

export {};

export class PositionAddress {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country_code: string;
}

export class PositionShort {
    lat: number;
    lng: number;
}


export interface IObjectStatesDataService {
    readObjectState(object_id: string, successCallback?: (data: ObjectState) => void, errorCallback?: (error: any) => void): any;
    readObjectStates(to: string, successCallback?: (data: DataPage<ObjectState>) => void, errorCallback?: (error: any) => void): void;
}
export interface IObjectStatesDataProvider {
}

export class ObjectState {
    org_iding;
    organization_id: string;
    device_id: string;
    object_id: string;
    time: Date;
    pos: any;
    alt?: number;
    angle?: number;
    speed?: number;
    quality?: number;
    expected?: boolean;
    connected?: boolean;
    online: number;
    offline?: number;
    freezed: number;
    immobile: number;
    pressed?: boolean;
    long_pressed?: boolean;
    power?: boolean;
    power_changed?: boolean;
    groups_ids?: string[];
    zones?: ZonePresence[];
    beacons?: string[];
    pos_time?: Date;
    pos_rec?: any;
    state_time?: Date;
    rule_time?: Date;
    attend_time?: Date;
    attend_start?: Date;
    assign_id?: string;
    assign_time?: Date;
    assigner?: boolean;
    assignee?: boolean;
    emergency: number;
    rules?: EventRule[];
    zone_ids: string[];
    lat?: any;
    lng?: any;
    device?: Device;
    object?: ControlObject;
    highlighted?: boolean;
    selected?: boolean;
    focused?: boolean;
    direction?: number;
    status?: string;
    icon?: any;
    longitude?: number;
    latitude?: number;
    options?: any;
    isActive?: boolean;
    assigned_name?: string;
}

export {};


export interface IOperationalEventsDataService {
    readOperationalEvents(params: any, successCallback?: (data: DataPage<OperationalEvent>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createOperationalEvent(data: OperationalEvent, successCallback?: (data: OperationalEvent) => void, errorCallback?: (error: any) => void): void;
    deleteOperationalEvent(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}
export interface IOperationalEventsDataProvider extends ng.IServiceProvider {
}

export class OperationEventReferenceRecord {
    id?: string;
    event_id?: string;
    type?: string;
    object_type?: string;
    name?: string;
    description?: string;
    locationName?: string;
    item?: any;
    longitude?: number;
    latitude?: number;
    incidentValue?: string;
    timeString?: string;
    ref_groups?: string;
    resolution?: string;
    resolution_time?: string;
    resolution_close?: string;
    accountName?: string;
    assigned_name?: string;
}
export class OperationalEvent {
    org_idring;
    organization_id?: string;
    create_time?: string;
    creator_id?: string;
    rule_id?: string;
    type?: string;
    severity: number;
    time: string;
    pos?: any;
    group_id?: string;
    object_id?: string;
    loc_id?: string;
    assign_id?: string;
    zone_id?: string;
    ref_event_id?: string;
    description: string;
    expected_value?: any;
    actual_value?: any;
    value_units?: string;
    eventValue?: string;
    ref?: OperationEventReferenceRecord;
    timeString?: string;
}

export {};

export const enum OperationalEventType {
    HiddenRecord = "hidden",
    AutoRecord = "auto",
    ManualRecord = "manual",
    Incident = "incident",
    Resolution = "resolution",
}


export interface IResolutionsDataService {
    readResolution(id: string, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readResolutions(params: any, successCallback?: (data: DataPage<Resolution>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createResolution(data: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void;
    updateResolution(id: string, data: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void;
    deleteResolution(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}
export interface IResolutionsDataProvider {
}

export class Resolution {
    org_iding;
    organization_id: string;
    rule_ids: string[];
    default?: boolean;
    resolution: string;
    rule_id?: string;
}

export {};


export interface IRolesDataService {
    readRoles(params: any, successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    deleteRole(params: any, successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): void;
    createRole(params: any, data: any, successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): void;
    grantRoles(id: string, body: string[], successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    revokeRoles(id: string, body: string[], successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}
export interface IRolesDataProvider {
}

export {};


export interface IRostersDataService {
    readRosters(params: any, successCallback?: (data: DataPage<Roster>) => void, errorCallback?: (error: any) => void): any;
    readRoster(id: string, successCallback?: (data: Roster) => void, errorCallback?: (error: any) => void): any;
    saveRoster(data: Roster, successCallback?: (data: Roster) => void, errorCallback?: (error: any) => void): any;
    updateRoster(id: string, data: Roster, successCallback?: (data: Roster) => void, errorCallback?: (error: any) => void): any;
    deleteRoster(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
}
export interface IRostersDataProvider {
}

export class Roster {
    org_iding;
    organization_id: string;
    name: string;
    shift_id?: string;
    start_date: string;
    start_time?: string;
    end_time?: string;
    objects?: RosterObject[];
}
export class RosterObject {
    object_id: string;
    assign_id: string;
    planned?: boolean;
    actual?: boolean;
    start_time?: string;
    end_time?: string;
}

export {};


export interface ISessionsDataService {
    readSessions(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    deleteSession(params: any, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}
export interface ISessionsDataProvider {
}

export class Session {
    id: string;
    user_id: string;
    user_name: string;
    active: boolean;
    open_time: Date;
    close_time: Date;
    request_time: Date;
    address: string;
    client: string;
    user: any;
    data: any;
}

export {};

export class EmailSettings {
    id?: string;
    name?: string;
    email: string;
    language?: string;
    subscriptions?: any;
    verified?: boolean;
    ver_code?: string;
    ver_expire_time?: Date;
    custom_hdr?: any;
    custom_dat?: any;
}

export {};

export interface IEmailSettingsDataService {
    readEmailSettings(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateEmailSettings(params: any, data: EmailSettings, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    verifyEmail(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    resendEmail(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}


export interface ISmsSettingsDataService {
    readSmsSettings(params: any, successCallback?: (data: SmsSettings) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateSmsSettings(params: any, data: SmsSettings, successCallback?: (data: SmsSettings) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    verifyPhone(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    resendPhone(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export class SmsRecipient {
    id: string;
    name?: string;
    phone: string;
    language?: string;
}

export class SmsSettings {
    id?: string;
    name?: string;
    phone?: string;
    language?: string;
    subscriptions?: any;
    verified?: boolean;
    ver_code?: string;
    ver_expire_time?: Date;
    custom_hdr: any;
    custom_dat: any;
}

export {};


export interface IShiftsDataService {
    readShifts(params: any, successCallback?: (data: DataPage<Shift>) => void, errorCallback?: (error: any) => void): any;
    readShift(id: string, successCallback?: (data: Shift) => void, errorCallback?: (error: any) => void): any;
    saveShift(data: Shift, successCallback?: (data: Shift) => void, errorCallback?: (error: any) => void): any;
    updateShift(id: string, data: Shift, successCallback?: (data: Shift) => void, errorCallback?: (error: any) => void): any;
    deleteShift(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
}
export interface IShiftsDataProvider {
}

export class Shift {
    org_iding;
    organization_id: string;
    name: string;
    deleted?: boolean;
    start: number;
    duration: number;
    startDate?: Date;
    endDate?: Date;
}

export {};


export interface ISignalsDataService {
    readSignals(params: any, successCallback?: (data: DataPage<Signal>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    saveSignal(data: Signal, successCallback?: (data: Signal) => void, errorCallback?: (error: any) => void): any;
    deleteSignal(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
    lockSignal(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    closeSignal(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
}
export interface ISignalsDataProvider {
}

export class SendSignalData {
    object_ids: string[];
    zone_ids: string[];
    group_ids: string[];
    signal: number;
}

export class Signal {
    org_idring;
    organization_id: string;
    device_id?: string;
    time?: Date;
    type: number;
    sent?: boolean;
    lock_until?: number;
}

export {};

export const enum SignalType {
    None = 0,
    Attention = 1,
    Confirmation = 2,
    Warning = 3,
    Emergency = 4,
}


export interface IOrganizationsDataService {
    readOrganizations(params: any, successCallback?: (data: DataPage<Organization>) => void, errorCallback?: (error: any) => void): any;
    readOrganization(id: string, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void): any;
    updateOrganization(id: string, data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void): any;
    saveOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void): any;
    deleteOrganization(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
    generateCode(id: string, successCallback?: (data) => void, errorCallback?: (error: any) => void): any;
    demoConnect(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    removeOrganization(id: string, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void): any;
    findOrganizationByCode(code: string, successCallback?: (data) => void, errorCallback?: (error: any) => void): any;
    validateCode(code: string, successCallback?: (data) => void, errorCallback?: (error: any) => void): any;
    addToCluster(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
}
export interface IOrganizationsDataProvider {
}

export class OrganizationsIndustry {
    static readonly Mining: string;
    static readonly Quarries: string;
    static readonly Oil: string;
    static readonly Civil: string;
    static readonly Road: string;
    static readonly Tourism: string;
    static readonly Other: string;
}
export class Organization {
    id: string;
    code?: string;
    create_time: Date;
    creator_id: string;
    deleted?: boolean;
    active: boolean;
    version?: number;
    name: string;
    description?: string;
    address?: string;
    center?: any;
    radius?: number;
    geometry?: any;
    boundaries?: any;
    language?: string;
    timezone?: string;
    industry?: OrganizationsIndustry;
    org_size?: number;
    total_organizations?: number;
    purpose?: string;
    active_int?: number;
    inactive_int?: number;
    offorganization_int?: number;
    offline_timeout?: number;
    data_rate?: number;
    params?: any;
    map_id?: string;
    map_north?: number;
    map_south?: number;
    map_west?: number;
    map_east?: number;
}

export {};


export interface IStatisticsDataService {
    readStatistics(params: any, successCallback?: (data: any[]) => void, errorCallback?: (error: any) => void): any;
    updateStatistics(id: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
    saveStatistics(data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
}
export interface IStatisticsDataProvider {
}

export class StatisticsValue {
    value: number;
}
export class Statistics {
    group: string;
    name: string;
    type: number | string;
    values: StatisticsValue[];
}

export {};

export const enum StatisticsFilter {
    Yearly = "Yearly",
    Monthly = "Monthly",
    Daily = "Daily",
    Weekly = "Weekly",
}

export const enum StatisticsView {
    Chart = "chart",
    Grid = "grid",
    List = "list",
}


export interface IZonesDataService {
    readZone(object_id: string, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): any;
    readZones(params: any, successCallback?: (data: DataPage<Zone>) => void, errorCallback?: (error: any) => void): any;
    saveZone(data: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): any;
    updateZone(id: string, data: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): any;
    deleteZone(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): any;
}
export interface IZonesDataProvider {
}

export class Zone {
    org_idring;
    organization_id?: string;
    type?: string;
    name: string;
    center?: any;
    distance?: number;
    geometry?: any;
    boundaries?: any;
    include_object_ids?: string[];
    include_group_ids?: string[];
    exclude_object_ids?: string[];
    exclude_group_ids?: string[];
    path?: any[];
    fill?: any;
    stroke?: any;
    included?: any[];
    excluded?: any[];
}

export class ZonePresence {
    zone_id: string;
    duration: number;
}

export {};

export const enum ZoneType {
    Line = "line",
    Polygon = "polygon",
    Cirle = "circle",
    Object = "object",
}

export class AccountParams {
    skip: number;
    total: boolean;
    size: number;
    type?: string;
}
export class AccountsModel {
    private $location;
    private iqsAccountsData;
    private pipTransaction;
    private iqsOrganization;
    state: string;
    allAccounts: Account[];
    accounts: Account[];
    selectedIndex: number;
    private transaction;
    private selectedItem;
    constructor($location: ng.ILocationService, iqsAccountsData: IAccountsDataService, pipTransaction: pip.services.ITransactionService, iqsOrganization: IOrganizationService);
    private sortCollection(data);
    private setState();
    getAccountsAll(filter: any, successCallback?: (data: Account[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    getAccounts(filter: string, successCallback?: (data: Account[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    selectItem(index?: number): void;
    filterAccounts(filter?: string): void;
    filterWithArrayObjects(objects: SearchResult[]): void;
    getAccountById(accountId: string): Account;
    getTransaction(): pip.services.Transaction;
    private getAccountsCallback(data, filter?, successCallback?);
    saveAccount(data: Account, callback?: (item: Account) => void, errorCallback?: (err: any) => void): void;
    remove(id: string): void;
    deleteAccount(id: string, callback?: () => void, errorCallback?: () => void): void;
    updateAccount(data: Account, callback?: (item) => void, errorCallback?: (err) => void): void;
    clean(): void;
}

export {};

export interface IAccountsViewModel {
    initAccounts(filter?: string, successCallback?: (data: Account[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    filterAccounts(filter: string): any;
    selectItem(index?: number): any;
    getAccountById(accountId: string): Account;
    saveAccount(data: Account, callback: (item: Account) => void, error: (err: any) => void): any;
    updateAccount(data: Account, callback: (item: Account) => void, error: (err: any) => void): any;
    deleteAccount(id: any, callback: () => void, error: () => void): any;
    filterWithArrayObjects(objects: SearchResult[]): any;
    getTransaction(): pip.services.Transaction;
    getAccountsAll(filter?: any, successCallback?: (data: Account[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    clean(): void;
    state: string;
    selectedIndex: number;
    accounts: Account[];
    allAccounts: Account[];
}


export class AppbarAction {
    name: string;
    icon?: string;
    count?: number;
    event?: string;
}
export class AppbarActionSettings {
    menu: string;
    breakpoints: any;
}
export class AppbarActionsModel {
}

export class ApplicationCategory {
    key: string;
    tiles: ApplicationTile[];
}
export class ApplicationsModel {
    private iqsApplicationsData;
    private iqsSettingsViewModel;
    private iqsOrganization;
    private readonly favouritesKey;
    private readonly favouritesDefaultIds;
    private categoriesIndex;
    private categoryRanks;
    applications: ApplicationTile[];
    favouritesDefault: ApplicationTile[];
    categories: ApplicationCategory[];
    favouritesOrDefault: ApplicationTile[];
    state: string;
    constructor(iqsApplicationsData: IApplicationsDataService, iqsSettingsViewModel: ISettingsViewModel, iqsOrganization: IOrganizationService);
    private setState();
    private saveFavourites(successCallback?, errorCallback?);
    private updateFavouritesOrDefault();
    private changeFavourite(app, status, successCallback?, errorCallback?);
    readonly transaction: pip.services.Transaction;
    readonly favourites: ApplicationTile[];
    getApplications(successCallback?: (data: ApplicationTile[]) => void, errorCallback?: (error: any) => void): void;
    getApplicationById(id: string): ApplicationTile;
    updateApplication(data: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void;
    createApplication(data: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void;
    deleteApplication(data: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void;
    setFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    resetFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    toggleFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    clean(): void;
}

export class ApplicationViewModel implements IApplicationsViewModel {
    private _isPopulated;
    model: ApplicationsModel;
    constructor(iqsApplicationsData: IApplicationsDataService, iqsSettingsViewModel: ISettingsViewModel, iqsOrganization: IOrganizationService);
    state: string;
    readonly applications: ApplicationTile[];
    readonly favourites: ApplicationTile[];
    readonly favouritesOrDefault: ApplicationTile[];
    readonly categories: ApplicationCategory[];
    initApplications(successCallback?: (data: ApplicationTile[]) => void, errorCallback?: (error: any) => void): void;
    getApplicationById(id: string): ApplicationTile;
    updateApplication(app: ApplicationTile, successCallback: (data: ApplicationTile) => void, errorCallback: (error: any) => void): void;
    createApplication(app: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void;
    deleteApplication(app: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void;
    setFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    resetFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    toggleFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    clean(): void;
}

export interface IApplicationsViewModel {
    state: string;
    applications: any;
    favourites: any;
    favouritesOrDefault: any;
    categories: any;
    initApplications(successCallback?: (data: ApplicationTile[]) => void, errorCallback?: (error: any) => void): any;
    getApplicationById(id: string): ApplicationTile;
    updateApplication(organization: ApplicationTile, successCallback: (data: ApplicationTile) => void, errorCallback: (error: any) => void): void;
    createApplication(data: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void;
    deleteApplication(data: ApplicationTile, successCallback?: (data: ApplicationTile) => void, errorCallback?: (error: any) => void): void;
    setFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    resetFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    toggleFavourite(app: ApplicationTile, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    clean(): void;
}


export class AssocietedObject {
    [key: string]: string;
}
export class CreditCardsModel {
    private $log;
    private $location;
    private $timeout;
    private pipTransaction;
    private pipIdentity;
    private iqsCreditCardsData;
    private _state;
    private _filter;
    private _isSort;
    private _selectAllow;
    private expectedString;
    private creditCards;
    private creditCardsFiltered;
    private localFilters;
    private _search;
    private _selectIndex;
    private selectedItem;
    private transaction;
    private _selectedIndex;
    private _take;
    private _defaultCollection;
    private _searchedCollection;
    constructor($log: ng.ILogService, $location: ng.ILocationService, $timeout: ng.ITimeoutService, pipTransaction: pip.services.ITransactionService, pipIdentity: pip.services.IIdentityService, iqsCreditCardsData: ICreditCardsDataService);
    private updateItemInCollection(item, reReadCollection?);
    private collectionChanged();
    private setState();
    private onRead(isReload, data, callback?);
    private getFilter(filter?);
    readOptionaly(filter: any, successCallback?: (data: CreditCard[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    read(isReload?: boolean, successCallback?: (data: CreditCard[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    create(creditCard: CreditCard, successCallback?: (data: CreditCard) => void, errorCallback?: (error: any) => void): void;
    delete(id: string, customerId?: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    isSort: boolean;
    state: string;
    selectAllow: boolean;
    search: string;
    filter: any;
    private getFiltered(localFilter?);
    get(): CreditCard[];
    applyFilter(localFilter?: AssocietedObject): CreditCard[];
    readonly take: number;
    readonly selectedIndex: number;
    getSelectedItem(): CreditCard;
    getTransaction(): pip.services.Transaction;
    remove(id: string): void;
    reload(successCallback?: (data: CreditCard[]) => void, errorCallback?: (error: any) => void): void;
    selectItem(index?: number): void;
    clean(): void;
}

export {};

export interface ICreditCardsViewModel {
    state: string;
    isSort: boolean;
    selectAllow: boolean;
    filter: any;
    selectedIndex: number;
    search: string;
    read(isLoading?: boolean, successCallback?: (data: CreditCard[]) => void, errorCallback?: (error: any) => void): any;
    reload(successCallback?: (data: CreditCard[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(): CreditCard[];
    applyFilter(localFilter?: AssocietedObject): CreditCard[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): CreditCard;
    removeItem(id: string): void;
    create(creditCard: CreditCard, successCallback?: (data: CreditCard) => void, errorCallback?: (error: any) => void): void;
    deleteCreditCardById(id: string, customerId?: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    clean(): void;
}


export class DataProfilesModel {
    private $location;
    private pipTransaction;
    private iqsDataProfilesData;
    private iqsOrganization;
    state: string;
    dataProfile: DataProfile;
    private transaction;
    constructor($location: ng.ILocationService, pipTransaction: pip.services.ITransactionService, iqsDataProfilesData: IDataProfilesDataService, iqsOrganization: IOrganizationService);
    private setState();
    getDataProfiles(successCallback?: (data: DataProfile) => void, errorCallback?: (error: any) => void): void;
    private getDataProfilesCallback(data, successCallback?);
    getTransaction(): pip.services.Transaction;
    clean(): void;
}

export {};

export interface IDataProfilesViewModel {
    initDataProfiles(successCallback?: (data: DataProfile) => void, errorCallback?: (error: any) => void): any;
    clean(): void;
    getTransaction(): pip.services.Transaction;
    state: string;
    dataProfile: DataProfile;
}


export class CurrentObjectStatesModel extends ObjectStatesAbstractModel {
    constructor($location: ng.ILocationService, iqsCurrentObjectStatesData: ICurrentObjectStatesDataService, iqsDevicesViewModel: IDevicesViewModel, iqsObjectsViewModel: IObjectsViewModel, iqsMapIcon: IMapIconService, iqsObjectConfigs: IObjectConfigsService, pipMapHelperSrv: any, $rootScope: ng.IRootScopeService, iqsObjectRoutesViewModel: IObjectRoutesViewModel, iqsIncidentsViewModel: IIncidentsViewModel, iqsSmartZoom: ISmartZoomService, pipTranslate: pip.services.ITranslateService, iqsObjectFormat: IObjectFormatService, iqsOrganization: IOrganizationService);
    getObjectStates(filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void): void;
    readOne(id: string, successCallback?: (data: ObjectState) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateObjectStates(callback?: Function): void;
}

export {};

export interface ICurrentObjectStatesViewModel {
    initCurrentObjectStates(filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void): any;
    filterCurrentObjectStates(filter: string): any;
    updateCurrentObjectStates(): void;
    readOne(id: string, successCallback?: (data: ObjectState) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    highlightCurrentObjectStatesByObjectsName(filter: string): void;
    filterCurrentObjectStatesObjectsSearch(objects: SearchResult[], showUnknown?: boolean): any;
    focusByDeviceId(id: string, updateCenter?: boolean, alwaysShow?: boolean, isRetro?: boolean): void;
    selectByDeviceIds(ids: string[]): void;
    selectByObjectIds(ids: string[]): void;
    findByDevice(id: string): any;
    unfocusAll(onlyAutoFocus?: boolean): void;
    unselectAll(): void;
    selectIndex(): any;
    statusObject(object: ObjectState): string;
    getCurrentObjectStateByObjectId(id: string): ObjectState;
    getCurrentObjectStateByDeviceId(id: string): ObjectState;
    getActiveByCategory(category: any): number;
    getInactiveByCategory(category: any): number;
    isActive(state: any): boolean;
    isInCurrentRosters(state: any): boolean;
    isOnMapByDeviceId(device_id: any): boolean;
    cancelFiltered(): void;
    isFocused: string;
    isSelected: boolean;
    state: string;
    CurrentObjectStates: ObjectState[];
    allCurrentObjectStates: ObjectState[];
    selectedIndex: number;
    isSort: boolean;
    clean(): void;
}


export class DeviceParams {
    skip: number;
    total: boolean;
    size: number;
    type?: string;
}
export class DevicesModel {
    private $location;
    private pipTransaction;
    private iqsDevicesData;
    private iqsObjectsViewModel;
    private iqsOrganization;
    state: string;
    allDevices: Device[];
    devices: Device[];
    selectedIndex: number;
    private selectedItem;
    private transaction;
    constructor($location: ng.ILocationService, pipTransaction: pip.services.ITransactionService, iqsDevicesData: IDevicesDataService, iqsObjectsViewModel: IObjectsViewModel, iqsOrganization: IOrganizationService);
    private setState();
    private sortCollection(data);
    getDevices(filter: string, successCallback?: (data: Device[]) => void, errorCallback?: (error: any) => void): void;
    read(successCallback?: (data: Device[]) => void, errorCallback?: (error: any) => void): void;
    readOne(data: Device, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    pingDevice(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    selectItem(index?: number): void;
    filterDevices(filter?: string): void;
    filterWithArrayObjects(objects: SearchResult[]): void;
    getDeviceById(deviceId: string): Device;
    private getDevicesCallback(data, filter?, successCallback?);
    saveDevice(data: Device, callback?: (item: Device) => void, errorCallback?: (err: any) => void): void;
    remove(id: string): void;
    deleteDevice(id: string, callback?: () => void, errorCallback?: () => void): void;
    private onUpdateDevice(object_id, item, callback?, errorCallback?);
    updateDevice(data: Device, callback?: (item) => void, errorCallback?: (err) => void): void;
    verifyDeviceUdi(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    getTransaction(): pip.services.Transaction;
    clean(): void;
}

export {};

export interface IDevicesViewModel {
    initDevices(filter?: string, successCallback?: (data: Device[]) => void, errorCallback?: (error: any) => void): any;
    read(successCallback?: (data: Device[]) => void, errorCallback?: (error: any) => void): any;
    filterDevices(filter: string): any;
    selectItem(index?: number): any;
    getDeviceById(deviceId: string): Device;
    saveDevice(data: Device, callback: (item: Device) => void, error: (err: any) => void): any;
    updateDevice(data: Device, callback: (item: Device) => void, error: (err: any) => void): any;
    deleteDevice(id: any, callback: () => void, error: () => void): any;
    filterWithArrayObjects(objects: SearchResult[]): any;
    verifyDeviceUdi(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    clean(): void;
    getTransaction(): pip.services.Transaction;
    pingDevice(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    readOne(data: Device, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void): any;
    state: string;
    selectedIndex: number;
    devices: Device[];
    allDevices: Device[];
}


export class EmergencyPlansModel {
    private $log;
    private $location;
    private $timeout;
    private pipTransaction;
    private iqsOrganization;
    private iqsEmergencyPlansData;
    private _state;
    private _isSort;
    private _filter;
    private _mustOpened;
    private emergencyPlans;
    private emergencyPlansFiltered;
    private searchedCollection;
    private selectIndex;
    private selectedItem;
    private transaction;
    private start;
    private take;
    private localSearch;
    constructor($log: ng.ILogService, $location: ng.ILocationService, $timeout: ng.ITimeoutService, pipTransaction: pip.services.ITransactionService, iqsOrganization: IOrganizationService, iqsEmergencyPlansData: IEmergencyPlansDataService);
    private updateItemInCollection(item);
    private collectionChanged();
    private setState();
    private prepareSearchedCollection();
    private sortCollection(data);
    private onRead(data, callback?);
    private getFiltered(localSearch?);
    private getFilter();
    read(successCallback?: (data: EmergencyPlan[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    create(emergencyPlan: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void;
    delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    update(id: string, emergencyPlan: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void;
    mustOpened: EmergencyPlan;
    filter: any;
    isSort: boolean;
    state: string;
    get(localSearch?: string): EmergencyPlan[];
    getSearchedCollection(): string[];
    getSelectedIndex(): number;
    getSelectedItem(): EmergencyPlan;
    getTransaction(): pip.services.Transaction;
    remove(id: string): void;
    reload(successCallback?: (data: EmergencyPlan[]) => void, errorCallback?: (error: any) => void): void;
    selectItem(index?: number): void;
    selectItemById(id: string): void;
    clean(): void;
}

export {};

export interface IEmergencyPlansViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];
    mustOpened: EmergencyPlan;
    selectedItem: EmergencyPlan;
    read(successCallback?: (data: EmergencyPlan[]) => void, errorCallback?: (error: any) => void): any;
    reload(successCallback?: (data: EmergencyPlan[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(localSearch?: string): EmergencyPlan[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): EmergencyPlan;
    removeItem(id: string): void;
    create(gateway: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void;
    deleteEmergencyPlansById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateEmergencyPlansById(id: string, gateway: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void;
    selectItemById(id: string): void;
    clean(): void;
}


export class EventRuleCalculator {
    private getLabelEntryEventRule(rule);
    private getLabelExitEventRule(rule);
    private getLabelPressedEventRule(rule);
    private getLabelLongPressedEventRule(rule);
    private getLabelMaxSpeedLimitEventRule(rule);
    private getLabelMinSpeedLimitEventRule(rule);
    private getLabelImmobilityEventRule(rule);
    private getLabelPresenceEventRule(rule);
    private getLabelShowUpEventRule(rule);
    private getLabelDisappearEventRule(rule);
    getEventRuleConditionsLabel(rule: EventRule): string;
    getEventRuleConditionValue(rule: EventRule): any;
    setEventRuleCondition(rule: EventRule, value: any): string;
}

export class EventRulesModel {
    private $log;
    private $location;
    private $timeout;
    private pipTransaction;
    private iqsOrganization;
    private iqsEventRulesData;
    private iqsObjectsViewModel;
    private iqsObjectGroupsViewModel;
    private iqsAccountsViewModel;
    private _state;
    private _isSort;
    private _filter;
    private rules;
    private rulesFiltered;
    private searchedCollection;
    private selectIndex;
    private selectedItem;
    private transaction;
    private start;
    private take;
    private localSearch;
    private ruleCalculator;
    constructor($log: ng.ILogService, $location: ng.ILocationService, $timeout: ng.ITimeoutService, pipTransaction: pip.services.ITransactionService, iqsOrganization: IOrganizationService, iqsEventRulesData: IEventRulesDataService, iqsObjectsViewModel: IObjectsViewModel, iqsObjectGroupsViewModel: IObjectGroupsViewModel, iqsAccountsViewModel: IAccountsViewModel);
    private updateItemInCollection(item);
    private collectionChanged();
    private setState();
    private prepareSearchedCollection();
    private sortCollection(data);
    private onRead(data, callback?);
    private getFiltered(localSearch?);
    private getFilter();
    private clearBeforSave(rule);
    read(successCallback?: (data: EventRule[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    create(rule: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void;
    delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    update(id: string, rule: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void;
    filter: any;
    isSort: boolean;
    state: string;
    get(localSearch?: string): EventRule[];
    getSearchedCollection(): string[];
    getSelectedIndex(): number;
    getSelectedItem(): EventRule;
    getTransaction(): pip.services.Transaction;
    remove(id: string): void;
    reload(successCallback?: (data: EventRule[]) => void, errorCallback?: (error: any) => void): void;
    selectItem(index?: number): void;
    getEventRuleById(ruleId: string): EventRule;
    prepareCondition(rule: EventRule): void;
    getEventRulesWithDescription(): EventRule[];
    private objectsToString(groups, objects);
    private accountsToString(ids);
    setObjectsDescriptions(rule: any): void;
    getEventRulesWithIncludeZone(zoneId: string): EventRule[];
    getEventRulesWithExcludeZone(zoneId: string): EventRule[];
    clean(): void;
}



export interface IEventRulesViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];
    read(successCallback?: (data: EventRule[]) => void, errorCallback?: (error: any) => void): any;
    reload(successCallback?: (data: EventRule[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(localSearch?: string): EventRule[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): EventRule;
    removeItem(id: string): void;
    create(rule: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void;
    deleteEventRuleById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateEventRuleById(id: string, rule: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void;
    getEventRuleById(ruleId: string): EventRule;
    setObjectsDescriptions(rule: any): void;
    getEventRulesWithDescription(): EventRule[];
    getEventRulesWithIncludeZone(zoneId: string): EventRule[];
    getEventRulesWithExcludeZone(zoneId: string): EventRule[];
    clean(): void;
}



export interface IOperationalEventTemplatesViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];
    read(successCallback?: (data: EventTemplate[]) => void, errorCallback?: (error: any) => void): any;
    reload(successCallback?: (data: EventTemplate[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(localSearch?: string): EventTemplate[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): EventTemplate;
    removeItem(id: string): void;
    create(eventTemplate: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void;
    deleteEventTemplateById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateEventTemplateById(id: string, eventTemplate: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void;
    clean(): void;
}

export class OperationalEventTemplatesModel {
    private $log;
    private $location;
    private $timeout;
    private pipTransaction;
    private iqsOrganization;
    private iqsEventTemplatesData;
    private _state;
    private _isSort;
    private _filter;
    private eventTemplate;
    private eventTemplateFiltered;
    private searchedCollection;
    private selectIndex;
    private selectedItem;
    private transaction;
    private start;
    private take;
    private localSearch;
    constructor($log: ng.ILogService, $location: ng.ILocationService, $timeout: ng.ITimeoutService, pipTransaction: pip.services.ITransactionService, iqsOrganization: IOrganizationService, iqsEventTemplatesData: IEventTemplatesDataService);
    private updateItemInCollection(item);
    private collectionChanged();
    private setState();
    private prepareSearchedCollection();
    private sortCollection(data);
    private onRead(data, callback?);
    private getFiltered(localSearch?);
    private getFilter();
    read(successCallback?: (data: EventTemplate[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    create(eventTemplate: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void;
    delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    update(id: string, eventTemplate: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void;
    filter: any;
    isSort: boolean;
    state: string;
    get(localSearch?: string): EventTemplate[];
    getSearchedCollection(): string[];
    getSelectedIndex(): number;
    getSelectedItem(): EventTemplate;
    getTransaction(): pip.services.Transaction;
    remove(id: string): void;
    reload(successCallback?: (data: EventTemplate[]) => void, errorCallback?: (error: any) => void): void;
    selectItem(index?: number): void;
    clean(): void;
}

export {};

export class GuidesModel {
    private $location;
    private $timeout;
    private pipTransaction;
    private pipTranslate;
    private iqsSettingsViewModel;
    private pipGuideData;
    private pipGuidance;
    private iqsOrganization;
    private _state;
    private transaction;
    private guides;
    private APP_NAME;
    private GUIDE_INTRO_KEY;
    private GUIDE_RELEASE_KEY;
    constructor($location: ng.ILocationService, $timeout: ng.ITimeoutService, pipTransaction: pip.services.ITransactionService, pipTranslate: pip.services.ITranslateService, iqsSettingsViewModel: ISettingsViewModel, pipGuideData: pip.guidance.IGuideDataService, pipGuidance: pip.guidance.IIntroGuidanceService, iqsOrganization: IOrganizationService);
    private markView(guide, settings);
    private getLastReleaseGuide(guides);
    private getLastIntroGuide(guides);
    private getHelpGuide(guides);
    private getLastGuide(guides, settings);
    showLastGuide(showAllways?: boolean, successCallback?: () => void, errorCallback?: () => void): void;
    showGuide(guide: pip.guidance.Guide): void;
    showContentGuide(key: string, successCallback?: () => void, errorCallback?: () => void): void;
    showIntroduction(successCallback?: () => void, errorCallback?: () => void): void;
    read(successCallback?: (data: pip.guidance.Guide[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    private setState();
    get(): pip.guidance.Guide[];
    getTransaction(): pip.services.Transaction;
    reload(successCallback?: (data: pip.guidance.Guide[]) => void, errorCallback?: (error: any) => void): void;
    state: string;
    cleanUp(): void;
}

export {};

export interface IGuidesViewModel {
    showLastGuide(showAllways?: boolean, successCallback?: () => void, errorCallback?: () => void): void;
    showContentGuide(key: string, successCallback?: () => void, errorCallback?: () => void): void;
    showIntroduction(successCallback?: () => void, errorCallback?: () => void): void;
    showGuide(guide: pip.guidance.Guide): void;
    read(successCallback?: (data: pip.guidance.Guide[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    get(): pip.guidance.Guide[];
    getTransaction(): pip.services.Transaction;
    reload(successCallback?: (data: pip.guidance.Guide[]) => void, errorCallback?: (error: any) => void): void;
    clean(): void;
    state: string;
}


export interface IIncidentCurrentObjectStateViewModel {
    initCurrentObjectStates(filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void): any;
    statusObject(object: ObjectState): string;
    getCurrentObjectStateByObjectId(id: string): ObjectState;
    clean(): void;
    allCurrentObjectStates: ObjectState[];
}

export interface IIncidentsViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    selectedId: string;
    selectedItem: Incident;
    incidentsCount: number;
    mustOpened: Incident;
    hideAll: boolean;
    total: number;
    shortIncidentListCount: number;
    read(successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void): any;
    readOptionaly(filter: any, successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readIncidentsCount(successCallback?: (cnt: number) => void, errorCallback?: (error: any) => void): void;
    reload(successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(): Incident[];
    getAll(): Incident[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    removeItem(id: string): void;
    create(Incident: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void;
    deleteIncidentById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateIncidentById(id: string, Incident: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void;
    readForEvent(eventId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    selectItemById(id: string): void;
    getIncidentCount(objectId: string): number;
    getGroups(object: ControlObject): string;
    getLocationName(incident: Incident): string;
    getIncidentDetails(incident: any): string;
    clean(): void;
    reCalcElapsedDate(): void;
}


export class IncidentsModel {
    private $log;
    private $location;
    private $rootScope;
    private $timeout;
    private pipToasts;
    private pipActions;
    private pipTransaction;
    private pipTranslate;
    private iqsOrganization;
    private iqsIncidentsData;
    private pipMedia;
    private iqsObjectsViewModel;
    private iqsObjectGroupsViewModel;
    private iqsLocationsViewModel;
    private iqsTypeCollectionsService;
    private iqsEventRulesViewModel;
    private iqsZonesViewModel;
    private iqsSettingsViewModel;
    private pipDateFormat;
    private _state;
    private _isSort;
    private _filter;
    private lastIncidentTime;
    private currentTimeUpdate;
    private TAKE_INCIDENT;
    private _hideAll;
    private incident;
    private topIncident;
    private _selectIndex;
    private selectedItem;
    private transaction;
    private _selectedId;
    private defaultResolution;
    private expectedString;
    private _mustOpened;
    private incidentBaseKey;
    private incidentsEventRules;
    private totalIncident;
    private cf;
    constructor($log: ng.ILogService, $location: ng.ILocationService, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService, pipToasts: pip.controls.IToastService, pipActions: pip.nav.IActionsService, pipTransaction: pip.services.ITransactionService, pipTranslate: pip.services.ITranslateService, iqsOrganization: IOrganizationService, iqsIncidentsData: IIncidentsDataService, pipMedia: pip.layouts.IMediaService, iqsObjectsViewModel: IObjectsViewModel, iqsObjectGroupsViewModel: IObjectGroupsViewModel, iqsLocationsViewModel: ILocationsViewModel, iqsTypeCollectionsService: ITypeCollectionsService, iqsEventRulesViewModel: IEventRulesViewModel, iqsZonesViewModel: IZonesViewModel, iqsSettingsViewModel: ISettingsViewModel, pipDateFormat: pip.dates.IDateFormatService);
    $onDestroy(): void;
    private getEventRulesIds(incidentSettings);
    private updateItemInCollection(item, reReadCollection?);
    private checkLatest(item);
    private openIncident(item);
    private collectionChanged();
    private setState();
    private referenceObject(item);
    private onRead(data, callback?);
    private deleteUnExistItem(oldCollection, newCollection);
    private getFilter(filter?);
    read(successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readOptionaly(filter: any, successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readIncidentsCount(successCallback?: (cnt: number) => void, errorCallback?: (error: any) => void): void;
    readForEvent(eventId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    create(Incident: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void;
    delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    update(id: string, incident: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void;
    readonly total: number;
    hideAll: boolean;
    filter: any;
    isSort: boolean;
    state: string;
    mustOpened: Incident;
    selectedId: string;
    readonly incidentsCount: number;
    get(): Incident[];
    getAll(): Incident[];
    selectedIndex: number;
    getSelectedItem(): Incident;
    getTransaction(): pip.services.Transaction;
    remove(id: string): void;
    reload(successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void): void;
    readonly shortIncidentListCount: number;
    selectItem(index?: number): void;
    selectItemById(id: string): void;
    showToast(item: Incident): void;
    getIncidentCount(objectId: string): number;
    getGroups(object: ControlObject): string;
    getLocationName(incident: Incident): string;
    getIncidentDetails(incident: any): string;
    clean(): void;
    private filterIncidentBySettings(data);
    reCalcElapsedDate(): void;
    private calcElapsedDate(item);
}



export interface IInvitationsViewModel {
    initInvitations(filter?: string, successCallback?: (data: Invitation[]) => void, errorCallback?: (error: any) => void): any;
    filterInvitations(filter: string): any;
    selectItem(index?: number): any;
    getInvitationById(invitationId: string): Invitation;
    saveInvitation(data: Invitation, callback: (item: Invitation) => void, error: (err: any) => void): any;
    updateInvitation(data: Invitation, callback: (item: Invitation) => void, error: (err: any) => void): any;
    deleteInvitation(id: any, callback: () => void, error: (error: any) => void): any;
    filterWithArrayObjects(objects: SearchResult[]): any;
    sendNotifyMessage(data: Invitation, callback?: (item?: Invitation) => void, errorCallback?: (err: any) => void): any;
    resendInvite(data: any, callback?: (item) => void, errorCallback?: (err) => void): any;
    approveInvite(data: any, callback?: (item) => void, errorCallback?: (err) => void): any;
    denyInvite(data: any, callback?: (item) => void, errorCallback?: (err) => void): any;
    clean(): void;
    getTransaction(): pip.services.Transaction;
    state: string;
    selectedIndex: number;
    invitations: Invitation[];
    allInvitations: Invitation[];
}


export class InvitationParams {
    skip: number;
    total: boolean;
    size: number;
    action?: string;
}
export class InvitationsModel {
    private $location;
    private iqsInvitationsData;
    private pipTransaction;
    state: string;
    allInvitations: Invitation[];
    invitations: Invitation[];
    selectedIndex: number;
    private selectedItem;
    private readonly THRESHOLD;
    private transaction;
    constructor($location: ng.ILocationService, iqsInvitationsData: IInvitationsDataService, pipTransaction: pip.services.ITransactionService);
    private sortCollection(data);
    private setState();
    getInvitations(filter: string, successCallback?: (data: Invitation[]) => void, errorCallback?: (error: any) => void): void;
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    filterInvitations(filter?: string): void;
    filterWithArrayObjects(objects: SearchResult[]): void;
    getInvitationById(invitationId: string): Invitation;
    private getInvitationsCallback(data, filter?, successCallback?);
    saveInvitation(data: Invitation, callback?: (item: Invitation) => void, errorCallback?: (err: any) => void): void;
    remove(id: string): void;
    deleteInvitation(id: string, callback?: () => void, errorCallback?: (error: any) => void): void;
    resendInvite(data: any, callback?: (item) => void, errorCallback?: (err) => void): void;
    sendNotifyMessage(data: Invitation, callback?: (item?: Invitation) => void, errorCallback?: (err: any) => void): void;
    approveInvite(data: any, callback?: (item) => void, errorCallback?: (err) => void): void;
    denyInvite(data: any, callback?: (item) => void, errorCallback?: (err) => void): void;
    updateInvitation(data: Invitation, callback?: (item) => void, errorCallback?: (err) => void): void;
    clean(): void;
}

export {};

export interface ILocationsViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];
    read(successCallback?: (data: Location[]) => void, errorCallback?: (error: any) => void): any;
    reload(successCallback?: (data: Location[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(localSearch?: string): Location[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): Location;
    removeItem(id: string, successCallback: any): void;
    create(Location: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void;
    deleteLocationById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateLocationById(id: string, Location: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void;
    getLocationById(locationId: string): Location;
    clean(): void;
}


export class LocationsModel {
    private $log;
    private $location;
    private pipTransaction;
    private iqsOrganization;
    private iqsLocationsData;
    private _state;
    private _isSort;
    private _filter;
    private locations;
    private selectIndex;
    private selectedItem;
    private transaction;
    private locationsFiltered;
    private searchedCollection;
    private localSearch;
    constructor($log: ng.ILogService, $location: ng.ILocationService, pipTransaction: pip.services.ITransactionService, iqsOrganization: IOrganizationService, iqsLocationsData: ILocationsDataService);
    private updateItemInCollection(item);
    private collectionChanged();
    private setState();
    private prepareSearchedCollection();
    private sortCollection(data);
    private onRead(data, callback?);
    private getFiltered(localSearch?);
    private getFilter();
    read(successCallback?: (data: Location[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    create(location: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void;
    delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    update(id: string, location: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void;
    filter: any;
    isSort: boolean;
    state: string;
    get(localSearch?: string): Location[];
    getSearchedCollection(): string[];
    getSelectedIndex(): number;
    getSelectedItem(): Location;
    getTransaction(): pip.services.Transaction;
    remove(id: string): void;
    reload(successCallback?: (data: Location[]) => void, errorCallback?: (error: any) => void): void;
    selectItem(index?: number): void;
    getLocationById(locationId: string): Location;
    clean(): void;
}

export {};

export interface IMapViewModel {
    map: MapModel;
    initMap(successCallback?: () => void, errorCallback?: (error: any) => void): void;
    initObjects(): void;
    initStates(): void;
    highlightStatesByName(filter: string): void;
    focusByDeviceId(id: string): void;
    selectByDeviceIds(ids: string[]): void;
    selectByObjectIds(ids: string[]): void;
    unfocusAll(): void;
    unselectAll(): void;
    setCenter(center: any): void;
    setZoom(zoom: any): void;
    zoomOut(): void;
    zoomIn(): void;
    updateObjectsStates(): void;
    getCurrentObjectStateByDeviceId(id: string): ObjectState;
    objects: ControlObject[];
    states: ObjectState[];
    polygons: Zone[];
    lines: Zone[];
    circles: Zone[];
    filteredStates: ObjectState[];
    isFocused: string;
    isSelected: boolean;
    polylinesOptions: any;
    organizationCenter: any;
    getActive(type: string): number;
    getInactive(type: string): number;
    isActive(state: any): boolean;
}


export const UPDATE_MAP_MODEL_CENTER: string;
export class MapModel {
    private iqsMapConfig;
    private _configs;
    state: string;
    private cf;
    constructor(iqsMapConfig: IMapService, $rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService);
    $onDestroy(): void;
    init(successCallback?: () => void, errorCallback?: (error: any) => void): void;
    private getMapConfigs(successCallback, errorCallback);
    zoomIn(): void;
    zoomOut(): void;
    setCenter(center: any): void;
    setZoom(zoom: any): void;
    configs: MapConfigs;
    readonly organizationConfigs: MapConfigs;
    readonly organizationCenter: any;
}

export {};


export interface IObjectsViewModel {
    objects: ObjectsModel;
    initObjects(type?: string, successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void): void;
    read(successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void): any;
    getObjects(type?: string): any;
    selectItem(index?: number): any;
    getObjectById(objectId: string): ControlObject;
    getObjectByName(name: string): string;
    filterObjects(type: string): ControlObject[];
    filterObjectsArray(array: any): any;
    saveObject(data: ControlObject, callback?: (item: ControlObject) => void, errorCallback?: (err: any) => void): any;
    deleteObject(id: string, callback?: () => void, errorCallback?: () => void): any;
    updateObject(data: ControlObject, callback?: (item) => void, errorCallback?: (err) => void): any;
    getTransaction(): pip.services.Transaction;
    allObjects: ControlObject[];
    state: string;
    selectedIndex: number;
    personsCount: number;
    devicesCount: number;
    assetsCount: number;
    clean(): void;
}

export class ObjectParams {
    total: boolean;
    type?: string;
}
export class AssociatedArray {
    [key: string]: ControlObject;
}
export class ObjectsModel {
    private $location;
    private pipTransaction;
    private iqsControlObjectsData;
    protected iqsCurrentObjectStatesData: ICurrentObjectStatesDataService;
    private iqsObjectConfigs;
    state: string;
    allObjects: ControlObject[];
    objects: ControlObject[];
    selectedIndex: number;
    personsCount: number;
    devicesCount: number;
    assetsCount: number;
    private transaction;
    private readonly THRESHOLD;
    private selectedItem;
    private associatedArr;
    constructor($location: ng.ILocationService, pipTransaction: pip.services.ITransactionService, iqsControlObjectsData: IControlObjectsDataService, iqsCurrentObjectStatesData: ICurrentObjectStatesDataService, iqsObjectConfigs: IObjectConfigsService);
    private setState();
    private sortCollection(data);
    filterData(type: string): ControlObject[];
    setCountsByType(): void;
    private updateAssociationArray();
    getTransaction(): pip.services.Transaction;
    filterWithArrayObjects(objects: any): void;
    read(successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void): void;
    getObjects(type?: string, successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void): void;
    selectItem(index?: number): void;
    getAllObjects(successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void): void;
    isObjectActive(object: ControlObject, nowTime?: number): boolean;
    private getObjectsCallback();
    getObjectById(objectId: string): ControlObject;
    getObjectByName(name: string): string;
    private extendObject(object, data, callback?);
    saveObject(data: ControlObject, callback?: (item: ControlObject) => void, errorCallback?: (err: any) => void): void;
    remove(id: string): void;
    deleteObject(id: string, callback?: () => void, errorCallback?: () => void): void;
    updateObject(data: ControlObject, callback?: (item) => void, errorCallback?: (err) => void): void;
    clean(): void;
}



export interface IObjectGroupsViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    StatisticsDataCollectionItem(updateCallback?: () => void): ObjectGroup[];
    read(successCallback?: (data: ObjectGroup[]) => void, errorCallback?: (error: any) => void): any;
    reload(successCallback?: (data: ObjectGroup[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(updateCallback?: () => void): ObjectGroup[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): ObjectGroup;
    getSelectedIndex(): number;
    removeItem(id: string): void;
    filterWithObjects(data: SearchResult[]): any;
    getGroupById(groupId: string): ObjectGroup;
    create(ObjectGroup: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void;
    deleteObjectGroupById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateObjectGroupById(id: string, ObjectGroup: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void;
    clean(): void;
}

export class ObjectGroupsModel {
    private $log;
    private $location;
    private $timeout;
    private pipTransaction;
    private iqsOrganization;
    private iqsObjectGroupsData;
    private iqsObjectsViewModel;
    private _state;
    private _isSort;
    private _filter;
    private objectGroups;
    private filterGroups;
    private selectIndex;
    private selectedItem;
    private transaction;
    private start;
    private take;
    private selectedIndex;
    private updatedTimeStamp;
    private updatedInterval;
    constructor($log: ng.ILogService, $location: ng.ILocationService, $timeout: ng.ITimeoutService, pipTransaction: pip.services.ITransactionService, iqsOrganization: IOrganizationService, iqsObjectGroupsData: IObjectGroupsDataService, iqsObjectsViewModel: IObjectsViewModel);
    private updateItemInCollection(item);
    private updateAllGroup(item);
    private sortCollection(data);
    private collectionChanged();
    private setState();
    private onRead(data, callback?);
    private getFilter();
    read(successCallback?: (data: ObjectGroup[]) => void, errorCallback?: (error: any) => void, stopTransaction?: boolean): angular.IPromise<any>;
    create(ObjectGroup: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void;
    delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    update(id: string, ObjectGroup: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void;
    filter: any;
    isSort: boolean;
    state: string;
    get(updateCallback?: () => void): ObjectGroup[];
    getFilterGroups(updateCallback?: () => void): ObjectGroup[];
    getSelectedIndex(): number;
    getSelectedItem(): ObjectGroup;
    getTransaction(): pip.services.Transaction;
    remove(id: string): void;
    getGroupById(groupId: string): ObjectGroup;
    reload(successCallback?: (data: ObjectGroup[]) => void, errorCallback?: (error: any) => void): void;
    selectItem(index?: number): void;
    filterWithObjects(data: SearchResult[]): void;
    clean(): void;
}

export {};


export interface IObjectRoutesViewModel {
    updateObjectPositions(zoomLevel: string): void;
    cleanUp(): void;
    unfocus(): void;
    focus(objectId: string, currentPosition?: any, toTime?: Date, state?: any, isRetro?: boolean): void;
    updateCurrentObjectPositions(currentPostion?: any, toTime?: Date, state?: any, isRetro?: boolean): void;
    getRout(toTime: Date, fromTime: Date, objectId?: string, loadCurrent?: boolean, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    objectPositions: RoutePoints[];
    objectPoints: MapPoint[];
}

export interface IObjectsRoutesViewModel {
    updateObjectPositions(zoomLevel: string): void;
    cleanUp(): void;
    unfocus(): void;
    focus(objectId: string, position?: PositionShort, isCentered?: boolean): void;
    getRouts(toTime: Date, fromTime: Date, objectIds?: string[], successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    readObjectPositions(toTime?: Date, fromTime?: Date, objectIds?: string[], isCentered?: boolean, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    isPointsOnMap(objectId: string): boolean;
    cancelDownloading(): void;
    objectPositions: RoutePoints[];
    objectPoints: MapPoint[];
    positionsZoom: number;
    objectsHeads: any[];
    currentObjectId: string;
    state: string;
}

export class ObjectRoutesModel {
    private iqsSmartZoom;
    private iqsCurrentObjectRoutesData;
    private iqsObjectRoutesData;
    private iqsObjectsViewModel;
    private TRACE_TIME_INTERVAL;
    private PAGE_SIZE;
    progress: number;
    private _positionsZoom;
    private _zoomLevel;
    private _currentObjectId;
    private _currentPosition;
    private _currentPositionTime;
    private _toTime;
    private _currentRouteTime;
    private _currentRouteId;
    private _currentRouteStartTime;
    private _currentObjectPoints;
    private _objectPositions;
    private _routesObjectId;
    constructor(iqsSmartZoom: ISmartZoomService, iqsCurrentObjectRoutesData: ICurrentObjectRoutesDataService, iqsObjectRoutesData: IObjectRoutesDataService, iqsObjectsViewModel: IObjectsViewModel);
    private getStartTime(toTime);
    private getFromTime(toTime);
    private convertCurrentObjectPositions(route, tmpObject, index);
    private takeCurrRoute(source);
    private takeHistoryRoutes(source);
    private setLastRouteTime(route);
    private reloadRoute(toTime?);
    private insertCurrentPosition(path);
    private insertCurrentPoints(points);
    private filterPositions(positions, toTime);
    private extractObjectId(data);
    private createPositions(data, toTime);
    private filteredOldPositions(currRoute);
    private updatePositions(data, toTime);
    private getCurrentObjectRoute(toTime, fromTime, objectId, successCallback?, errorCallback?);
    private getAllObjectRoutes(toTime, fromTime, objectIds?, successCallback?, errorCallback?);
    private isCurrentTime(toTime);
    readonly objectPositions: RoutePoints[];
    readonly objectPoints: MapPoint[];
    cleanUp(): void;
    updateObjectPositions(zoomLevel: string): void;
    unfocus(): void;
    focus(objectId: string, currentPosition?: any, toTime?: Date, state?: any, isRetro?: boolean): void;
    updateCurrentObjectPositions(currentPostion?: any, toTime?: Date, state?: any, isRetro?: boolean): void;
    getRout(toTime: Date, fromTime: Date, objectId?: string, loadCurrent?: boolean, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
}

export {};

export class ObjectsRoutesModel {
    private pipRest;
    private iqsSmartZoom;
    private iqsOrganization;
    private $http;
    private $timeout;
    private $rootScope;
    private iqsMapIcon;
    private iqsObjectFormat;
    private iqsCurrentObjectRoutesData;
    private iqsObjectRoutesData;
    private iqsObjectsViewModel;
    private TRACE_TIME_INTERVAL;
    private MAX_CURRENT_ROUTE_DURATION;
    private PAGE_SIZE;
    private compressing;
    private POSITION_INRERVAL;
    private POSITION_COMPRESSION;
    progress: number;
    private _positionsZoom;
    private _zoomLevel;
    private _objectIds;
    private _currentObjectId;
    private _toTime;
    private _fromTime;
    private _currentRouteTime;
    private _currentRouteId;
    private _currentRouteStartTime;
    private _objectPoints;
    private _currentObjectPoints;
    private _objectPositions;
    private _currentObjectPositions;
    private _objectsHeads;
    _state: string;
    constructor(pipRest: pip.rest.IRestService, iqsSmartZoom: ISmartZoomService, iqsOrganization: IOrganizationService, $http: ng.IHttpService, $timeout: ng.ITimeoutService, $rootScope: ng.IRootScopeService, iqsMapIcon: IMapIconService, iqsObjectFormat: IObjectFormatService, iqsCurrentObjectRoutesData: ICurrentObjectRoutesDataService, iqsObjectRoutesData: IObjectRoutesDataService, iqsObjectsViewModel: IObjectsViewModel);
    private getStartTime(toTime, fromTime);
    private getRouteObjectIndex(route);
    private convertObjectPositions(route, index);
    private takeCurrRoutes(source);
    private takeHistoryRoutes(source);
    private filterPositions(positions, toTime, fromTime);
    private getRouteObjectId(route);
    private getLastTime(objectPositions, objectId);
    private createPositions(data, toTime);
    getAllCurrentObjectsRoutes(toTime: Date, fromTime: Date, objectIds: string[], compressing: number, successCallback?: (data?: CurrentObjectRoute[]) => void, errorCallback?: (error?: any) => void): void;
    private getAllObjectRoutes(toTime, fromTime, objectIds, compressing, successCallback?, errorCallback?);
    private isCurrentTime(toTime);
    private getDescription(object);
    private updateObjectsHead(objectsHeads, position, object);
    private setCenter(pos);
    private setHighlightsCenter(objectPoints, objectid);
    private getLastPosition(objectId);
    private getCompressing(toTime, fromTime, objectCount);
    private selectById(objectId, position?, isCentered?);
    private setAutoZoom(objectPosition);
    private centeredFirstTrace();
    readonly objectPositions: RoutePoints[];
    readonly objectPoints: MapPoint[];
    readonly positionsZoom: number;
    readonly objectsHeads: any[];
    readonly state: string;
    readonly currentObjectId: string;
    cleanUp(): void;
    cancelDownloading(): void;
    updateObjectPositions(zoomLevel: string): void;
    unfocus(): void;
    focus(objectId: string, position?: PositionShort, isCentered?: boolean): void;
    readObjectPositions(toTime?: Date, fromTime?: Date, objectIds?: string[], isCentered?: boolean, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    isPointsOnMap(objectId: string): boolean;
    getRouts(toTime: Date, fromTime: Date, objectIds?: string[], successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
}

export {};

export class RouteVisualization {
    private static strokeColor;
    private static CUTT_INTERVAL;
    private static DEFAULT_DOTTRACE_COLOR;
    private static lineOptions;
    private static highlightColor;
    private static notHighlightColor;
    private static selectedColor;
    private static normalPointScale;
    private static _pointTemplate;
    private static _pointParckingTemplate;
    private static _pointStopTemplate;
    static calcDistance(fromLat: any, fromLng: any, toLat: any, toLng: any): any;
    static getClass(word: any): "medium" | "long" | "short";
    static getAnchor(word: any): 80 | 48 | 16;
    static shortLabel(label: string): string;
    static setLabel(head: any, objectName: string, objectDescription: string, isShowLabel: boolean): void;
    static getDirection(angle: any): number;
    private static getIconTemplate(type);
    private static getColorOfPoints(index);
    private static getPosition(p, tmpObject, route, index?);
    static getRoutInfo(route: RoutePoints, pos: MapPosition): MapPoint;
    private static getNearestPoint(route, pos);
    static setColoredPath(objectPositions: RoutePoints[], color?: string): RoutePoints[];
    static getColoredPath(objectPositions: RoutePoints[]): RoutePoints[];
    private static takeLastTime(r);
    private static takeFirstTime(r);
    private static isEquivPosition(pos1, pos2);
    private static checkCuttInterval(current, next, isCompressing);
    private static updateStopStopPath(current, next);
    private static updateStopTravelPath(current, next);
    private static updateTravelStopPath(current, next);
    private static updateTravelTravelPath(current, next);
    static fixPath(positions: RoutePoints[], isCompressing: boolean): RoutePoints[];
    static mapPositions(route: CurrentObjectRoute, tmpObject: any, routeIndex: number): MapPoint[];
    static mapPath(route: CurrentObjectRoute): MapPosition[];
    static getRoutePoints(route: CurrentObjectRoute, tmpObject: any, colorIndex: number): RoutePoints;
    static addHighlights(objectsPoints: MapPoint[], objectId?: string): MapPoint[];
    static selectPath(objectPositions: RoutePoints[], objectId?: string): RoutePoints[];
    static getHighlightCenter(objectPoints: MapPoint[], objectId?: string): PositionShort;
}


export interface IObjectStatesViewModel {
    initObjectStates(to: string, filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void): any;
    filterObjectStates(filter: string): any;
    updateObjectStates(to: string): void;
    highlightObjectStatesByObjectsName(filter: string): void;
    filterObjectStatesObjectsSearch(objects: SearchResult[], showUnknown?: boolean): any;
    focusByDeviceId(id: string, updateCenter?: boolean, alwaysShow?: boolean, isRetro?: boolean): void;
    selectByDeviceIds(ids: string[]): void;
    selectByObjectIds(ids: string[]): void;
    findByDevice(id: string): any;
    unfocusAll(): void;
    unselectAll(): void;
    selectIndex(): any;
    statusObject(object: ObjectState): string;
    getObjectStateByObjectId(id: string): ObjectState;
    getObjectStateByDeviceId(id: string): ObjectState;
    getActiveByCategory(category: any): number;
    getInactiveByCategory(category: any): number;
    isActive(state: any): boolean;
    isInCurrentRosters(state: any): boolean;
    isOnMapByDeviceId(device_id: any): boolean;
    cancelFiltered(): void;
    clean(): void;
    isFocused: string;
    isSelected: boolean;
    state: string;
    ObjectStates: ObjectState[];
    allObjectStates: ObjectState[];
    selectedIndex: number;
    isSort: boolean;
}

export class ObjectStatesModel extends ObjectStatesAbstractModel {
    constructor($location: ng.ILocationService, iqsObjectStatesData: IObjectStatesDataService, iqsDevicesViewModel: IDevicesViewModel, iqsObjectsViewModel: IObjectsViewModel, iqsMapIcon: IMapIconService, iqsObjectConfigs: IObjectConfigsService, pipMapHelperSrv: any, $rootScope: ng.IRootScopeService, iqsObjectRoutesViewModel: IObjectRoutesViewModel, iqsIncidentsViewModel: IIncidentsViewModel, iqsSmartZoom: ISmartZoomService, pipTranslate: pip.services.ITranslateService, iqsObjectFormat: IObjectFormatService, iqsOrganization: IOrganizationService);
    getObjectStates(to: string, filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void): void;
    updateObjectStates(to: string, callback?: Function): void;
    isActive(state: any): any;
    protected setStatus(state: ObjectState): void;
}

export {};


export interface IResolutionsViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];
    read(successCallback?: (data: Resolution[]) => void, errorCallback?: (error: any) => void): any;
    reload(successCallback?: (data: Resolution[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(localSearch?: string): Resolution[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): Resolution;
    removeItem(id: string): void;
    create(eventTemplate: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void;
    deleteResolutionById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateResolutionById(id: string, eventTemplate: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void;
    getResolutionsByEventRuleId(ruleId: string): Resolution[];
    getResolutionsByName(resolution: string): Resolution;
    clean(): void;
}

export let UpdateResolutionEvent: string;
export class ResolutionsModel {
    private $log;
    private $location;
    private $timeout;
    private pipTransaction;
    private iqsOrganization;
    private iqsResolutionData;
    private _state;
    private _isSort;
    private _filter;
    private resolutions;
    private resolutionsFiltered;
    private searchedCollection;
    private selectIndex;
    private selectedItem;
    private transaction;
    private localSearch;
    constructor($log: ng.ILogService, $location: ng.ILocationService, $timeout: ng.ITimeoutService, pipTransaction: pip.services.ITransactionService, iqsOrganization: IOrganizationService, iqsResolutionData: IResolutionsDataService);
    private updateItemInCollection(item);
    private collectionChanged();
    private setState();
    private prepareSearchedCollection();
    private sortCollection(data);
    private onRead(data, callback?);
    private getFiltered(localSearch?);
    private getFilter();
    read(successCallback?: (data: Resolution[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    create(resolutions: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void;
    delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    update(id: string, resolutions: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void;
    filter: any;
    isSort: boolean;
    state: string;
    get(localSearch?: string): Resolution[];
    getSearchedCollection(): string[];
    getSelectedIndex(): number;
    getSelectedItem(): Resolution;
    getTransaction(): pip.services.Transaction;
    remove(id: string): void;
    reload(successCallback?: (data: Resolution[]) => void, errorCallback?: (error: any) => void): void;
    selectItem(index?: number): void;
    getResolutionsByEventRuleId(ruleId: string): Resolution[];
    getResolutionsByName(resolution: string): Resolution;
    clean(): void;
}

export {};


export interface IOperationalEventsViewModel {
    state: string;
    isSort: boolean;
    selectAllow: boolean;
    filter: any;
    selectedIndex: number;
    search: string;
    readOptionaly(filter: any, successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void): any;
    read(isLoading?: boolean, successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void): any;
    reload(successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(): OperationalEvent[];
    applyFilter(localFilter?: AssocietedObject): OperationalEvent[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): OperationalEvent;
    removeItem(id: string): void;
    create(operationalEvent: OperationalEvent, successCallback?: (data: OperationalEvent) => void, errorCallback?: (error: any) => void): void;
    deleteOperationalEventById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    clean(): void;
    reCalcElapsedDate(): void;
    addReferences(collection: OperationalEvent[]): OperationalEvent[];
    readRefEvent(eventId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    getDefaultCollection(): string[];
    getSearchedCollection(): string[];
    referenceDetails(item: OperationalEvent): void;
}

export class OperationalEventFilter {
    to_time?: string;
    from_time?: string;
    take?: number;
}

export class OperationalEventsModel {
    private $log;
    private $location;
    private $timeout;
    private pipToasts;
    private pipTransaction;
    private pipTranslate;
    private iqsOrganization;
    private iqsOperationalEventsData;
    private iqsObjectsViewModel;
    private iqsZonesViewModel;
    private iqsLocationsViewModel;
    private iqsIncidentsViewModel;
    private iqsObjectGroupsViewModel;
    private pipDateFormat;
    private iqsAccountsViewModel;
    private iqsEventRulesViewModel;
    private _state;
    private _filter;
    private _isSort;
    private _selectAllow;
    private expectedString;
    private operationalEvents;
    private operationalEventsFiltered;
    private localFilters;
    private _search;
    private _selectIndex;
    private selectedItem;
    private transaction;
    private _selectedIndex;
    private _timeInterval;
    private _take;
    private _defaultCollection;
    private _searchedCollection;
    constructor($log: ng.ILogService, $location: ng.ILocationService, $timeout: ng.ITimeoutService, pipToasts: pip.controls.IToastService, pipTransaction: pip.services.ITransactionService, pipTranslate: pip.services.ITranslateService, iqsOrganization: IOrganizationService, iqsOperationalEventsData: IOperationalEventsDataService, iqsObjectsViewModel: IObjectsViewModel, iqsZonesViewModel: IZonesViewModel, iqsLocationsViewModel: ILocationsViewModel, iqsIncidentsViewModel: IIncidentsViewModel, iqsObjectGroupsViewModel: IObjectGroupsViewModel, pipDateFormat: pip.dates.IDateFormatService, iqsAccountsViewModel: IAccountsViewModel, iqsEventRulesViewModel: IEventRulesViewModel);
    private isEqual(oldObj, newObj);
    private updateItemInCollection(item, reReadCollection?);
    private collectionChanged();
    private setState();
    private onRead(isReload, data, callback?);
    private getFilter(filter?);
    readOptionaly(filter: any, successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    read(isReload?: boolean, successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    create(operationalEvent: OperationalEvent, successCallback?: (data: OperationalEvent) => void, errorCallback?: (error: any) => void): void;
    delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    isSort: boolean;
    state: string;
    selectAllow: boolean;
    search: string;
    filter: any;
    private getOperationalEventDetails(item);
    private getAccountName(accountId);
    referenceDetails(item: OperationalEvent): void;
    private referenceObject(item);
    private getFiltered(localFilter?);
    get(): OperationalEvent[];
    applyFilter(localFilter?: AssocietedObject): OperationalEvent[];
    readonly timeInterval: number;
    readonly take: number;
    readonly defaultCollection: string[];
    readonly searchedCollection: string[];
    readonly selectedIndex: number;
    getSelectedItem(): OperationalEvent;
    getTransaction(): pip.services.Transaction;
    remove(id: string): void;
    reload(successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void): void;
    selectItem(index?: number): void;
    clean(): void;
    reCalcElapsedDate(collection?: OperationalEvent[]): void;
    private calcElapsedDate(item);
    addReferences(collection: OperationalEvent[]): OperationalEvent[];
    readRefEvent(eventId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    private getSearchedCollection();
    private getDefaultCollection();
}

export {};

export {};


export interface ISettingsViewModel {
    isPopulated: boolean;
    settings: any;
    read(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    reload(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    create(settings: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void;
    update(settings: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void;
    getTransaction(): pip.services.Transaction;
    saveKey(key: string, value: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    getSettingsBy(prefix: string): SettingsUncover[];
    deleteSettingsBy(settings: any, prefix: string): any;
    clean(): void;
}

export class SettingsModel {
    private $log;
    private $rootScope;
    private pipTransaction;
    private pipSettingsData;
    private pipIdentity;
    private _settings;
    private _isPopulated;
    private transaction;
    constructor($log: ng.ILogService, $rootScope: ng.IRootScopeService, pipTransaction: pip.services.ITransactionService, pipSettingsData: pip.system.ISettingsDataService, pipIdentity: pip.services.IIdentityService);
    private settingsChanged();
    private onRead(data, callback?);
    update(settings: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void;
    create(settings: any, successCallback?: (settings: any) => void, errorCallback?: (error: any) => void): void;
    read(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    saveKey(key: string, value: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    readonly settings: any;
    getTransaction(): pip.services.Transaction;
    reload(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    getSettingsBy(prefix: string): SettingsUncover[];
    deleteSettingsBy(settings: any, prefix: string): any;
    readonly isPopulated: boolean;
    clean(): void;
}

export class SettingsUncover {
    key: string;
    value: string;
}

export {};


export interface IShiftsViewModel {
    initShifts(filter?: string, successCallback?: (data: Shift[]) => void, errorCallback?: (error: any) => void): any;
    filterShifts(filter: string): any;
    selectItem(index?: number): any;
    getShiftById(shiftId: string): Shift;
    saveShift(data: Shift, callback: (item: Shift) => void, error: (err: any) => void): any;
    updateShift(data: Shift, callback: (item: Shift) => void, error: (err: any) => void): any;
    deleteShift(id: any, callback: () => void, error: () => void): any;
    clean(): void;
    getTransaction(): pip.services.Transaction;
    state: string;
    selectedIndex: number;
    shifts: Shift[];
    allShifts: Shift[];
    isSort: boolean;
}

export class ShiftParams {
    skip: number;
    total: boolean;
    size: number;
    type?: string;
}
export class ShiftsModel {
    private $location;
    private iqsShiftsData;
    private pipTransaction;
    state: string;
    allShifts: Shift[];
    shifts: Shift[];
    selectedIndex: number;
    private _isSort;
    private selectedItem;
    private readonly THRESHOLD;
    private transaction;
    constructor($location: ng.ILocationService, iqsShiftsData: IShiftsDataService, pipTransaction: pip.services.ITransactionService);
    private sortCollection(data);
    getTransaction(): pip.services.Transaction;
    isSort: boolean;
    getShifts(filter: string, successCallback?: (data: Shift[]) => void, errorCallback?: (error: any) => void): void;
    filterShifts(filter?: string): void;
    getShiftById(shiftId: string): Shift;
    private getShiftsCallback(data, filter?, successCallback?);
    saveShift(data: Shift, callback?: (item: Shift) => void, errorCallback?: (err: any) => void): void;
    private setState();
    remove(id: string): void;
    deleteShift(id: string, callback?: () => void, errorCallback?: () => void): void;
    updateShift(data: Shift, callback?: (item) => void, errorCallback?: (err) => void): void;
    selectItem(index?: number): void;
    clean(): void;
}

export {};


export interface ISignalsViewModel {
    read(successCallback?: (data: Signal[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    get(): Signal[];
    getTransaction(): pip.services.Transaction;
    reload(successCallback?: (data: Signal[]) => void, errorCallback?: (error: any) => void): void;
    createSignal(data: Signal, successCallback?: (data: Signal) => void, errorCallback?: (error: any) => void): void;
    deleteSignal(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    lockSignal(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    closeSignal(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    clean(): void;
    state: string;
}

export class SignalsModel {
    private $timeout;
    private iqsSignalsData;
    private _state;
    private transaction;
    private signals;
    constructor(pipTransaction: pip.services.ITransactionService, $timeout: ng.ITimeoutService, iqsSignalsData: ISignalsDataService);
    private collectionChanged();
    private setState();
    read(successCallback?: (data: Signal[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    get(): Signal[];
    getTransaction(): pip.services.Transaction;
    reload(successCallback?: (data: Signal[]) => void, errorCallback?: (error: any) => void): void;
    state: string;
    cleanUp(): void;
    createSignal(data: Signal, successCallback?: (data: Signal) => void, errorCallback?: (error: any) => void): void;
    deleteSignal(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    lockSignal(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    closeSignal(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
}

export {};


export interface IOrganizationsViewModel {
    initOrganizations(successCallback?: (data: any[]) => void, errorCallback?: (error: any) => void): any;
    organizations: Organization[];
    state: string;
    getOrganizationById(id: string): any;
    updateOrganization(organization: Organization, successCallback: (Organization) => void, errorCallback: (error: any) => void): void;
    generateCode(id: string, successCallback?: (data) => void, errorCallback?: (error: any) => void): any;
    deleteOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void): any;
    createOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void): any;
    clean(): void;
    demoConnect(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
    removeOrganization(id: string, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void): any;
    getUserOrganizations(): Organization[];
    getTransaction(): pip.services.Transaction;
}

export class OrganizationsModel {
    private $location;
    private iqsOrganizationsData;
    private pipRest;
    private pipIdentity;
    state: string;
    private _transaction;
    allOrganizations: Organization[];
    constructor(pipTransaction: pip.services.ITransactionService, $location: ng.ILocationService, iqsOrganizationsData: IOrganizationsDataService, pipRest: pip.rest.IRestService, pipIdentity: pip.services.IIdentityService);
    private updateIdentity(successCallback?, errorCallback?);
    private setState();
    getOrganizations(successCallback?: (data: Organization[]) => void, errorCallback?: (error: any) => void): void;
    getOrganizationById(id: string): Organization;
    private getOrganizationCallback(data, successCallback?);
    updateOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void): void;
    createOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void): void;
    deleteOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void): void;
    demoConnect(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    removeOrganization(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    readonly transaction: pip.services.Transaction;
    clean(): void;
    getUserOrganizations(): Organization[];
}

export {};


export interface IStatesViewModel {
    initStates(to: string, filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void): any;
    filterStates(filter: string): any;
    updateStates(to?: string, callback?: Function): void;
    highlightStatesByObjectsName(filter: string): void;
    filterStatesObjectsSearch(objects: SearchResult[], showUnknown?: boolean): any;
    focusByDeviceId(id: string, updateCenter?: boolean, alwaysShow?: boolean, autoFocus?: boolean, isRetro?: boolean): void;
    focusByObjectId(id: string, updateCenter?: boolean, alwaysShow?: boolean, autoFocus?: boolean, isRetro?: boolean): void;
    selectByDeviceIds(ids: string[]): void;
    selectByObjectIds(ids: string[]): void;
    findByDevice(id: string): any;
    unfocusAll(onlyAutoFocus?: boolean): void;
    unselectAll(): void;
    selectIndex(): any;
    statusObject(object: ObjectState): string;
    getStateByObjectId(id: string): ObjectState;
    getStateByDeviceId(id: string): ObjectState;
    getActiveByCategory(category: any): number;
    getInactiveByCategory(category: any): number;
    isActive(state: any): boolean;
    isInCurrentRosters(state: any): boolean;
    isOnMapByDeviceId(device_id: any): boolean;
    isOnMapByObjectId(object_id: string): boolean;
    getToTime(): Date;
    panToObjectByDeviceId(id: string): void;
    cleanUpAllStates(): void;
    cancelFiltered(): void;
    isFocused: string;
    isSelected: boolean;
    state: string;
    states: ObjectState[];
    allStates: ObjectState[];
    selectedIndex: number;
    type: string;
    isSort: boolean;
    clean(): void;
}

export class objectStateParams {
    skip: number;
    total: boolean;
    size: number;
    type?: string;
}
export class ObjectStatuses {
    static freezed: string;
    static lost: string;
    static unknown: string;
    static active: string;
    static incidents: string;
    static danger: string;
    static unexpected: string;
    static offline: string;
}
export class DirectionScope {
    static NorthEast: number;
    static North: number;
    static NorthWest: number;
    static West: number;
    static SouthWest: number;
    static South: number;
    static SouthEast: number;
    static East: number;
}
export class ObjectStatesAbstractModel {
    protected $location: ng.ILocationService;
    protected iqsCurrentObjectStatesData: ICurrentObjectStatesDataService;
    protected iqsObjectStatesData: IObjectStatesDataService;
    protected iqsDevicesViewModel: IDevicesViewModel;
    protected iqsObjectsViewModel: IObjectsViewModel;
    protected iqsMapIcon: IMapIconService;
    protected iqsObjectConfigs: IObjectConfigsService;
    protected pipMapHelperSrv: any;
    protected $rootScope: ng.IRootScopeService;
    protected iqsObjectRoutesViewModel: IObjectRoutesViewModel;
    protected iqsIncidentsViewModel: IIncidentsViewModel;
    protected iqsSmartZoom: ISmartZoomService;
    protected pipTranslate: pip.services.ITranslateService;
    protected iqsObjectFormat: IObjectFormatService;
    protected iqsOrganization: IOrganizationService;
    state: string;
    allObjectStates: ObjectState[];
    private _allObjectStates;
    objectStates: ObjectState[];
    selectedIndex: number;
    focused: string;
    selectedElements: boolean;
    protected updateCenter: boolean;
    date: Date;
    personsActiveCount: number;
    devicesActiveCount: number;
    assetsActiveCount: number;
    personsInactiveCount: number;
    devicesInactiveCount: number;
    assetsInactiveCount: number;
    protected showUnknown: boolean;
    protected readonly THRESHOLD: number;
    protected organizationTimezone: string;
    protected organizationOffset: any;
    protected localOffset: any;
    protected filter: string;
    protected filterFunction: Function;
    filterObjects: any;
    protected _isSort: boolean;
    protected dataServiceName: string;
    protected readFunctionName: string;
    protected lastObjectUpdate: number;
    protected lactDeviceUpdate: number;
    protected DEVICE_UPDATE_FREQUENCY: number;
    protected OBJECT_UPDATE_FREQUENCY: number;
    constructor($location: ng.ILocationService, iqsCurrentObjectStatesData: ICurrentObjectStatesDataService, iqsObjectStatesData: IObjectStatesDataService, iqsDevicesViewModel: IDevicesViewModel, iqsObjectsViewModel: IObjectsViewModel, iqsMapIcon: IMapIconService, iqsObjectConfigs: IObjectConfigsService, pipMapHelperSrv: any, $rootScope: ng.IRootScopeService, iqsObjectRoutesViewModel: IObjectRoutesViewModel, iqsIncidentsViewModel: IIncidentsViewModel, iqsSmartZoom: ISmartZoomService, pipTranslate: pip.services.ITranslateService, iqsObjectFormat: IObjectFormatService, iqsOrganization: IOrganizationService);
    cleanUp(): void;
    filterWithArrayObjects(objects: SearchResult[], showUnknown?: boolean): void;
    selectIndex(): void;
    filterObjectStates(filter?: string): void;
    protected filterObjectStatesByObjectsName(filter: string): void;
    highlightObjectStatesByObjectsName(filter: string): void;
    focusByDeviceId(id: string, updateCenter?: boolean, alwaysShow?: boolean, autoFocus?: boolean, isRetro?: boolean): void;
    focusByObjectId(id: string, updateCenter?: boolean, alwaysShow?: boolean, autoFocus?: boolean, isRetro?: boolean): void;
    panToObjectByDeviceId(id: string): void;
    findByDevice(id: string): ObjectState;
    unfocusAll(onlyAutoFocus?: boolean): void;
    unselectAll(): void;
    protected filterByDeviceIds(ids: string[]): void;
    selectByDeviceIds(ids: string[]): void;
    protected filterByObjectIds(ids: string[]): void;
    selectByObjectIds(ids: string[]): void;
    protected decreaseByDeviceIds(newData: ObjectState[]): void;
    protected bindToObjectsAndDevices(): void;
    protected removeInactive(): void;
    protected removeWithoutDevice(): void;
    protected bindToObjectAndDevice(state: ObjectState): void;
    protected updateObjectByObjectId(state: ObjectState, newObjectId: string): void;
    protected convertPositions(state: ObjectState): void;
    protected isSamePosition(pos1: any, pos2: any): boolean;
    protected getDirection(state: ObjectState, oldPosition: any): number;
    protected setIcon(state: ObjectState, oldPosition?: any, alwaysShow?: boolean): void;
    protected getKoefs(word: string): number;
    protected getClass(word: string): string;
    protected getAnchor(word: string): number;
    protected setLabel(state: ObjectState): void;
    protected getDescription(state: ObjectState): string;
    protected getLabel(state: ObjectState): string;
    protected shortLabel(label: string): string;
    protected updateIcons(): void;
    protected setStatus(state: ObjectState): void;
    isSort: boolean;
    isActive(state: any): boolean;
    protected getOfflineTimeout(): number;
    protected isOffline(state: ObjectState): boolean;
    isInCurrentRosters(state: ObjectState): boolean;
    isOnMapByDeviceId(device_id: string): boolean;
    isOnMapByObjectId(object_id: string): boolean;
    protected sortObjectSates(): void;
    cancelFiltered(): void;
    protected getObjectStatesCallback(data: DataPage<ObjectState>, filter?: string, successCallback?: (data: ObjectState[]) => void): void;
    getObjectStateByObjectId(id: string): ObjectState;
    getObjectStateByDeviceId(id: string): ObjectState;
    setObjectsCounts(): void;
    getActiveByCategory(category: string): number;
    getInactiveByCategory(category: string): number;
}



export interface IStatisticsViewModel {
    state: string;
    selectedIndex: number;
    statistics: Statistics | Statistics[];
    lastRequestDate: Date;
    lastRequestType: string;
    formatDisplayData(value: any, name: any): any;
    getStatistics(firstArg: string, secondArg: string, thirdArg: string, forthArg: string, from_time: Date | string, to_time: Date | string, type: string, each?: boolean, successCallback?: any): void;
}

export class StatisticsModel {
    private $log;
    private $location;
    private $timeout;
    private pipTransaction;
    private pipTranslate;
    private iqsOrganization;
    private iqsObjectGroupsViewModel;
    private iqsObjectsViewModel;
    private iqsEventRulesViewModel;
    private iqsZonesViewModel;
    private iqsStatisticsData;
    private _state;
    private selectIndex;
    private transaction;
    private groupIds;
    private groups;
    private prevRequest;
    lastRequestDate: Date;
    lastRequestType: string;
    private allStatistics;
    private DateTypes;
    private minuteNumber;
    private _statistics;
    constructor($log: ng.ILogService, $location: ng.ILocationService, $timeout: ng.ITimeoutService, pipTransaction: pip.services.ITransactionService, pipTranslate: pip.services.ITranslateService, iqsOrganization: IOrganizationService, iqsObjectGroupsViewModel: IObjectGroupsViewModel, iqsObjectsViewModel: IObjectsViewModel, iqsEventRulesViewModel: IEventRulesViewModel, iqsZonesViewModel: IZonesViewModel, iqsStatisticsData: IStatisticsDataService);
    readonly state: string;
    selectedIndex: any;
    getStatistics(firstArg: string, secondArg: string, thirdArg: string, forthArg: string, from_time: Date | string, to_time: Date | string, type: string, each?: boolean, successCallback?: any): void;
    private isActualRequest(firstArg, secondArg, thirdArg, forthArg, from_time, to_time, type, each?);
    private isSameRequest(firstArg, secondArg, thirdArg, forthArg, from_time, to_time, type, each?);
    prepareParamsStatisticsData(data: any, secondArg: any, thirdArg: any, forthArg: any, from_time: any, to_time: any, type: any, dateType: any, callback: any): void;
    specificForAll(from_time: Date | string, to_time: Date | string, type: string, secondArg: any, thirdArg: any, forthArg: string, firstArg: string, successCallback: any): void;
    private statesForSpecificDevice(from_time, to_time, type, secondArg, successCallback);
    private specificDataCallback(firstArg, forthArg, type, from_time, to_time);
    private getSeriaName(name, type);
    specificForSpecificObjectOrGroup(from_time: Date | string, to_time: Date | string, type: string, id: string, thirdArg: string, forthArg: string, firstArg: string, successCallback: any): void;
    specificForSpecificZone(from_time: Date | string, to_time: Date | string, type: string, secondArg: string, id: string, forthArg: string, firstArg: string, successCallback: any): void;
    specificParamForAllObjectsOfGroup(from_time: Date | string, to_time: Date | string, type: string, id: string, thirdArg: string, forthArg: string, firstArg: string, successCallback: any): void;
    specificEventForAllObjectsOfGroup(from_time: Date | string, to_time: Date | string, type: string, id: string, thirdArg: string, forthArg: string, firstArg: string, successCallback: any): void;
    specificZoneForAllObjectsOfGroup(from_time: Date | string, to_time: Date | string, type: string, id: string, thirdArg: string, forthArg: string, firstArg: string, successCallback: any): void;
    private prepareSeries(data, type, from_time, to_time);
    private prepareValue(value, type);
    allParams(from_time: Date | string, to_time: Date | string, type: string, id: string, thirdArg: string, firstArg: string, successCallback: any): void;
    allEvents(from_time: Date | string, to_time: Date | string, type: string, firstArg: string, id: string, thirdArg: string, isIncidents: boolean, each: boolean, successCallback: any): void;
    allZones(from_time: Date | string, to_time: Date | string, type: string, firstArg: string, id: string, thirdArg: string, each: boolean, successCallback: any): void;
    allObjects(from_time: Date | string, to_time: Date | string, type: string, firstArg: string, secondArg: string, id: string, successCallback: any): void;
    private prepareRequest(firstArg, secondArg, thirdArg, forthArg, from_time, to_time, type);
    private getSameDateValue(value, values);
    private getSum(values, average, dividerValues);
    readonly statistics: any;
    private prepareDisplayValue(data, name);
    formatDisplayData(value: any, name: any): string;
    private changeDateTypeForAllParamsRequest(type);
}

export {};


export interface IZonesViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];
    zones: Zone[];
    polygons: Zone[];
    lines: Zone[];
    circles: Zone[];
    objects: Zone[];
    notObjects: Zone[];
    zonesCategory: string;
    mapZones: Zone[];
    mapLines: Zone[];
    mapCircles: Zone[];
    mapPolygons: Zone[];
    mapObjects: Zone[];
    read(successCallback?: (data: Zone[]) => void, errorCallback?: (error: any) => void): any;
    reload(successCallback?: (data: Zone[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(localSearch?: string): Zone[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): Zone;
    removeItem(id: string): void;
    saveZone(Zone: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): void;
    deleteZone(cause: string | Zone, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateZone(id: string, Zone: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): void;
    getZoneById(zoneId: string): Zone;
    clean(): void;
}

export const enum ZoneCategory {
    All = "all",
    Zone = "zone",
    Object = "object",
}
export class ZonesModel {
    private $log;
    private $location;
    private pipTransaction;
    private iqsOrganization;
    private iqsObjectGroupsViewModel;
    private iqsObjectsViewModel;
    private iqsSmartZoom;
    private iqsZonesData;
    private _state;
    private _isSort;
    private _filter;
    private _zonesCategory;
    private currentCategory;
    private _zones;
    private _polygons;
    private _lines;
    private _circles;
    private _objects;
    private _notObjects;
    mapZones: Zone[];
    mapLines: Zone[];
    mapCircles: Zone[];
    mapPolygons: Zone[];
    mapObjects: Zone[];
    private polygonStroke;
    private polygonFill;
    private lineStroke;
    private _zonesFiltered;
    private searchedCollection;
    private selectIndex;
    private selectedItem;
    private transaction;
    private localSearch;
    constructor($log: ng.ILogService, $location: ng.ILocationService, pipTransaction: pip.services.ITransactionService, iqsOrganization: IOrganizationService, iqsObjectGroupsViewModel: IObjectGroupsViewModel, iqsObjectsViewModel: IObjectsViewModel, iqsSmartZoom: ISmartZoomService, iqsZonesData: IZonesDataService);
    private distributeByTypes();
    private convertPolygon(zone);
    private convertLine(zone);
    private convertCircle(zone);
    private convertCenter(zone);
    private convertZonePositions(zone);
    private updateMapZones(zoomLevel);
    private prepare();
    private prepareZone(zone);
    private updateItemInCollection(item);
    private collectionChanged();
    private setState();
    private prepareSearchedCollection();
    private sortZones(data);
    private onRead(data, callback?);
    private getFiltered(localSearch?);
    private getFilter();
    read(successCallback?: (data: Zone[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    create(zone: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): void;
    delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    update(id: string, zone: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): void;
    filter: any;
    isSort: boolean;
    zonesCategory: string;
    state: string;
    get(localSearch?: string): Zone[];
    getSearchedCollection(): string[];
    getSelectedIndex(): number;
    getSelectedItem(): Zone;
    getTransaction(): pip.services.Transaction;
    remove(id: string): void;
    reload(successCallback?: (data: Zone[]) => void, errorCallback?: (error: any) => void): void;
    selectItem(index?: number): void;
    getZoneById(zoneId: string): Zone;
    private getObjectsAndGroups(zone);
    readonly zones: Zone[];
    readonly polygons: Zone[];
    readonly lines: Zone[];
    readonly circles: Zone[];
    readonly objects: Zone[];
    readonly notObjects: Zone[];
    clean(): void;
}



export class StateAccessAllow {
    [key: string]: number;
}
export class AccessConfigure {
    config: any;
    access: any;
}
export class StateAccessConfigure {
    [key: string]: AccessConfigure;
}
export interface IAccessConfigService {
    statesAccess: StateAccessAllow;
    statesConfigure: StateAccessConfigure;
    noAccessState: string;
    role: string;
    roleLevel: number;
    setRole(): void;
    getStateAccess(stateName: string): number;
    getStateAccessAllow(stateName: string): boolean;
    getStateConfigureParamAccess(stateName: string, paramName: any): AccessConfigure;
    getStateConfigure(stateName?: string): AccessConfigure;
}
export interface IAccessConfigProvider {
    noAccessState: string;
    registerStateAccess(stateName: string, accessLevel: number): void;
    registerStateConfigure(stateName: string, config: any): void;
}


export class ActionPageParams {
    title: string;
    state: string;
    id: string;
}

export class EmergencyPlanActionPageManager implements IEmergencyPlanActionPageManager {
    private $state;
    private $location;
    private pipTranslate;
    private iqsObjectConfigs;
    private iqsSendSignalDialog;
    private iqsSendSignals;
    constructor($state: ng.ui.IStateService, $location: ng.ILocationService, pipTranslate: pip.services.ITranslateService, iqsObjectConfigs: IObjectConfigsService, iqsSendSignalDialog: ISendSignalDialogService, iqsSendSignals: ISendSignals);
    private _actionPagesCollection;
    readonly actionPagesCollection: ActionPageParams[];
    getPageTitle(action: EmergencyAction): string;
    onPageClick(page: string): void;
}

export const EmargencyPlanStateName: string;


export interface IEmergencyPlanActionPageManager {
    actionPagesCollection: ActionPageParams[];
    getPageTitle(action: EmergencyAction): string;
    onPageClick(page: string): void;
}


export class GlobalHelpConfigSection {
    title: string;
    src: any;
    text: string;
    state?: string;
    url?: string;
    stateParams?: any;
    stateName?: string;
}
export class GlobalHelpConfig {
    sections: GlobalHelpConfigSection[];
}
export const GLOBAL_HELP: GlobalHelpConfig;






export {};

export interface IGlobalSearchService {
    isInit: boolean;
    getSpecialSearchCollection(objectType: string, updateCallback?: () => void): string[];
    getDefaultCollection(objectType: string): string[];
    init(): string[];
    initAutocompleteParallel(successCallback?: (data: string[]) => void): angular.IPromise<any>;
    searchObjectsParallel(search: string, objectType: string, successCallback?: (data: SearchResult[]) => void): angular.IPromise<any>;
    clean(): void;
}


export class SearchObjectTypes {
    static readonly ControlObject: string;
    static readonly ObjectGroup: string;
    static readonly Device: string;
    static readonly Location: string;
    static readonly ObjectCategory: string;
    static readonly DeviceType: string;
    static readonly ZoneType: string;
    static readonly Zone: string;
    static readonly ZoneGeometry: string;
    static readonly ZoneObject: string;
    static readonly ObjectType: string;
    static readonly ObjectsAndGroups: string;
    static readonly EventRule: string;
}

export class SearchResult {
    id?: string;
    object_type: string;
    item?: any;
    type?: string;
}

export enum IncidentsUpdateType {
    Counter = "counter",
    Full = "full",
}
export interface IIncidentsConfigService {
    updateType: IncidentsUpdateType;
}

export const IncidentsStateName = "incidents";

export {};

export {};

export {};

export {};


export class IncidentsPanelState {
    static List: string;
    static Details: string;
}


export interface ILoadingService {
    isLoading: boolean;
    isDone: boolean;
    completed: number;
    total: number;
    progress: number;
    status: LoadingStatus;
    start(callback?: Function): void;
    restart(callback?: Function): void;
    reset(): void;
    clean(): void;
    push(name: string, cleanFn: Function[], asyncFn: Function, asyncQueue: Function[], asyncAlways?: (cb: any, error?: any, results?: any) => void): void;
}
export interface ILoadingProvider {
}

export const LoadingCompleteEvent = "iqsLoadingComplete";



export enum LoadingStatus {
    Empty = "empty",
    Progress = "progress",
    Breaked = "breaked",
    Completed = "completed",
    Error = "error",
}


export class MapConfigs {
    map?: any;
    zoom: number;
    center: any;
    events: any;
    draggable?: boolean;
    control?: any;
    embededMap?: EmbededMap;
    mapId?: string;
}
export class EmbededMap {
    embededData?: any;
    embededSrc?: any;
    map_north?: number;
    map_south?: number;
    map_west?: number;
    map_east?: number;
}
export interface IMapService {
    zoom: number;
    center: any;
    polylineOptions: any;
    organizationConfigs: MapConfigs;
    organizationCenter: any;
    orgId: string;
    get(callback?: (configs?: MapConfigs) => void): any;
    getConfigsFromOrganization(callback?: (configs?: MapConfigs) => void, zoom?: number): void;
    addEvent(eventName: string, eventCallback: any): void;
    removeEvent(eventName: string): void;
    watchDragAndZoom(): void;
    unwatchDragAndZoom(): void;
    addCenterChangeCallback(callback: Function): void;
    addZoomChangeCallback(callback: Function): void;
    radiusToZoom(radius: number): number;
    clean(): any;
}


export let GET_SITE_MAP_CONFIGS: string;

export class formattedMapIcon {
    url: string;
    scaledSize: any;
    anchor: any;
    direction?: any;
    templateUrl?: string;
    template?: string;
}
export interface IMapIconService {
    getIconByAttrs(type: string, direction: number, status?: string, highlight?: boolean, selected?: boolean, focused?: boolean): formattedMapIcon;
}
export interface IMapIconProvider {
    setIconsTemplates(): void;
}


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
export class MapIconTypes {
    static Person: string;
    static Equipment: string;
    static Asset: string;
    static All: string[];
}
export class MapIcons {
    static readonly person: MapIcon[];
    static readonly equipment: MapIcon[];
    static readonly asset: MapIcon[];
    static readonly undefined: MapIcon[];
}

export {};

export class Device {
    org_iding;
    organization_id: string;
    type: string;
    udi: string;
    label?: string;
    create_time?: Date;
    status?: string;
    version?: number;
    deleted?: boolean;
    object_id?: string;
    rec_time?: Date;
    ping_time?: Date;
    object?: ControlObject;
}

export {};

export const enum DeviceStatus {
    Pending = "pending",
    Active = "active",
    Inactive = "inactive",
    Blocked = "blocked",
}

export const enum DeviceType {
    Unknown = "unknown",
    Simulated = "simulated",
    IoTDevice = "iot device",
    Smartphone = "smartphone",
    PhoneWithBridge = "phone with bridge",
    TeltonikaFmb = "teltonika fmb",
}

export interface IDevicesDataService {
    readDevices(params: any, successCallback?: (data: DataPage<Device>) => void, errorCallback?: (error: any) => void): any;
    readDevice(params: any, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    saveDevice(data: Device, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void): any;
    updateDevice(id: string, data: Device, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void): any;
    deleteDevice(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): any;
    verifyDeviceUdi(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    pingDevice(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
}
export interface IDevicesDataProvider {
}



export interface IObjectConfigsService {
    id: string;
    type: string;
    section: number;
    get(): ObjectConfigs;
    clean(): void;
}

export class ObjectConfigs {
    id: string;
    type: string;
    section: number;
}

export {};


export interface ISendSignals {
    updateData(callback: () => void): void;
    sendById(id: string, signalType: number, successcalback?: () => void, errorcalback?: (error: any) => void): void;
    sendBatch(deviceIds: string[], signalType: number, successcalback?: () => void, errorcalback?: (error: any) => void): void;
    getDeviceIdsByObjects(object_ids: string[]): string[];
    getDeviceIdsByGroups(group_ids: string[]): string[];
    getDeviceIdsByZones(zone_ids: string[]): string[];
    sendSignals(data: SendSignalData): void;
}

export {};


export let OrganizationRootVar: string;
export let OrganizationChangedEvent: string;
export let regestryOrgIdKey: string;
export interface IOrganizationService {
    organization: Organization;
    orgId: string;
    canAddOrganization: boolean;
    canRemoveOrganization: boolean;
    isDemo: boolean;
    updateOrganization(value: Organization): void;
    isConnectToDemo(organizations: Organization[]): boolean;
}
export interface IOrganizationProvider {
    setRootVar: boolean;
    orgIdKey: string;
}

export {};

export class EmergencyAction {
    type: string;
    params: any;
}

export const enum EmergencyActionParam {
    Text = "text",
    Name = "name",
    Phone = "phone",
    Page = "page",
    Location = "locaton",
    Position = "pos",
    Uri = "uri",
}

export const enum EmergencyActionType {
    Note = "note",
    CallPhone = "call phone",
    LocalLink = "local link",
    GlobalLink = "global link",
}

export class EmergencyPlan {
    org_iding;
    organization_id: string;
    name: string;
    steps?: EmergencyStep[];
}

export {};

export class EmergencyStep {
    index: number;
    name: string;
    actions: EmergencyAction[];
    checked?: boolean;
}

export interface IEmergencyPlansDataService {
    readEmergencyPlan(id: string, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readEmergencyPlans(params: any, successCallback?: (data: DataPage<EmergencyPlan>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createEmergencyPlan(data: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void;
    updateEmergencyPlan(id: string, data: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void;
    deleteEmergencyPlan(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}
export interface IEmergencyPlansDataProvider extends ng.IServiceProvider {
}



export class SmartZoomItem {
    min?: number;
    max?: number;
    name: string;
}
export class SmartZoomLevel {
    large: SmartZoomItem;
    medium: SmartZoomItem;
    small: SmartZoomItem;
}
export interface ISmartZoomService {
    zoomLevel: string;
    addLevelChangedCallback(callback: Function): void;
    updateZoomLevel(zoom: number): void;
    activate(): void;
    deactivate(): void;
    calculatesmartZoomLevel(organizationRaduis: number): void;
    smartZoomLevels: SmartZoomLevel;
}

export {};


export interface IStatisticsDateService {
    getStartDate(argName?: string, asString?: boolean): Date | string;
    getEndDate(argName?: string, asString?: boolean, t?: string): Date | string;
    getDateType(argName?: string): string;
    formatXTick(x: any, type: any): Function;
    formatXGridTick(x: any, type: any): Function;
}

export {};

export class StatisticsDateSteps {
    static daily: string;
    static weekly: string;
    static monthly: string;
    static yearly: string;
}

export class StatisticsDateType {
    static daily: string;
    static weekly: string;
    static monthly: string;
    static yearly: string;
    static shift: string;
    static range: string;
    static allTime: string;
}

export class StatisticsFormatXTick {
    static yearly(x: any, months: any): string;
    static monthly(x: any): string;
    static weekly(x: any, months: any, days: any): string;
    static daily(x: any): string;
    static shift(x: any): string;
    static range(x: any): string;
}


export interface ITabStateService {
    set(key: string, value: string): any;
    get(key: string): any;
}

export class TabRecord {
    [key: string]: string;
}

export {};


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

export class TypeCollectionItem {
    name?: string;
    id: string;
    title: string;
    shortTitle?: string;
    icon?: string;
    class?: string;
}
export class TypeNumericCollectionItem {
    name?: string;
    id: number;
    title: string;
    shortTitle?: string;
    icon?: string;
    class?: string;
}

export class TypeCollection {
    [key: string]: TypeCollectionItem;
}
export class TypeNumericCollection {
    [key: number]: TypeNumericCollectionItem;
}


function declareDataTypeStringResources(pipTranslateProvider: pip.services.ITranslateProvider): void;

export class DemoService implements IDemoService {
    private $state;
    private $injector;
    private pipAuthState;
    private pipErrorPageConfigService;
    private pipEntry;
    private pipRest;
    private _DEMO_RU;
    private _DEMO_EN;
    private login;
    private passwd;
    constructor($state: ng.ui.IStateService, $injector: ng.auto.IInjectorService, pipAuthState: pip.rest.IAuthStateService, pipErrorPageConfigService: pip.errors.IErrorPageConfigService, pipEntry: pip.entry.IEntryService, pipRest: pip.rest.IRestService);
    setDemoParams(): void;
    private checkSupported();
    signin(): void;
    readonly demo_ru: any;
    readonly demo_en: any;
    isDemoUser(identity: pip.entry.SessionData): boolean;
}

export const DemoStateName: string;


export interface IDemoService {
    demo_en: any;
    demo_ru: any;
    setDemoParams(): void;
    signin(): void;
    isDemoUser(identity: pip.entry.SessionData): boolean;
}



export const LandingStateName: string;







export class IncidentsResolutionDialogParams {
    resolutions: Resolution[];
    event: any;
}
export interface IIncidentsResolutionDialogService {
    show(event: any, params: IncidentsResolutionDialogParams, successCallback?: (data?: any) => void, cancelCallback?: () => void): any;
}

export class IncidentsResolutionDialogController extends IncidentsResolutionDialogParams implements ng.IController {
    private $mdDialog;
    private $state;
    private $timeout;
    private $rootScope;
    $onInit(): void;
    theme: any;
    constructor($mdDialog: angular.material.IDialogService, $state: ng.ui.IStateService, $timeout: ng.ITimeoutService, $rootScope: ng.IRootScopeService);
    onResolutionSetting(): void;
    onCancel(): void;
    selectItem(item: Resolution): void;
}

export {};


export class MultiSelectDialogData {
    id?: string;
    name?: string;
    object_type?: string;
}
export class MultiSelectDialogParams {
    dialogTitle?: string;
    initCollection?: MultiSelectDialogData[];
    entityType: string;
    configState?: string;
    addButtonLabel?: string;
}
export interface IMultiSelectDialogService {
    show(params: MultiSelectDialogParams, successCallback?: (data?: any) => void, cancelCallback?: () => void): any;
}


export class MultiSelectDialogController extends MultiSelectDialogParams implements ng.IController {
    private $mdDialog;
    private $state;
    private $rootScope;
    private iqsGlobalSearch;
    $onInit(): void;
    theme: any;
    defaultCollection: string[];
    searchedCollection: string[];
    search: string;
    collection: SearchResultChecked[];
    allCollection: SearchResultChecked[];
    initCollection: MultiSelectDialogData[];
    objectType: string;
    constructor($mdDialog: angular.material.IDialogService, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, iqsGlobalSearch: IGlobalSearchService, params: any);
    private initSelectedItems();
    private updateCollection();
    onSearchResult(query: string, notUpdateCollection?: boolean): void;
    onCanselSearch(): void;
    private getSelected();
    change(): void;
    cancel(): void;
    config(): void;
}

export {};



export interface ISendSignalDialogService {
    show(successCallback?: (data?: SendSignalData) => void, cancelCallback?: () => void): any;
}

export class SendSignalDialogController implements ng.IController {
    private $mdDialog;
    private $state;
    private $rootScope;
    private iqsGlobalSearch;
    private iqsObjectsViewModel;
    private iqsObjectGroupsViewModel;
    private iqsZonesViewModel;
    $onInit(): void;
    theme: any;
    signalTypeCollection: any;
    signalType: number;
    objectCategory: string;
    controlObject: string;
    zone: string;
    objectInclude: MultiSelectDialogData[];
    zoneInclude: MultiSelectDialogData[];
    includeObjectSearch: string;
    includeZoneSearch: string;
    private variantsObject;
    private variantsZone;
    dialogState: string;
    collectionObjects: SearchResultChecked[];
    collectionZones: SearchResultChecked[];
    objectType: string;
    searchedCollectionObjects: string[];
    defaultCollectionObjects: string[];
    searchedCollectionZones: string[];
    defaultCollectionZones: string[];
    queryObjects: string;
    queryZones: string;
    constructor($mdDialog: angular.material.IDialogService, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, iqsGlobalSearch: IGlobalSearchService, iqsObjectsViewModel: IObjectsViewModel, iqsObjectGroupsViewModel: IObjectGroupsViewModel, iqsZonesViewModel: IZonesViewModel);
    private init();
    private getSelected();
    private getCollection(collection, collectionIds, type?);
    private getIds(collection, entityType?);
    send(): void;
    cancel(): void;
    getVariantsObjectsInclude(search: string): any[];
    getVariantsZonesInclude(search: string): any[];
    onSearchResultObjects(query: string): void;
    onSearchResultZones(query: string): void;
    initSelectedObjectsItems(): void;
    initSelectedZonesItems(): void;
    onCanselSearchObjects(): void;
    onCanselSearch(): void;
    openObjectsAndGroupsState(): void;
    openZonesState(): void;
    onSetObjectsClick(): void;
    onSetZonesClick(): void;
}

export {};


export {};



export class DatePeriods {
    id: string;
    name: string;
}

export class DatePeriodValues {
    static readonly Daily: string;
    static readonly Weekly: string;
    static readonly Monthly: string;
    static readonly Yearly: string;
    static readonly Shift: string;
    static readonly Range: string;
}


export interface IStatisticsCollectionsService {
    getObjectAndGroupCollection(): StatisticsDataCollectionItem[];
    getZoneCollection(): StatisticsDataCollectionItem[];
}

export {};

export class StatisticsDataCollectionItem {
    id: string;
    name?: string;
    object_type?: string;
    count?: number;
    color?: string;
    type?: string;
    category?: string;
    startHour?: any;
    endHour?: any;
}


function declareStatisticsFilterStringResources(pipTranslateProvider: pip.services.ITranslateProvider): void;

export class StatisticsFilterResult {
    fromDate: Date;
    toDate: Date;
    formattedDate: string;
    datePeriod?: string;
    param?: string;
    paramName?: string;
    ruleId?: string;
    rule?: any;
    zoneId?: string;
    zone?: any;
    actionId?: string;
    objectId?: string;
    object?: any;
    deviceId?: string;
    device?: any;
    objectGroupId?: string;
    objectGroup?: any;
}

export class StatisticsFilterValues {
    ruleValue?: string;
    objectValue?: string;
    deviceValue?: string;
    zoneValue?: string;
    actionEventRuleValue?: string;
    paramsValue?: string;
    shiftValue?: string;
}

export class StatisticsFilterVisibility {
    ActionFilter?: boolean;
    ObjectFilter?: boolean;
    EventRuleFilter?: boolean;
    ZoneFilter?: boolean;
    DatePeriod?: boolean;
    ParamsFilter?: boolean;
    DeviceFilter?: boolean | number;
    IncidentFilter?: boolean;
}

export class StatisticsParams {
    static distance: string;
    static online: string;
    static freezed: string;
    static speed: string;
    static offline: string;
    static immobile: string;
    static allParams: string;
    static all: string[];
}

export class EmergencyPlanPanelState {
    static List: string;
    static Details: string;
}


export {};


export {};

export {};

export {};


export class GlobalHelpPanelState {
    static List: string;
    static Details: string;
}

export const OrganizationsCreateStateName: string;


export const OrganizationsConnectionStateName: string;

export const OrganizationsStateName: string;
export const OrganizationsHomeStateName: string;


export const OrganizationQuickStartStateName: string;


export const OrganizationWelcomeStateName: string;


export const OrganizationInvitationStateName: string;


export {};





export class FilterDialogController extends FilterDialogParams implements ng.IController {
    private $mdDialog;
    private $state;
    private $rootScope;
    private iqsGlobalSearch;
    $onInit(): void;
    theme: any;
    isZoneFilter: boolean;
    isObjectFilter: boolean;
    isActionFilter: boolean;
    isEventRuleFilter: boolean;
    isDatePeriod: boolean;
    isParamsFilter: boolean;
    isDeviceFilter: boolean;
    startDate: Date;
    currDate: Date;
    datePeriodType: string;
    dateLabel: string;
    dialogParams: any;
    constructor($mdDialog: angular.material.IDialogService, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, iqsGlobalSearch: IGlobalSearchService, params: any);
    private setFillData();
    change(): void;
    cancel(): void;
}

export {};


export class FilterDialogData {
    id?: string;
    name?: string;
    object_type?: string;
}
export class FilterDialogParams {
    filterVisibility?: StatisticsFilterVisibility;
    fillData?: any;
}
export interface IFilterDialogService {
    show(params: FilterDialogParams, successCallback?: (data?: any) => void, cancelCallback?: () => void): any;
}


export {};

export {};

export {};


interface ILoraPanelBindings {
    [key: string]: any;
    onNext: any;
    ngDisabled: any;
}
const LoraPanelBindings: ILoraPanelBindings;
class LoraPanelChanges implements ng.IOnChangesObject, ILoraPanelBindings {
    [key: string]: ng.IChangesObject<any>;
    onNext: ng.IChangesObject<() => ng.IPromise<void>>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}
class LoraPanelController implements ng.IController {
    private $element;
    private $state;
    private $timeout;
    pipMedia: pip.layouts.IMediaService;
    $onInit(): void;
    ngDisabled: () => boolean;
    onNext: () => void;
    constructor($element: JQuery, $state: ng.ui.IStateService, $timeout: ng.ITimeoutService, pipMedia: pip.layouts.IMediaService);
    next(): void;
}

export {};

export {};

export {};

interface IMobileWelcomePanelBindings {
    [key: string]: any;
    onLora: any;
    onPhone: any;
    ngDisabled: any;
}
const MobileWelcomePanelBindings: IMobileWelcomePanelBindings;
class MobileWelcomePanelChanges implements ng.IOnChangesObject, IMobileWelcomePanelBindings {
    [key: string]: ng.IChangesObject<any>;
    onLora: ng.IChangesObject<() => ng.IPromise<void>>;
    onPhone: ng.IChangesObject<() => ng.IPromise<void>>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}
class MobileWelcomePanelController implements ng.IController {
    private $element;
    private $state;
    private $timeout;
    pipMedia: pip.layouts.IMediaService;
    $onInit(): void;
    ngDisabled: () => boolean;
    onLora: () => void;
    onPhone: () => void;
    constructor($element: JQuery, $state: ng.ui.IStateService, $timeout: ng.ITimeoutService, pipMedia: pip.layouts.IMediaService);
    onNextPhone(): void;
    onNextLora(): void;
}

export {};

export {};


}

