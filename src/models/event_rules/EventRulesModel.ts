import { EventRule, DataPage, EventRuleConditionParam, ObjectGroup, ControlObject, Account } from '../../data';
import { IEventRulesDataService } from '../../data/event_rules/IEventRulesDataService';
import { States } from '../../common/States';
import { EventRuleCalculator } from './EventRuleCalculator';
import {
    IAccountsViewModel,
    IObjectsViewModel,
    IObjectGroupsViewModel
} from '../../models/';
import { IOrganizationService } from '../../services';

export class EventRulesModel {
    private _state: string;
    private _isSort: boolean;
    private _filter: any;

    private rules: EventRule[];
    private rulesFiltered: EventRule[];
    private searchedCollection: string[];
    private selectIndex: number;
    private selectedItem: EventRule;
    private transaction: pip.services.Transaction;
    private start: number = 0;
    private take: number = 100;
    private localSearch: string = null;
    private ruleCalculator: EventRuleCalculator;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService,
        private iqsEventRulesData: IEventRulesDataService,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        private iqsAccountsViewModel: IAccountsViewModel      
    ) {
        "ngInject";
        this.transaction = pipTransaction.create('RULES');
        this.rules = [];
        // this.rulesFiltered = [];
        this.searchedCollection = [];
        this.ruleCalculator = new EventRuleCalculator();
    }

    // private operation
    private updateItemInCollection(item: EventRule): void {
        let index: number = _.findIndex(this.rules, (ev) => {
            return ev.id == item.id;
        });
        this.prepareCondition(item);
        item.recipient_names = this.accountsToString(item.recipient_ids);
        // insert rule without sort
        if (index > -1) {
            let sortNeed: boolean = item.name != this.rules[index].name;
            this.rules[index] = item;
            if (this.isSort && sortNeed) {
                this.sortCollection(this.rules);
            }
            this.$location.search('rule_id', item.id)
            this.selectItem();
        } else {
            if (this._isSort) {
                index = _.findIndex(this.rules, (ev) => {
                    return ev.name.toLocaleLowerCase() > item.name.toLocaleLowerCase();
                });
                if (index > 0) {
                    this.rules.splice(index, 0, item);
                } else {
                    this.rules.push(item);
                }
            } else {
                this.rules.unshift(item);
            }

            this.localSearch = '';
            this.getFiltered(this.localSearch);
            this.$location.search('rule_id', item.id);
            this.selectItem();
        }

        this.collectionChanged();
    }

    private collectionChanged() {
        // this.$timeout(() => {
        this.setState();
        // }, 0);
        // send broadcast ???
    }

    private setState() {
        this.state = (this.rulesFiltered && this.rulesFiltered.length > 0) ? States.Data : States.Empty;
    }

    private prepareSearchedCollection() {
        this.searchedCollection = [];
        _.each(this.rules, (item: EventRule) => {
            this.searchedCollection.push(item.name.toLocaleLowerCase());
        });
    }

    private sortCollection(data: EventRule[]) {
        this.rules = _.sortBy(data, function (item: EventRule) {
            return item.name.toLocaleLowerCase();
        });
    }
    private onRead(data: EventRule[], callback?: (data: EventRule[]) => void): void {
        let index: number;

        if (data && data.length > 0) {
            if (this.isSort) {
                this.sortCollection(data);
            } else {
                this.rules = data;
            }
            index = _.findIndex(this.rules, (item: EventRule) => {
                return item.id == this.$location.search()['rule_id'];
            });
            index = index > -1 ? index : 0;
        } else {
            this.rules = [];
            this.searchedCollection = [];
            index = -1;
        }

        _.each(this.rules, (rule: EventRule) => {
            this.prepareCondition(rule);
            rule.recipient_names = this.accountsToString(rule.recipient_ids);
        });

        if (!this.localSearch) {
            this.rulesFiltered = this.rules;
        }


        this.prepareSearchedCollection();

        this.selectItem(index);
        this.transaction.end();

        if (callback) {
            callback(this.rules);
        }
        this.collectionChanged();
    }

    private getFiltered(localSearch?: string): EventRule[] {
        let filteredCollection: EventRule[] = [];
        let searchedCollection: EventRule[] = [];

        // not filtered, return all collection
        if (!localSearch) {
            this.localSearch = null;
            this.rulesFiltered = this.rules;
            this.selectItem();

            return this.rules;
        }
        filteredCollection = this.rules;

        if (localSearch && localSearch != this.localSearch) {
            let searchQuery = localSearch.toLowerCase();
            searchedCollection = _.filter(filteredCollection, (item: EventRule) => {
                return item.name.toLowerCase().indexOf(searchQuery) > -1;
            });

            this.localSearch = localSearch;
            this.rulesFiltered = searchedCollection;
            this.selectItem();
        }

        return this.rulesFiltered;
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

    private clearBeforSave(rule: EventRule): void {
        if (rule.condition) {
            delete rule.condition.conditionString;
            delete rule.condition.conditionName;
        }
    }

    // CRUD operation
    public read(successCallback?: (data: EventRule[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('RULES_READ');
        return this.iqsEventRulesData.readEventRules(this.getFilter(),
            (response: DataPage<EventRule>) => {
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

    public create(rule: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('EVENT_RULE_CREATE');
        this.clearBeforSave(rule);
        this.iqsEventRulesData.createEventRule(rule,
            (data: EventRule) => {
                this.state = States.Data;
                this.updateItemInCollection(data);
                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Create rule error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('EVENT_RULE_DELETE');
        let index: number;
        if (this.selectedItem && this.selectedItem.id == id) {
            index = this.selectIndex < this.rulesFiltered.length - 1 ? this.selectIndex : this.selectIndex - 1;
        } else {
            index = this.selectIndex;
        }

        this.iqsEventRulesData.deleteEventRule(id,
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
                this.$log.error('Delete rule error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }


    public update(id: string, rule: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('EVENT_RULE_UPDATE');
        this.clearBeforSave(rule);
        this.iqsEventRulesData.updateEventRule(id, rule,
            (data: EventRule) => {
                this.state = States.Data;
                this.updateItemInCollection(data);
                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Update rule error: ', JSON.stringify(error));
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
    public get(localSearch?: string): EventRule[] {
        let result = this.getFiltered(localSearch);
        this.setState();

        return result; //
    }

    public getSearchedCollection(): string[] {
        return this.searchedCollection;
    }

    public getSelectedIndex(): number {
        return this.selectIndex;
    }

    public getSelectedItem(): EventRule {
        return this.selectedItem;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public remove(id: string): void {
        _.remove(this.rules, { id: id });
        _.remove(this.rulesFiltered, { id: id });
        this.collectionChanged();
    }

    public reload(successCallback?: (data: EventRule[]) => void, errorCallback?: (error: any) => void) {
        this.rules = new Array();
        this.rulesFiltered = new Array();
        this.state = States.Progress;
        this.read(successCallback, errorCallback);
    }

    public selectItem(index?: number): void {
        let id: string = this.$location.search()['rule_id'];
        if (index === undefined || index === null || index < 0 || index > this.rulesFiltered.length - 1) {
            if (id) {
                index = _.findIndex(this.rulesFiltered, (item: EventRule) => {
                    return item.id == id;
                });
            }
            if (!index || index == -1) {
                index = 0;
            }
        }

        this.selectIndex = index;

        this.selectedItem = (this.rulesFiltered && this.rulesFiltered.length > 0) ? this.rulesFiltered[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('rule_id', this.selectedItem.id);
        }
    }

    public getEventRuleById(ruleId: string): EventRule {
        return _.find(this.rules, (rule: EventRule) => { return rule.id === ruleId; });
    }

    public prepareCondition(rule: EventRule): void {
        if (rule.condition && rule.condition[EventRuleConditionParam.MaxValue]) {
            rule.condition.conditionString = String(rule.condition[EventRuleConditionParam.MaxValue]);
            rule.condition.conditionName = this.ruleCalculator.getEventRuleConditionsLabel(rule);
        } else if (rule.condition && rule.condition[EventRuleConditionParam.MinValue]) {
            rule.condition.conditionString = String(rule.condition[EventRuleConditionParam.MinValue]);
            rule.condition.conditionName = this.ruleCalculator.getEventRuleConditionsLabel(rule);
        } else if (rule.condition && rule.condition[EventRuleConditionParam.Duration]) {
            rule.condition.conditionString = String(Math.floor(rule.condition[EventRuleConditionParam.Duration] / 60));
            rule.condition.conditionName = this.ruleCalculator.getEventRuleConditionsLabel(rule);
        }
    }

    public getEventRulesWithDescription(): EventRule[] {
        _.each(this.rules, (rule) => {
            this.setObjectsDescriptions(rule);
        });

        return this.rules;
    }

    private objectsToString(groups, objects): string {
        let result: string = '';

        if ((!groups || groups.length == 0) &&
            (!objects || objects.length == 0)) {

            return result;
        }
        _.each(groups, (id: string) => {
            let group: ObjectGroup = this.iqsObjectGroupsViewModel.getGroupById(id);
            if (group && group.name) {
                result += group.name + ', ';
            }
        });
        _.each(objects, (id: string) => {
            let obj: ControlObject = this.iqsObjectsViewModel.getObjectById(id);
            if (obj && obj.name) {
                result += obj.name + ', ';
            }
        });

        if (result) {
            result = result.slice(0, -2);
        }

        return result;
    }

    private accountsToString(ids: string[]): string {
        let result: string = '';

        if (!ids || ids.length == 0) {

            return result;
        }
        _.each(ids, (id: string) => {
            let item: Account = this.iqsAccountsViewModel.getAccountById(id);
            if (item && item.name) {
                result += item.name + ', ';
            }
        });


        if (result) {
            result = result.slice(0, -2);
        }

        return result;
    }

    public setObjectsDescriptions(rule: any): void {
        rule.includeObjectsDescription = this.objectsToString(rule.include_group_ids, rule.include_object_ids);
        rule.excludeObjectsDescription = this.objectsToString(rule.exclude_group_ids, rule.exclude_object_ids);
    }

    public getEventRulesWithIncludeZone(zoneId: string): EventRule[] {
        if (!zoneId) return [];

        return _.filter(this.rules, (rule: EventRule) => {
            return rule.include_zone_ids.indexOf(zoneId) > -1 || rule.all_zones && rule.exclude_zone_ids.indexOf(zoneId) == -1;
        }) || [];
    }

    public getEventRulesWithExcludeZone(zoneId: string): EventRule[] {
        if (!zoneId) return [];

        return _.filter(this.rules, (rule: EventRule) => {
            return rule.exclude_zone_ids.indexOf(zoneId) > -1;
        }) || [];
    }

    public clean(): void {
        this.rules = [];
        this.rulesFiltered = [];
        this.searchedCollection = [];
        this.selectIndex = -1;
        this.selectedItem = null;
        this.state = States.Empty;
    }
}
