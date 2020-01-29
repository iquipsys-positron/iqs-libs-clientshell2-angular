import { EventRule } from '../../data';


export interface IEventRulesViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];

    read(successCallback?: (data: EventRule[]) => void, errorCallback?: (error: any) => void);
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
