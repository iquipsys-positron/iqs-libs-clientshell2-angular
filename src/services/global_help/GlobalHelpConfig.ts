export class GlobalHelpConfigSection {
    title: string;
    src: any;
    text: string;
    state?: string;
    url?: string;
    stateParams?: any;
    stateName?: string;
}

export class GlobalHelpConfig {
    sections: GlobalHelpConfigSection[];
}

export const GLOBAL_HELP: GlobalHelpConfig = {
    sections: [
        {
            title: 'GLOBAL_HELP_SECTION_01',
            src: {
                ru: 'https://www.youtube.com/embed/Uu1WW0v8LGo?rel=0',
                en: 'https://www.youtube.com/embed/hSVQOt2ooRk?rel=0'
            },
            text: 'GLOBAL_HELP_TEXT_01',
            state: 'monitoring.map',
            url: '/monitoring/index.html#/app/map',
            stateName: 'GLOBAL_HELP_STATE_MONITORING'
        },
        {
            title: 'GLOBAL_HELP_SECTION_02',
            src: {
                ru: 'https://www.youtube.com/embed/AYnGtY-mlgI?rel=0',
                en: 'https://www.youtube.com/embed/IFgHpNiYD9Y?rel=0'
            },
            text: 'GLOBAL_HELP_TEXT_02',
            state: 'monitoring.map',
            url: '/monitoring/index.html#/app/map',
            stateName: 'GLOBAL_HELP_STATE_MONITORING'
        },
        {
            title: 'GLOBAL_HELP_SECTION_03',
            src: {
                ru: '',
                en: ''
            },
            text: 'GLOBAL_HELP_TEXT_03',
            state: 'monitoring.objects',
            url: '/monitoring/index.html#/app/objects',
            stateName: 'GLOBAL_HELP_STATE_MONITORING_OBJECT'
        },
        {
            title: 'GLOBAL_HELP_SECTION_04',
            src: {
                ru: 'https://www.youtube.com/embed/xA2DoLQSarI?rel=0',
                en: 'https://www.youtube.com/embed/xA2DoLQSarI?rel=0'
            },
            text: 'GLOBAL_HELP_TEXT_04',
            state: 'settings_system.rules',
            url: '/config_events/index.html#/event_rules',
            stateName: 'GLOBAL_HELP_EVENT_RULE'
        }
    ]
}
