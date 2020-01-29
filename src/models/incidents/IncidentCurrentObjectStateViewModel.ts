import '../../models/current_object_states/CurrentObjectStatesModel';
import { CurrentObjectStatesModel } from '../../models/current_object_states/CurrentObjectStatesModel';

import { IIncidentCurrentObjectStateViewModel } from './IIncidentCurrentObjectStateViewModel';
import { IObjectFormatService } from '../../common';
import {
    ICurrentObjectStatesDataService,
    ObjectState
} from '../../data';
import {
    IDevicesViewModel,
    IIncidentsViewModel,
    IObjectsViewModel,
    IObjectRoutesViewModel
} from '../../models';
import {
    IMapIconService,
    IObjectConfigsService,
    IOrganizationService,
    ISmartZoomService
} from '../../services';


class IncidentCurrentObjectStateViewModel implements IIncidentCurrentObjectStateViewModel {
    public model: CurrentObjectStatesModel;

    constructor(
        $location: ng.ILocationService,
        iqsCurrentObjectStatesData: ICurrentObjectStatesDataService,
        iqsDevicesViewModel: IDevicesViewModel,
        iqsObjectsViewModel: IObjectsViewModel,
        iqsMapIcon: IMapIconService,
        iqsObjectConfigs: IObjectConfigsService,
        pipMapHelperSrv: any,
        $rootScope: ng.IRootScopeService,
        iqsObjectRoutesViewModel: IObjectRoutesViewModel,
        iqsIncidentsViewModel: IIncidentsViewModel,
        iqsSmartZoom: ISmartZoomService,
        pipTranslate: pip.services.ITranslateService,
        iqsObjectFormat: IObjectFormatService,
        iqsOrganization: IOrganizationService 
    ) {
        this.model = new CurrentObjectStatesModel(
            $location,
            iqsCurrentObjectStatesData, 
            iqsDevicesViewModel, 
            iqsObjectsViewModel, 
            iqsMapIcon, 
            iqsObjectConfigs,
            pipMapHelperSrv,
            $rootScope,
            iqsObjectRoutesViewModel,
            iqsIncidentsViewModel,
            iqsSmartZoom,
            pipTranslate,
            iqsObjectFormat,
            iqsOrganization
        );
    }

    public initCurrentObjectStates(filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void) {
        this.model.getObjectStates(filter || 'all', successCallback, errorCallback);
    }

    public get allCurrentObjectStates() {
        return this.model.allObjectStates;
    }

    public statusObject(object: ObjectState): string {
        if (object.emergency > 0) return 'MAP_STATUS_OBJECT_DANGER'; // 'в опасности';
        if (object.freezed > 0) return 'MAP_STATUS_OBJECT_FREEZED'; //'полностью неподвижный';
        if (object.immobile > 0) return 'MAP_STATUS_OBJECT_IMMOBILITY'; //'неподвижный';

        return 'MAP_STATUS_OBJECT_ONLINE' ;//'на связи';
    }

    public getCurrentObjectStateByObjectId(id: string): ObjectState {
        return this.model.getObjectStateByObjectId(id);
    }

    public clean(): void {
        this.model.cleanUp();
    }       
}

angular.module('iqsIncidentCurrentObjectStates.ViewModel', [
    'iqsCurrentObjectStates.Data',
    'iqsDevices.ViewModel',
    'iqsObjects.ViewModel',
    'iqsObjectRoutes.ViewModel',
    'iqsIncidents.ViewModel'
])
    .service('iqsIncidentCurrentObjectStatesViewModel', IncidentCurrentObjectStateViewModel);