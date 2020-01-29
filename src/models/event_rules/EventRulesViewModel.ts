import { EventRulesModel } from './EventRulesModel';
import { IEventRulesViewModel } from './IEventRulesViewModel';
import {
    IEventRulesDataService,
    EventRule
} from '../../data';
import {
    IAccountsViewModel,
    IObjectsViewModel,
    IObjectGroupsViewModel
} from '../../models';
import { IOrganizationService } from '../../services';

class EventRulesViewModel implements IEventRulesViewModel {
    private _filter: any;    
    private rulesModel: EventRulesModel;

    constructor(
        $log: ng.ILogService,
        $location: ng.ILocationService,
        $timeout: ng.ITimeoutService,
        pipTransaction: pip.services.ITransactionService,
        iqsOrganization: IOrganizationService,
        iqsEventRulesData: IEventRulesDataService,
        iqsObjectsViewModel: IObjectsViewModel,
        iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        iqsAccountsViewModel: IAccountsViewModel      
    ) {
        "ngInject";

        this._filter = null;
        this.rulesModel = new EventRulesModel($log, $location, $timeout, pipTransaction, iqsOrganization, iqsEventRulesData, 
            iqsObjectsViewModel, iqsObjectGroupsViewModel, iqsAccountsViewModel);
    }

    public read(successCallback?: (data: EventRule[]) => void, errorCallback?: (error: any) => void) {
                this.rulesModel.filter = this._filter;
        this.rulesModel.read(successCallback, errorCallback);
    }

    public reload(successCallback?: (data: EventRule[]) => void, errorCallback?: (error: any) => void): void {
        this.rulesModel.filter = this._filter;
        this.rulesModel.reload(successCallback, errorCallback);
    }

    public getCollection(localSearch?: string): EventRule[] {
        return this.rulesModel.get(localSearch);
    }

    public getTransaction(): pip.services.Transaction {
        return this.rulesModel.getTransaction();
    }

    public get isSort(): boolean {
        return this.rulesModel.isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this.rulesModel.isSort = value;
        }
    }

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get state(): string {
        return this.rulesModel.state;
    }

    public set state(value: string) {
        this.rulesModel.state = value;
    }

    public selectItem(index?: number) {
        this.rulesModel.selectItem(index);
    }

    public getSelectedItem(): EventRule {
        return this.rulesModel.getSelectedItem();
    }

    public get searchedCollection(): string[] {
        return this.rulesModel.getSearchedCollection();
    }

    public get selectedIndex(): number {
        return this.rulesModel.getSelectedIndex();
    }

    public set selectedIndex(index: number) {
        this.rulesModel.selectItem(index);
    }

    public removeItem(id: string) {
        this.rulesModel.remove(id);
    }

    public create(rule: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void {
        this.rulesModel.create(rule, successCallback, errorCallback);
    }

    public deleteEventRuleById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.rulesModel.delete(id, successCallback, errorCallback);
    }

    public updateEventRuleById(id: string, rule: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void {
        this.rulesModel.update(id, rule, successCallback, errorCallback);
    }  

    public getEventRuleById(ruleId: string): EventRule {
        return this.rulesModel.getEventRuleById(ruleId);
    }         

    public setObjectsDescriptions(rule: any): void {
        return this.rulesModel.setObjectsDescriptions(rule);
    }         

    public getEventRulesWithDescription(): EventRule[] {
        return this.rulesModel.getEventRulesWithDescription();
    }         

    public getEventRulesWithIncludeZone(zoneId: string): EventRule[] {
        return this.rulesModel.getEventRulesWithIncludeZone(zoneId);
    }         

    public getEventRulesWithExcludeZone(zoneId: string): EventRule[] {
        return this.rulesModel.getEventRulesWithExcludeZone(zoneId);
    }   

    public clean(): void {
        this.rulesModel.clean();
    }             
}

angular.module('iqsEventRules.ViewModel', ['iqsEventRules.Data', 'iqsAccounts.ViewModel', 'iqsObjects.ViewModel', 'iqsObjectGroups.ViewModel'])
    .service('iqsEventRulesViewModel', EventRulesViewModel);

import './EventRulesStrings';