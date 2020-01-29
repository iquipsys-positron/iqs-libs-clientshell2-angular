import { IObjectGroupsDataService, IObjectGroupsDataProvider } from './IObjectGroupsDataService';
import { ObjectGroup } from './ObjectGroup';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class ObjectGroupsDataService implements IObjectGroupsDataService {
    private RESOURCE: string = 'object_groups';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService,
        private $timeout
    ) {
        "ngInject";

    }

    public readObjectGroups(params: any, successCallback?: (data: DataPage<ObjectGroup>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;
        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    public readObjectGroup(id: string, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get(
            {
                group_id: id,
                org_id: this.iqsOrganization.orgId
            }, successCallback, errorCallback);
    }

    public createObjectGroup(data: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            { org_id: this.iqsOrganization.orgId }, //null,
            data,
            successCallback,
            errorCallback
        );
    }

    public updateObjectGroup(id: string, data: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).update(
            { 
                group_id: id,
                org_id: this.iqsOrganization.orgId 
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteObjectGroup(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).remove(
            { 
                group_id: id,
                org_id: this.iqsOrganization.orgId 
            },
            null,
            successCallback,
            errorCallback
        );
    }
}


class ObjectGroupsDataProvider implements IObjectGroupsDataProvider {
    private _service: IObjectGroupsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService,
        $timeout
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new ObjectGroupsDataService(pipRest, iqsOrganization, $timeout);
        }

        return this._service;
    }

}


angular
    .module('iqsObjectGroups.Data', ['pipRest', 'pipServices', 'iqsObjectGroups.Resource'])
    .provider('iqsObjectGroupsData', ObjectGroupsDataProvider);