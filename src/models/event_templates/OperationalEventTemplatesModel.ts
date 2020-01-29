import { States } from '../../common';
import { EventTemplate, IEventTemplatesDataService, DataPage } from '../../data';
import { IOrganizationService } from '../../services';

export class OperationalEventTemplatesModel {
    private _state: string;
    private _isSort: boolean;
    private _filter: any;

    private eventTemplate: EventTemplate[];
    private eventTemplateFiltered: EventTemplate[];
    private searchedCollection: string[];
    private selectIndex: number;
    private selectedItem: EventTemplate;
    private transaction: pip.services.Transaction;
    private start: number = 0;
    private take: number = 100;
    private localSearch: string = null;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService,
        private iqsEventTemplatesData: IEventTemplatesDataService
    ) {
        "ngInject";
        this.transaction = pipTransaction.create('Operational_Event_Themplate');
        this.eventTemplate = [];
        // this.eventTemplateFiltered = [];
        this.searchedCollection = [];
    }

    // private operation
    private updateItemInCollection(item: EventTemplate): void {
        let index: number = _.findIndex(this.eventTemplate, (ev) => {
            return ev.id == item.id;
        });

        // insert event without sort
        if (index > -1) {
            let sortNeed: boolean = item.description != this.eventTemplate[index].description;
            this.eventTemplate[index] = item;
            if (this.isSort && sortNeed) {
                this.sortCollection(this.eventTemplate);
            }
            if (this.selectedItem) {
                if (this.selectedItem.id != item.id) {
                    this.selectItem(0);
                }
            } else {
                this.selectItem(index);
            }
        } else {
            if (this._isSort) {
                index = _.findIndex(this.eventTemplate, (ev) => {
                    return ev.description.toLocaleLowerCase() > item.description.toLocaleLowerCase();
                });

                if (index > -1) {
                    this.eventTemplate.splice(index, 0, item);
                } else {
                    this.eventTemplate.push(item);
                    index = this.eventTemplate.length - 1;
                }
            } else {
                this.eventTemplate.unshift(item);
                index = 0;
            }
            // let search: string = this.localSearch;
            this.localSearch = '';

            this.getFiltered(this.localSearch);
            index = _.findIndex(this.eventTemplateFiltered, (ev) => {
                return ev.id == item.id;
            });

            this.selectItem(index);
        }

        this.collectionChanged();
    }

    private collectionChanged() {
        // this.$timeout(() => {
            this.localSearch = null;
            this.setState();
        // }, 0);
        // send broadcast ???
    }

    private setState() {
        this.state = (this.eventTemplateFiltered && this.eventTemplateFiltered.length > 0) ? States.Data : States.Empty;
    }

    private prepareSearchedCollection() {
        this.searchedCollection = [];
        _.each(this.eventTemplate, (item: EventTemplate) => {
            this.searchedCollection.push(item.description.toLocaleLowerCase());
        });
    }

    private sortCollection(data: EventTemplate[]): void {
        this.eventTemplate = _.sortBy(data, function (item: EventTemplate) {
            return item.description ? item.description.toLocaleLowerCase() : '';
        });
    }

    private onRead(data: EventTemplate[], callback?: (data: EventTemplate[]) => void): void {
        let index: number;
        if (data && data.length > 0) {
            if (this.isSort) {
                this.sortCollection(data);
            } else {
                this.eventTemplate = data;
            }
            index = _.findIndex(this.eventTemplate, (item: EventTemplate) => {
                return item.id == this.$location.search()['event_templete_id'];
            });
            index = index > -1 ? index : 0;
        } else {
            this.eventTemplate = [];
            this.searchedCollection = [];
            index = -1;
        }
        if (!this.localSearch) {
            this.eventTemplateFiltered = this.eventTemplate;
        }
        this.prepareSearchedCollection();

        this.selectItem(index);
        this.transaction.end();

        if (callback) {
            callback(this.eventTemplate);
        }
        this.collectionChanged();
    }

    private getFiltered(localSearch?: string): EventTemplate[] {
        let searchedCollection: EventTemplate[] = [];

        // not filtered, return all collection
        if (!localSearch) {
            this.localSearch = null;
            this.eventTemplateFiltered = this.eventTemplate;
            this.selectItem();

            return this.eventTemplateFiltered;
        }

        if (localSearch && localSearch != this.localSearch) {
            let searchQuery = localSearch.toLowerCase();
            searchedCollection = _.filter(this.eventTemplate, (item: EventTemplate) => {
                return item.description.toLowerCase().indexOf(searchQuery) > -1;
            });

            this.localSearch = localSearch;
            this.eventTemplateFiltered = searchedCollection;
            this.selectItem();
        }

        return this.eventTemplateFiltered;
    }

    private getFilter(): any {
        if (!this._filter || !angular.isObject(this._filter)) {
            this._filter = {};
        }

        if (!this._filter.org_id && this.iqsOrganization.orgId) {
            this._filter.org_id = this.iqsOrganization.orgId
        }

        return this._filter;
    }

    // CRUD operation
    public read(successCallback?: (data: EventTemplate[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('read');
        return this.iqsEventTemplatesData.readEventTemplates(this.getFilter(),
            (response: DataPage<EventTemplate>) => {
                this.onRead(response.data, successCallback);
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Error: ' + JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public create(eventTemplate: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('create_event_template');
        this.iqsEventTemplatesData.createEventTemplate(eventTemplate,
            (data: EventTemplate) => {
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
            index = this.selectIndex < this.eventTemplateFiltered.length - 1 ? this.selectIndex : this.selectIndex - 1;
        } else {
            index = this.selectIndex;
        }

        this.iqsEventTemplatesData.deleteEventTemplate(id,
            () => {
                this.remove(id);
                if (successCallback) {
                    successCallback();
                }
                this.selectItem(index);
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

    public update(id: string, eventTemplate: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('update_event_template');

        this.iqsEventTemplatesData.updateEventTemplate(id, eventTemplate,
            (data: EventTemplate) => {
                this.state = States.Data;
                this.$location.search('event_templete_id', data.id);
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
    public get(localSearch?: string): EventTemplate[] {
        let result = this.getFiltered(localSearch);
        this.setState();

        return result;
    }

    public getSearchedCollection(): string[] {
        return this.searchedCollection;
    }

    public getSelectedIndex(): number {
        return this.selectIndex;
    }

    public getSelectedItem(): EventTemplate {
        return this.selectedItem;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public remove(id: string): void {
        _.remove(this.eventTemplate, { id: id });
        _.remove(this.eventTemplateFiltered, { id: id });
        this.collectionChanged();
    }

    public reload(successCallback?: (data: EventTemplate[]) => void, errorCallback?: (error: any) => void) {
        this.eventTemplate = new Array();
        this.eventTemplateFiltered = new Array();
        this.state = States.Progress;
        this.read(successCallback, errorCallback);
    }

    public selectItem(index?: number): void {
        if (index === undefined || index === null || index < 0 || index > this.eventTemplateFiltered.length - 1) {
            if (this.$location.search()['event_templete_id']) {
                index = _.findIndex(this.eventTemplateFiltered, (item: EventTemplate) => {
                    return item.id == this.$location.search()['event_templete_id'];
                });
            }
            if (!index || index == -1) {
                index = 0;
            }
        }

        this.selectIndex = index;

        this.selectedItem = (this.eventTemplateFiltered && this.eventTemplateFiltered.length > 0) ? this.eventTemplateFiltered[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('event_templete_id', this.selectedItem.id);
        }

    }

    public clean(): void {
        this.eventTemplate = [];
        this.eventTemplateFiltered = [];
        this.searchedCollection = [];
        this.selectIndex = -1;
        this.selectedItem = null;
        this.state = States.Empty;
    }
}
