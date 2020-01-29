const actions = [
    {
        action: {name: 'global.emergency', icon: 'iqs:emergency', count: 0, event: 'iqsEmergencyPlan'},
        settings: ''
    },
    { name: 'global.incidents', icon: 'icons:bell', count: 0, event: 'iqsIncidentsOpen' },
    { name: 'global.help', icon: 'icons:help', count: 0, event: 'iqsGlobalHelp' },
    { name: 'global.signout', title: 'Sign out', state: 'signout' }
]

export class AppbarAction {
    public name: string;
    public icon?: string;
    public count?: number;
    public event?: string;
}

export class AppbarActionSettings {
    public menu: string;
    public breakpoints: any;
    
}

class AppbarItem {
    public action: AppbarAction;
    public settings: AppbarActionSettings;
}

export class AppbarActionsModel {
    
}