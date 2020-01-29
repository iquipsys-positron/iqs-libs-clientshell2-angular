import './AccountsResources';
import './ActivitiesResources';
import './AgreementsResources';
import './ApplicationsResources';
import './AttendancesResources';
import './BeaconsResources';
import './ControlObjectsResources';
import './CorrectionsResources';
import './CountersResources';
import './CreditCardResources';
import './CurrentDeviceStateResources';
import './CurrentObjectRoutesResources';
import './CurrentObjectStateResources';
import './DataProfile';
import './DevicesResources';
import './EmergencyPlansResources';
import './EventRulesResources';
import './EventsResources';
import './EventTemplateResources';
import './GatewaysResources';
import './HelpArticlesResources';
import './HelpTopicsResources';
import './IncidentsResources';
import './InvitationsResources';
import './LocationsResources';
import './LoggingResources';
import './ObjectGroupsResources';
import './ObjectPositionsResources';
import './ObjectRoutesResources';
import './ObjectStateResources';
import './OperationalEventResources';
import './PipStatisticsResources';
import './ResolutionsResources';
import './RolesResources';
import './RostersResources';
import './SessionsResources';
import './SettingsResources';
import './ShiftsResources';
import './SignalResources';
import './OrganizationsResources';
import './StatisticsResources';
import './ZonesResources';

angular.module('iqsRest', [
    'pipCommonRest',
    'iqsAccounts.Resource',
    'iqsActivities.Resource',
    'iqsAgreements.Resource',
    'iqsApplications.Resource',
    'iqsAttendances.Resource',
    'iqsBeacons.Resource',
    'iqsControlObjects.Resource',
    'iqsCorrections.Resource',
    // TODO #0002
    // counters are empty
    'iqsCounters.Resource',
    'iqsCreditCards.Resource',
    'iqsCurrentDeviceStates.Resource',
    'iqsCurrentObjectStates.Resource',
    'iqsDataProfiles.Resource',
    'iqsDevices.Resource',
    'iqsEmergencyPlans.Resource',
    'iqsEventRules.Resource',
    'iqsEventTemplates.Resource',
    'iqsGateways.Resource',
    'iqsHelpArticles.Resource',
    'iqsHelpTopics.Resource',
    'iqsIncidents.Resource',
    'iqsInvitations.Resource',
    'iqsLocations.Resource',

    'pipLoggingResources',
    
    'iqsObjectGroups.Resource',
    'iqsObjectPositions.Resource',
    'iqsObjectRoutes.Resource',
    'iqsObjectStates.Resource',
    'iqsOperationalEvents.Resource',

    // TODO #0003
    // 500 error
    'pipStatisticsResources',
    
    'iqsResolutions.Resource',
    'iqsRoles.Resource',
    'iqsRosters.Resource',
    'iqsSessions.Resource',
    'iqsSettings.Resource',
    'iqsShifts.Resource',
    'iqsSignals.Resource',
    'iqsOrganizations.Resource',
    'iqsStatistics.Resource',
    'iqsZones.Resource'
]);