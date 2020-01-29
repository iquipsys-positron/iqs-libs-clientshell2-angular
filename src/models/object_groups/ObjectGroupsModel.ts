import { ObjectGroup, DataPage, IObjectGroupsDataService } from '../../data';
import { States } from '../../common/States';
import { IObjectsViewModel } from '../../models';
import {
    IOrganizationService,
    SearchResult
} from '../../services';

export class ObjectGroupsModel {
    private _state: string;
    private _isSort: boolean;
    private _filter: any;

    private objectGroups: ObjectGroup[];
    private filterGroups: ObjectGroup[];
    private selectIndex: number;
    private selectedItem: ObjectGroup;
    private transaction: pip.services.Transaction;
    private start: number = 0;
    private take: number = 100;
    private selectedIndex: number;

    private updatedTimeStamp: number;
    private updatedInterval: number = 3 * 60 * 1000; // update data if its old by 3min

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService,
        private iqsObjectGroupsData: IObjectGroupsDataService,
        private iqsObjectsViewModel: IObjectsViewModel
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('Object_Group');
        this.objectGroups = [];
        this.filterGroups = [];
    }

    // private operation
    private updateItemInCollection(item: ObjectGroup): void {
        let index: number = _.findIndex(this.filterGroups, (ev) => {
            return ev.id == item.id;
        });
        // insert group
        if (index > -1) {
            let sortNeed: boolean = item.name != this.filterGroups[index].name;
            this.filterGroups[index] = item;
            if (this.isSort && sortNeed) {
                this.filterGroups = this.sortCollection(this.filterGroups);
                index = _.findIndex(this.filterGroups, (ev) => {
                    return ev.id == item.id;
                });
            }
            if (this.selectedItem) {
                if (this.selectedItem.id != item.id) {
                    this.selectItem(0);
                } else {
                    this.selectItem(index);
                }
            } else {
                this.selectItem(index);
            }
        } else {
            if (this._isSort) {
                index = _.findIndex(this.filterGroups, (ev) => {
                    return ev.name.toLocaleLowerCase() > item.name.toLocaleLowerCase();
                });
                if (index > -1) {
                    this.filterGroups.splice(index, 0, item);
                } else {
                    this.filterGroups.push(item);
                    index = this.filterGroups.length - 1;
                }
            } else {
                this.filterGroups.unshift(item);
                index = 0;
            }
            // this.localSearch = '';
            // this.selectedItem = item;
            index = _.findIndex(this.filterGroups, (ev) => {
                return ev.id == item.id;
            });
            this.selectItem(index);
        }

        this.updateAllGroup(item);
        this.collectionChanged();
    }

    private updateAllGroup(item: ObjectGroup) {
        let index: number = _.findIndex(this.objectGroups, (ev) => {
            return ev.id == item.id;
        });

        let sortNeed: boolean = false;

        if (index > -1) {
            sortNeed = this.objectGroups[index] && item.name != this.objectGroups[index].name;
            this.objectGroups[index] = item;
        } else {
            this.objectGroups.unshift(item);
        }

        if (this.isSort && sortNeed) {
            this.objectGroups = this.sortCollection(this.objectGroups);
        }
    }

    private sortCollection(data: ObjectGroup[]): ObjectGroup[] {
        let collection = _.sortBy(data, function (item: ObjectGroup) {
            return item.name ? item.name.toLocaleLowerCase() : '';
        });

        return collection;
    }

    private collectionChanged() {
        this.$timeout(() => {
            this.setState();
            this.iqsObjectsViewModel.read();
        }, 0);
        // send broadcast ???
    }

    private setState() {
        this.state = (this.filterGroups && this.filterGroups.length > 0) ? States.Data : States.Empty;
    }

    private onRead(data: ObjectGroup[], callback?: (data: ObjectGroup[]) => void): void {
        if (data && data.length > 0) {
            if (this.isSort) {
                this.objectGroups = this.sortCollection(data);
            } else {
                this.objectGroups = data;
            }
            this.filterGroups = this.objectGroups;
            this.selectedIndex = _.findIndex(this.filterGroups, (item: ObjectGroup) => {
                return item.id == this.$location.search()['id'];
            });
            this.selectedIndex = this.selectedIndex > -1 ? this.selectedIndex : 0;
        } else {
            this.objectGroups = [];
            this.filterGroups = [];
            this.selectedIndex = -1;
        }

        this.selectItem(this.selectedIndex);
        // set last reading time 
        this.updatedTimeStamp = new Date().getTime();

        this.transaction.end();
        this.collectionChanged();

        if (callback) {
            callback(this.filterGroups);
        }
    }

    // CRUD operation

    private getFilter(): any {
        if (!this._filter || !angular.isObject(this._filter)) {
            this._filter = {};
        }

        if (!this._filter.org_id && this.iqsOrganization.orgId) {
            this._filter.org_id = this.iqsOrganization.orgId
        }

        return this._filter;
    }

    public read(successCallback?: (data: ObjectGroup[]) => void, errorCallback?: (error: any) => void, stopTransaction?: boolean): angular.IPromise<any> {
        if (!stopTransaction) {
            this.transaction.begin('read');
        }
        return this.iqsObjectGroupsData.readObjectGroups(this.getFilter(),
            (response: DataPage<ObjectGroup>) => {
                this.onRead(response.data, successCallback);
            },
            (error: any) => {
                if (!stopTransaction) {
                    this.transaction.end(error);
                }

                this.$log.error('Error: ' + JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public create(ObjectGroup: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('create_event_template');
        this.iqsObjectGroupsData.createObjectGroup(ObjectGroup,
            (data: ObjectGroup) => {
                this.state = States.Data;
                this.updateItemInCollection(data);
                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Create event template error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('delete_event_template');
        let index: number;
        if (this.selectedItem && this.selectedItem.id == id) {
            index = this.selectIndex < this.filterGroups.length - 1 ? this.selectIndex : this.selectIndex - 1;
        } else {
            index = this.selectIndex;
        }
        this.iqsObjectGroupsData.deleteObjectGroup(id,
            () => {
                this.remove(id);
                this.selectItem(index);
                if (successCallback) {
                    successCallback();
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Delete event template error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }


    public update(id: string, ObjectGroup: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('update_event_template');

        this.iqsObjectGroupsData.updateObjectGroup(id, ObjectGroup,
            (data: ObjectGroup) => {
                this.state = States.Data;
                this.$location.search('group_id', data.id);
                this.updateItemInCollection(data);
                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Update event template error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }



    // property

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get isSort(): boolean {
        return this._isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this._isSort = value;
        }
    }

    public get state(): string {
        return this._state;
    }

    public set state(value: string) {
        if (value) {
            this._state = value;
        }
    }

    // data operation
    public get(updateCallback?: () => void): ObjectGroup[] {
        let timeStamp: number = new Date().getTime();
        if (timeStamp - this.updatedInterval > this.updatedTimeStamp) {
            this.updatedTimeStamp = timeStamp;
            this.read(updateCallback);
        }

        return this.objectGroups;
    }

    public getFilterGroups(updateCallback?: () => void): ObjectGroup[] {
        let timeStamp: number = new Date().getTime();
        if (timeStamp - this.updatedInterval > this.updatedTimeStamp) {
            this.updatedTimeStamp = timeStamp;
            this.read(updateCallback);
        }

        return this.filterGroups;
    }

    public getSelectedIndex(): number {
        return this.selectIndex;
    }

    public getSelectedItem(): ObjectGroup {
        return this.selectedItem;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public remove(id: string): void {
        _.remove(this.objectGroups, { id: id });
        _.remove(this.filterGroups, { id: id });
        this.collectionChanged();
    }

    public getGroupById(groupId: string): ObjectGroup {
        if (!groupId) return null;

        return _.find(this.objectGroups, { id: groupId });
    }

    public reload(successCallback?: (data: ObjectGroup[]) => void, errorCallback?: (error: any) => void) {
        this.start = 0;
        this.selectIndex = 0;
        this.objectGroups = new Array();
        this.filterGroups = new Array();
        this.state = States.Progress;
        this.read(successCallback, errorCallback);
    }

    public selectItem(index?: number): void {
        if (index === undefined || index === null || index < 0 || index > this.filterGroups.length - 1) {
            let id: string = this.$location.search()['group_id'];
            if (id) {
                index = _.findIndex(this.filterGroups, (item: ObjectGroup) => {
                    return item.id == id;
                });
            }
            if (!index || index == -1) {
                index = 0;
            }
        }

        if (this.filterGroups.length > index) {
            this.selectIndex = index;
        } else {
            this.selectedIndex = 0;
        }

        this.selectedItem = (this.filterGroups && this.filterGroups.length > 0) ? this.filterGroups[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('group_id', this.selectedItem.id);
        }
    }

    public filterWithObjects(data: SearchResult[]) {
        let index: number;
        if (!data) {
            this.filterGroups = this.objectGroups;
        } else {
            this.filterGroups = _.filter(this.objectGroups, (item: ObjectGroup) => {
                index = _.findIndex(data, { id: item.id });
                if (index > -1) {
                    return true;
                }
                return false;
            })
        }

        this.setState();

        this.selectItem();
    }

    public clean(): void {
        this.objectGroups = [];
        this.filterGroups = [];
        this.selectIndex = -1;;
        this.selectedItem = null;
        this.state = States.Empty;
        this.selectedIndex = -1;
    }

}