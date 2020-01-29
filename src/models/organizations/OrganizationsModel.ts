import { States } from '../../common';
import { IOrganizationsDataService, Organization } from '../../data/organizations';
import { DataPage } from '../../data/DataPage';

export class OrganizationsModel {
    public state: string;
    private _transaction: pip.services.Transaction;

    public allOrganizations: Organization[] = [];

    constructor(
        pipTransaction: pip.services.ITransactionService,
        private $location: ng.ILocationService,
        private iqsOrganizationsData: IOrganizationsDataService,
        private pipRest: pip.rest.IRestService,
        private pipIdentity: pip.services.IIdentityService,
    ) {
        "ngInject";

        this._transaction = pipTransaction.create('organizations');
    }

    private updateIdentity(successCallback?: () => void, errorCallback?: (error: any) => void) {
        this._transaction.begin('update_id');
        this.pipRest.getResource('restoreSessions').call(
            {
                session_id: this.pipIdentity.identity.id
            },
            (data: pip.entry.SessionData) => {
                this.pipIdentity.identity = data;
                this._transaction.end();
                if (successCallback) {
                    successCallback();
                }
            },
            (error: any) => {
                this._transaction.end(error);
                if (errorCallback) {
                    errorCallback(error);
                }
                // todo show toas message
            });
    }

    private setState() {
        this.state = (this.allOrganizations && this.allOrganizations.length > 0) ? States.Data : States.Empty;
    }

    public getOrganizations(successCallback?: (data: Organization[]) => void, errorCallback?: (error: any) => void) {
        this._transaction.begin('read');
        this.state = States.Progress;
        this.iqsOrganizationsData.readOrganizations(null, (data: DataPage<Organization>) => {
            this.getOrganizationCallback(data, successCallback);
        }, (error: any) => {
            this._transaction.end(error);
            if (angular.isFunction(errorCallback)) {
                errorCallback(error);
            }
        });
    }


    public getOrganizationById(id: string) {
        return _.find(this.allOrganizations, (organization) => { return organization.id === id; });
    }

    private getOrganizationCallback(data: DataPage<Organization>, successCallback?: (data: Organization[]) => void) {
        this.allOrganizations = data.data;
        this._transaction.end();
        this.setState();
        if (successCallback) {
            successCallback(this.allOrganizations);
        }
    }

    public updateOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this._transaction.begin('update_organization');
        this.iqsOrganizationsData.updateOrganization(data.id, data, (organization: Organization) => {
            let index: number = _.findIndex(this.allOrganizations, { id: organization.id });
            if (index > -1) {
                this.allOrganizations[index] = organization;
            }
            this._transaction.end();
            this.setState();
            this.updateIdentity(() => {
                if (successCallback) {
                    successCallback(organization);
                }
            }, errorCallback);

        }, (error: any) => {
            this._transaction.end(error);
            if (angular.isFunction(errorCallback)) {
                errorCallback(error);
            }
        });
    }

    public createOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this._transaction.begin('create');
        let organizationCreated: Organization;
        async.series([
            (callback) => {
                this.iqsOrganizationsData.saveOrganization(data, (organization: Organization) => {
                    this.allOrganizations.push(organization);
                    this._transaction.end();
                    this.setState();
                    organizationCreated = organization;
                    callback();
                }, (error: any) => {
                    callback(error);
                    // this._transaction.end(error);
                    // if (angular.isFunction(errorCallback)) {
                    //     errorCallback(error);
                    // }
                });
            },
            (callback) => {
                this.updateIdentity(() => {
                    callback();
                }, (error: any) => { callback(error); });
            },
            (callback) => {
                this.iqsOrganizationsData.addToCluster(organizationCreated.id, (data: any) => {
                    callback();
                }, (error: any) => { callback(error); })
            }
        ], (error: any) => {
            if (error) {
                this._transaction.end(error);
                if (errorCallback) errorCallback(error);
                return;
            }
            this._transaction.end();
            if (successCallback) successCallback(organizationCreated);
        });
        this.iqsOrganizationsData.saveOrganization(data, (organization: Organization) => {
            this.allOrganizations.push(organization);
            this._transaction.end();
            this.setState();
            this.updateIdentity(() => {
                if (successCallback) {
                    successCallback(organization);
                }
            }, errorCallback);
        }, (error: any) => {
            this._transaction.end(error);
            if (angular.isFunction(errorCallback)) {
                errorCallback(error);
            }
        });
    }

    public deleteOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this._transaction.begin('delete');
        this.iqsOrganizationsData.deleteOrganization(data.id, (organization: Organization) => {
            this.allOrganizations = _.filter(this.allOrganizations, { id: !data.id });
            this._transaction.end();
            this.updateIdentity(() => {
                this.setState();
                if (successCallback) {
                    successCallback(organization);
                }
            }, errorCallback);
        }, (error: any) => {
            this._transaction.end(error);
            if (angular.isFunction(errorCallback)) {
                errorCallback(error);
            }
        });
    }

    public demoConnect(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this._transaction.begin('demo');
        this.iqsOrganizationsData.demoConnect(params, (data: any) => {
            this._transaction.end();
            this.setState();
            this.updateIdentity(() => {
                if (successCallback) {
                    successCallback(data);
                }
            });

        }, (error: any) => {
            this._transaction.end(error);
            if (angular.isFunction(errorCallback)) {
                errorCallback(error);
            }
        });
    }

    public removeOrganization(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this._transaction.begin('remove');
        this.iqsOrganizationsData.removeOrganization(id, (data: any) => {
            this._transaction.end();
            this.updateIdentity(() => {
                if (successCallback) {
                    successCallback(data);
                }
            }, errorCallback);
        }, (error: any) => {
            this._transaction.end(error);
            if (angular.isFunction(errorCallback)) {
                errorCallback(error);
            }
        });
    }

    public get transaction(): pip.services.Transaction {
        return this._transaction;
    }

    public clean(): void {
        this.allOrganizations = [];
        this.state = States.Empty;
    }

    public getUserOrganizations(): Organization[] {
        let s: Organization[] = [];

        _.each(this.pipIdentity.identity.user.organizations, (item: Organization) => {
            let index: number = _.findIndex(this.allOrganizations, (organization: Organization) => {
                return item.id == organization.id
            });
            if (index > -1) {
                s.push(this.allOrganizations[index]);
            }
        });

        return s;
    }
}