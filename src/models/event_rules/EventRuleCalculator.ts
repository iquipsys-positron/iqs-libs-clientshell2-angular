import { EventRule, EventRuleType, EventRuleConditionParam } from '../../data';

export class EventRuleCalculator {

    private getLabelEntryEventRule(rule: EventRule): string {
        let result: string = '';

        return result;
    }

    private getLabelExitEventRule(rule: EventRule): string {
        let result: string = '';

        return result;
    }

    private getLabelPressedEventRule(rule: EventRule): string {
        let result: string = '';

        return result;
    }

    private getLabelLongPressedEventRule(rule: EventRule): string {
        let result: string = '';

        return result;
    }

    private getLabelMaxSpeedLimitEventRule(rule: EventRule): string {
        let result: string = 'EVENT_RULE_MAX_SPEED_LIMIT';

        return result;
    }

    private getLabelMinSpeedLimitEventRule(rule: EventRule): string {
        let result: string = 'EVENT_RULE_MIN_SPEED_LIMIT';

        return result;
    }

    private getLabelImmobilityEventRule(rule: EventRule): string {
        let result: string = 'EVENT_RULE_IMMOBILITY_DURATION';

        return result;
    }


    private getLabelPresenceEventRule(rule: EventRule): string {
        let result: string = 'EVENT_RULE_PRESENCE_DURATION';

        return result;
    }

    private getLabelShowUpEventRule(rule: EventRule): string {
        let result: string = 'EVENT_RULE_SHOWUP';

        return result;
    }

    private getLabelDisappearEventRule(rule: EventRule): string {
        let result: string = 'EVENT_RULE_DISAPPEAR';

        return result;
    }

    public getEventRuleConditionsLabel(rule: EventRule): string {
        // Apply object constraint

        switch (rule.type) {
            case EventRuleType.Entry:
                return this.getLabelEntryEventRule(rule);
            case EventRuleType.Exit:
                return this.getLabelExitEventRule(rule);
            case EventRuleType.ButtonPressed:
                return this.getLabelPressedEventRule(rule);
            case EventRuleType.ButtonLongPressed:
                return this.getLabelLongPressedEventRule(rule);
            case EventRuleType.MaxSpeed:
                return this.getLabelMaxSpeedLimitEventRule(rule);
            case EventRuleType.MinSpeed:
                return this.getLabelMinSpeedLimitEventRule(rule);                
            case EventRuleType.Immobility:
                return this.getLabelImmobilityEventRule(rule);
            case EventRuleType.Presence:
                return this.getLabelPresenceEventRule(rule);
            case EventRuleType.ShowUp:
                return this.getLabelShowUpEventRule(rule);
            case EventRuleType.Disappear:
                return this.getLabelDisappearEventRule(rule);
            default:
                return '';
        }
    }

    public getEventRuleConditionValue(rule: EventRule): any {
        // Apply object constraint

        switch (rule.type) {
            case EventRuleType.Entry:
                return null;
            case EventRuleType.Exit:
                return null;
            case EventRuleType.ButtonPressed:
                return null;
            case EventRuleType.ButtonLongPressed:
                return null;
            case EventRuleType.MaxSpeed:
                return rule.condition[EventRuleConditionParam.MaxValue] || null;
            case EventRuleType.MinSpeed:
                return rule.condition[EventRuleConditionParam.MinValue] || null;                
            case EventRuleType.Immobility:
                return rule.condition[EventRuleConditionParam.Duration] || null;
            case EventRuleType.Presence:
                return rule.condition[EventRuleConditionParam.Duration] || null;
            case EventRuleType.ShowUp:
                return null;
            case EventRuleType.Disappear:
                return null;
            default:
                return null;
        }
    }

    // set condition return error string 
    public setEventRuleCondition(rule: EventRule, value: any): string {
        let error: string = '';
        let conditionField: string = '';
        let numberValue: number;

        switch (rule.type) {
            case EventRuleType.Entry:
                break;
            case EventRuleType.Exit:
                break;
            case EventRuleType.ButtonPressed:
                break;
            case EventRuleType.ButtonLongPressed:
                break;
            case EventRuleType.MaxSpeed:
                numberValue = Number(value);
                conditionField = EventRuleConditionParam.MaxValue;
                break;
            case EventRuleType.MinSpeed:
                numberValue = Number(value);
                conditionField = EventRuleConditionParam.MinValue;
                break;
            case EventRuleType.Immobility:
                numberValue = Number(value);
                conditionField = EventRuleConditionParam.Duration;
                break;
            case EventRuleType.Presence:
                numberValue = Number(value);
                conditionField = EventRuleConditionParam.Duration;
                break;
            case EventRuleType.ShowUp:
                break;
            case EventRuleType.Disappear:
                break;
            default:
                break;
        }

        // reset old condition value
        rule.condition = {};
        // set new condition value
        if (conditionField && !error) {
            rule.condition[conditionField] = value;
        }

        return error;
    }

    
}

