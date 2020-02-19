import { EventEmitter } from '@angular/core';
import {
    Application,
    ControlObject,
    ControlObjectType,
    ControlObjectCategory,
    EmergencyPlan,
    EmergencyPlanActionType,
    Notification,
    ObjectGroup,
    ObjectState,
    Session,
    Organization,
    User,
    Zone,
    ZonePresence,
    UserRole
} from 'iqs-libs-clientshell2-angular';
import { cloneDeep } from 'lodash';
import * as moment_ from 'moment';

const moment = moment_;

interface UserOrganizations {
    user_id: string; organization_ids: string[];
}

export const MOCK_DATA_VERSION = 8;

export const onReset = new EventEmitter();

const usersDefault: User[] = [
    {
        id: '00000000000000000000000000000000',
        login: 'test',
        email: 'test@mail.com',
        name: 'Test user',
        password: 'A1b2c3',
        settings: {
            'menu_mode': 'favorites',
            'key1': 'value1',
            'key2': 'value2',
            'organization_id': '00000000000000000000000000000000',
            'favorites_00000000000000000000000000000000': '[\"mst_devices\", \"mst_sensor_interface\"]',
        },
        language: 'en',
        theme: 'pip-blue-theme'
    }
];
const organizationsDefault: Organization[] = [
    {
        id: '00000000000000000000000000000000',
        create_time: new Date(),
        creator_id: '00000000000000000000000000000000',
        active: true,
        name: 'Mock organization',
        code: 'MOx0001',
        description: 'First organization for mocking purposes',
        address: 'Tuscon, USA'
    },
    {
        id: '00000000000000000000000000000001',
        create_time: new Date(),
        creator_id: '00000000000000000000000000000000',
        active: true,
        name: 'Mock organization #2',
        code: 'FXMO_NI',
        description: 'This organization looks similar to first',
        address: 'Canberra, Australia'
    },
    {
        id: '00000000000000000000000000000002',
        create_time: new Date(),
        creator_id: '00000000000000000000000000000000',
        active: true,
        name: 'Mock organization #3',
        code: 'ms_the_third',
        description: 'Local copy of Google',
        address: 'Reykjavík, Iceland'
    },
    {
        id: '00000000000000000000000000000003',
        create_time: new Date(),
        creator_id: '00000000000000000000000000000000',
        active: true,
        name: 'Mock organization #4',
        code: 'IDDQD',
        description: 'Unseen University organization',
        address: 'Novosibirsk, Russia'
    },
];
const userOrganizationsDefault: UserOrganizations[] = [
    {
        user_id: '00000000000000000000000000000000',
        organization_ids: [
            '00000000000000000000000000000000',
            '00000000000000000000000000000001',
            '00000000000000000000000000000002'
        ]
    }
];
const applicationsDefault: Application[] = [{
    'name': {
        'ru': 'Наблюдение',
        'en': 'Monitoring'
    },
    'description': {
        'ru': 'Контроль текущей ситуации, просмотр событий, состояния и перемещения объектов на карте',
        'en': 'Monitoring the current situation, viewing events, status and moving objects on the map'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.user,
    'group': 'apps',
    'url': '/monitoring/index.html#',
    'icon': 'iqs:monitoring',
    'id': 'iqs_positron_monitoring'
},
{
    'name': {
        'ru': 'Ретроспектива',
        'en': 'Retrospective'
    },
    'description': {
        'ru': 'Анализ истории событий, прошлых состояний и перемещений на карте',
        'en': 'Analysis of the history of events, past states and movements on the map'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.user,
    'group': 'apps',
    'url': '/retrospective/index.html#',
    'icon': 'iqs:clock-back',
    'id': 'iqs_positron_retrospective'
},
{
    'name': {
        'ru': 'Пути следования',
        'en': 'Dot traces'
    },
    'description': {
        'ru': 'Анализ траекторий движения объектов',
        'en': 'Analysis of object trajectories'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.user,
    'group': 'apps',
    'url': '/dottraces/index.html#',
    'icon': 'iqs:path-1',
    'id': 'iqs_positron_dottraces'
},
{
    'name': {
        'ru': 'Расписание',
        'en': 'Schedule'
    },
    'description': {
        'ru': 'Планирование и учет рабочего времени, закрепление операторов за машинами и оборудованием',
        'en': 'Planning and time tracking, securing operators for machines and equipment'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'apps',
    'url': '/schedule/index.html#',
    'icon': 'iqs:schedule',
    'id': 'iqs_positron_schedule'
},
{
    'name': {
        'ru': 'Происшествия',
        'en': 'Incidents'
    },
    'description': {
        'ru': 'Просмотр и расследование происшествий',
        'en': 'View and investigate incidents'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.user,
    'group': 'apps',
    'url': '/incidents/index.html#',
    'icon': 'iqs:incident',
    'id': 'iqs_positron_incidents'
},
{
    'name': {
        'ru': 'Ручные коррекции',
        'en': 'Manual corrections'
    },
    'description': {
        'ru': 'Корректировка собранной статистики по объектам и группам',
        'en': 'Correcting the collected statistics for objects and groups'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'analytics',
    'url': '/manual_corrections/index.html#',
    'icon': 'webui-icons:note-take',
    'id': 'iqs_positron_manual_corrections'
},
{
    'name': {
        'ru': 'Пройденное расстояние',
        'en': 'Distance'
    },
    'description': {
        'ru': 'Анализ расстояния пройденного объектами',
        'en': 'Analysis of distance passed by objects'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.user,
    'group': 'analytics',
    'url': '/stats/index.html#/distance',
    'icon': 'iqs:metric',
    'id': 'iqs_positron_distance'
},
{
    'name': {
        'ru': 'Скорость движения',
        'en': 'Speed'
    },
    'description': {
        'ru': 'Анализ скорости движения объектов в различных зонах',
        'en': 'Analysis of the speed of movement of objects in various zones'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.user,
    'group': 'analytics',
    'url': '/stats/index.html#/speed',
    'icon': 'iqs:speedometer',
    'id': 'iqs_positron_speed'
},
{
    'name': {
        'ru': 'Неподвижность',
        'en': 'Immobility'
    },
    'description': {
        'ru': 'Анализ длительного нахождения объектов без движения',
        'en': 'Analysis of long-term staying of objects without movement'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.user,
    'group': 'analytics',
    'url': '/stats/index.html#/immobile',
    'icon': 'iqs:incident',
    'id': 'iqs_positron_immobility'
},
{
    'name': {
        'ru': 'Замирание',
        'en': 'Freezed'
    },
    'description': {
        'ru': 'Анализ отсутствия какой-либо активности объектов',
        'en': 'An analysis of the absence of any activity of objects'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.user,
    'group': 'analytics',
    'url': '/stats/index.html#/freezed',
    'icon': 'webui-icons:person-white',
    'id': 'iqs_positron_freeze'
},
{
    'name': {
        'ru': 'Время пребывания',
        'en': 'Presence time'
    },
    'description': {
        'ru': 'Анализ времени нахождения объектов в определенных зонах',
        'en': 'Analysis of the time of presence objects in certain zones'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.user,
    'group': 'analytics',
    'url': '/stats/index.html#/presence',
    'icon': 'webui-icons:clock-back',
    'id': 'iqs_positron_presence'
},
{
    'name': {
        'ru': 'Анализ событий',
        'en': 'Events'
    },
    'description': {
        'ru': 'Анализ прошлых событий по типам, объектам и зонам',
        'en': 'Analyzing past events by types, objects and zones'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.user,
    'group': 'analytics',
    'url': '/stats/index.html#/object_events',
    'icon': 'iqs:events',
    'id': 'iqs_positron_events'
},
{
    'name': {
        'ru': 'Профиль организации',
        'en': 'Organization profile'
    },
    'description': {
        'ru': 'Общая информация о площадке, местоположение и карты',
        'en': 'General information about the organization, location and map'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.org_admin,
    'group': 'administration',
    'url': '/config_organization/index.html#/organization',
    'icon': 'iqs:organization-profile',
    'id': 'iqs_positron_organization'
},
{
    'name': {
        'ru': 'Пользователи',
        'en': 'Accounts'
    },
    'description': {
        'ru': 'Управление правами доступа, приглашение новых пользователей',
        'en': 'Managing access rights, inviting new users'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.org_admin,
    'group': 'administration',
    'url': '/config_organization/index.html#/users',
    'icon': 'webui-icons:people',
    'id': 'iqs_positron_users'
},
{
    'name': {
        'ru': 'Трекеры',
        'en': 'Trackers'
    },
    'description': {
        'ru': 'Регистрация и настройка трекеров',
        'en': 'Registration and managing of trackers'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'administration',
    'url': '/config_devices/index.html#/devices',
    'icon': 'iqs:tracker',
    'id': 'iqs_positron_trackers'
},
{
    'name': {
        'ru': 'Маршрутизаторы',
        'en': 'Gateways'
    },
    'description': {
        'ru': 'Настройка LoRa маршрутизаторов',
        'en': 'Configuring LoRa gateways'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'administration',
    'url': '/config_devices/index.html#/gateways',
    'icon': 'icons:connections',
    'id': 'iqs_positron_gateways'
},
{
    'name': {
        'ru': 'Объекты контроля',
        'en': 'Objects'
    },
    'description': {
        'ru': 'Список контролируемых людей, машин и механизмов',
        'en': 'List of people, machines and mechanisms under control'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'config',
    'url': '/config_objects/index.html#/objects',
    'icon': 'iqs:object',
    'id': 'iqs_positron_objects'
},
{
    'name': {
        'ru': 'Группы объектов',
        'en': 'Groups'
    },
    'description': {
        'ru': 'Организация контроллируемых объектов в логические группы',
        'en': 'Organization of controlled objects in logical groups'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'config',
    'url': '/config_objects/index.html#/groups',
    'icon': 'iqs:team',
    'id': 'iqs_positron_object_groups'
},
{
    'name': {
        'ru': 'Места',
        'en': 'Locations'
    },
    'description': {
        'ru': 'Точки для быстрого перемещения по карте',
        'en': 'Points for fast navigation on the map'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'config',
    'url': '/config_zones/index.html#/locations',
    'icon': 'iqs:location-1',
    'id': 'iqs_positron_locations'
},
{
    'name': {
        'ru': 'Шаблоны событий',
        'en': 'Event templates'
    },
    'description': {
        'ru': 'Шаблоны для убыстрения ручной регистрации событий',
        'en': 'Templates for faster manual event logging'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'administration',
    'url': '/config_events/index.html#/events_templates',
    'icon': 'iqs:event-tmpl',
    'id': 'iqs_positron_event_templates'
},
{
    'name': {
        'ru': 'Шаблоны резолюций',
        'en': 'Resolutions'
    },
    'description': {
        'ru': 'Шаблонные резолюции для описания реакции на происшествия',
        'en': 'Resolution templates for describing reactions to incidents'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'administration',
    'url': '/config_events/index.html#/resolutions',
    'icon': 'iqs:incident-res',
    'id': 'iqs_positron_resolutions'
},
{
    'name': {
        'ru': 'Правила событий',
        'en': 'Rules'
    },
    'description': {
        'ru': 'Настройка правил для генерации событий в системе',
        'en': 'Setting rules for generating events in the system'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'config',
    'url': '/config_events/index.html#/event_rules',
    'icon': 'iqs:rules',
    'id': 'iqs_positron_rules'
},
{
    'name': {
        'ru': 'Зоны объектов',
        'en': 'Object zones'
    },
    'description': {
        'ru': 'Зоны ассоциированные с подвижными объектами',
        'en': 'Zones associated with mobile objects'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'config',
    'url': '/config_zones/index.html#/zone_objects',
    'icon': 'iqs:obj-zone',
    'id': 'iqs_positron_object_zones'
},
{
    'name': {
        'ru': 'Смены',
        'en': 'Shifts'
    },
    'description': {
        'ru': 'Настройка рассписания смен',
        'en': 'Setting the schedule shifts'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'administration',
    'url': '/config_organization/index.html#/shifts',
    'icon': 'iqs:schedule',
    'id': 'iqs_positron_shifts'
},
{
    'name': {
        'ru': 'Планы ЧС',
        'en': 'Emergency plans'
    },
    'description': {
        'ru': 'Планы действий при чрезвачайных ситуациях',
        'en': 'Action plans for emergency situations'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'administration',
    'url': '/config_emergency/index.html#',
    'icon': 'iqs:emergency',
    'id': 'iqs_positron_emergency'
},
{
    'name': {
        'ru': 'Гео-зоны',
        'en': 'Geo-zones'
    },
    'description': {
        'ru': 'Зоны с географической привязкой',
        'en': 'Geo-referenced arease'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'config',
    'url': '/config_zones/index.html#/zones',
    'icon': 'iqs:geo-zone',
    'id': 'iqs_admin_geo_zones'
},
{
    'name': {
        'ru': 'Параметры объектов',
        'en': 'Object params'
    },
    'description': {
        'ru': 'Сводная информация по параметрам',
        'en': 'Summary information by parameters'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'analytics',
    'url': '/stats/index.html#/object_params',
    'icon': 'iqs:params',
    'id': 'iqs_object_params'
},
{
    'name': {
        'ru': 'Маяки',
        'en': 'Beacons'
    },
    'description': {
        'ru': 'Настройка маяков',
        'en': 'Beacons settings'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'config',
    'url': '/config_devices/index.html#/beacons',
    'icon': 'iqs:beacon',
    'id': 'iqs_config_beacons'
},
{
    'name': {
        'ru': 'Использование',
        'en': 'Usage'
    },
    'description': {
        'ru': 'Анализ использования объектов',
        'en': 'Analysis of objects usage'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'analytics',
    'url': '/stats/index.html#/usage',
    'icon': 'iqs:stats',
    'id': 'iqs_positron_usage'
},
{
    'name': {
        'ru': 'Мониторинг данных',
        'en': 'Data monitoring'
    },
    'description': {
        'ru': 'Анализ данных во времени',
        'en': 'Analysis of data usage'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'apps',
    'url': '/datamonitoring/index.html',
    'icon': 'iqs:monitoring',
    'id': 'iqs_positron_datamonitoring'
}, {
    'name': {
        'ru': 'Профили устройств',
        'en': 'Data profiles'
    },
    'description': {
        'ru': 'Управление профилями устройств',
        'en': 'Device profiles'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.manager,
    'group': 'apps',
    'url': '/dataprofiles/index.html',
    'icon': 'webui-icons:person-white',
    'id': 'iqs_positron_dataprofiles'
}, {
    'name': {
        'ru': 'Руководства',
        'en': 'Guides'
    },
    'description': {
        'ru': 'Управление руководствами',
        'en': 'Guides management'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.org_admin,
    'group': 'management',
    'url': '/dataprofiles/index.html',
    'icon': 'webui-icons:help',
    'id': 'iqs_positron_guides'
}, {
    'name': {
        'ru': 'Логи',
        'en': 'Logs'
    },
    'description': {
        'ru': 'Информация о действиях',
        'en': 'System logs'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.org_admin,
    'group': 'management',
    'url': '/logging/index.html',
    'icon': 'webui-icons:progress',
    'id': 'iqs_positron_logging'
}, {
    'name': {
        'ru': 'Шаблоны сообщений',
        'en': 'Message templates'
    },
    'description': {
        'ru': 'Шаблоны сообщений',
        'en': 'Message templates'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.org_admin,
    'group': 'management',
    'url': '/msg_templates/index.html',
    'icon': 'webui-icons:config-all',
    'id': 'iqs_positron_msgtemplates'
}, {
    'name': {
        'ru': 'Пользователи',
        'en': 'Users'
    },
    'description': {
        'ru': 'Пользователи данной организации',
        'en': 'Users of current organization'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.org_admin,
    'group': 'management',
    'url': '/users/index.html',
    'icon': 'iqs:team',
    'id': 'iqs_positron_users2'
}, {
    'name': {
        'ru': 'Приложения',
        'en': 'Applications'
    },
    'description': {
        'ru': 'Управление микроприложениями',
        'en': 'Microapplications management'
    },
    'product': 'iQuipsys Positron',
    'role': UserRole.admin,
    'group': 'management',
    'url': '/applications/index.html',
    'icon': 'iqs:factory',
    'id': 'iqs_positron_applications'
}];
const notificationsDefault: Notification[] = [
    {
        label: 'High speed',
        object: {
            name: 'T101',
            type: 'Haul truck'
        },
        date: moment().subtract(15, 'm').toDate(),
        info: '55 km/h',
        icon: {
            name: 'error',
            color: 'error'
        }
    },
    {
        label: 'High speed',
        object: {
            name: 'T101',
            type: 'Haul truck'
        },
        date: moment().subtract(37, 'm').toDate(),
        info: '55 km/h',
        icon: {
            name: 'error',
            color: 'error'
        }
    },
    {
        label: 'High engine temperature',
        object: {
            name: 'T101',
            type: 'Haul truck'
        },
        date: moment().subtract(1, 'h').toDate(),
        info: '250 C'
    }
];
const emergencyPlansDefault: EmergencyPlan[] = [
    {
        'organization_id': '00000000000000000000000000000000',
        'name': 'Fire',
        'steps': [
            {
                'index': 1,
                'name': 'Call firefighters',
                'actions': [
                    {
                        'type': EmergencyPlanActionType.LocalLink,
                        'params': {
                            'page': 'ep_action_page_signals',
                            'text': 'Send signal description',
                            'pageTitle': 'EP_ACTION_PAGE_SEND_SIGNALS'
                        }
                    },
                    {
                        'type': EmergencyPlanActionType.LocalLink,
                        'params': {
                            'pageTitle': 'EP_ACTION_PAGE_PEOPLE',
                            'page': 'ep_action_page_map_people',
                            'text': ''
                        }
                    },
                    {
                        'type': EmergencyPlanActionType.CallPhone,
                        'params': {
                            'phone': '+380505679668'
                        }
                    },
                    {
                        'type': EmergencyPlanActionType.LocalLink,
                        'params': {
                            'pageTitle': 'EP_ACTION_PAGE_MAP',
                            'page': 'ep_action_page_map'
                        },
                    },
                    {
                        'type': EmergencyPlanActionType.LocalLink,
                        'params': {
                            'pageTitle': 'EP_ACTION_PAGE_LAST_EVENTS',
                            'page': 'ep_action_page_events'
                        },
                    }
                ]
            }
        ],
        'id': '00000000000000000000000000000000'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'name': 'Road accident',
        'steps': [
            {
                'index': 1,
                'name': 'Contact with accident participants',
                'actions': []
            },
            {
                'index': 2,
                'name': 'Ask how big is an accident',
                'actions': []
            },
            {
                'index': 3,
                'name': 'Call an ambulance',
                'actions': []
            },
            {
                'index': 4,
                'name': 'Contact with nearby workers',
                'actions': []
            }
        ],
        'id': '00000000000000000000000000000001'
    },
    {
        'name': 'Test',
        'organization_id': '00000000000000000000000000000001',
        'steps': [
            {
                'index': 1,
                'name': 'Call the police',
                'actions': []
            },
            {
                'name': 'Wait',
                'index': 2,
                'actions': []
            },
            {
                'name': 'Open the eyes',
                'index': 3,
                'actions': [
                    {
                        'type': EmergencyPlanActionType.Note,
                        'params': {
                            'text': 'Important thing'
                        }
                    }
                ]
            }
        ],
        'id': '00000000000000000000000000000003'
    }
];
const controlObjectsDefaullt: Partial<ControlObject>[] = [
    {
        'name': 'Esmeralda Villalobos',
        'description': 'Driver',
        'type': ControlObjectType.Employee,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.People,
        'device_id': '58974eb97b6948cb986b17e219314a31',
        'group_ids': [
            'd2ca097c76c94d61b20d96f96ee041af',
            'e892a72d6a2b4ca8899efb44a860f7d0',
            '561154dd93154c9eb307d1f0569a67db'
        ],
        'id': '6470351cad3a46f8b484a92d7dcacce1'
    },
    {
        'name': 'TK123',
        'description': 'Haul truck',
        'type': ControlObjectType.HaulTruck,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.Equipment,
        'device_id': 'afbdd036a6d449bf9fef99d73792b890',
        'group_ids': [
            '044d550bdc36426caf7f062c185c533e',
            'de56b3d20b50452cb5e440377819835f'
        ],
        'id': 'a84e8721a8174e7e9b69e011dceb4ba6'
    },
    {
        'category': ControlObjectCategory.People,
        'type': ControlObjectType.Employee,
        'name': 'Ani Sava',
        'organization_id': '00000000000000000000000000000000',
        'description': 'Ore control',
        'device_id': 'e67bfd966bd54310aa3870a1e6f76036',
        'perm_assign_id': null,
        'group_ids': [
            '561154dd93154c9eb307d1f0569a67db'
        ],
        'id': '841abccea54d47bd87b04195764a859b'
    },
    {
        'name': 'Marsellus Wallace',
        'description': 'MSHA Representative',
        'type': ControlObjectType.Employee,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.People,
        'device_id': '2c27a52a4b5c4dd99233e74040f9bd3f',
        'perm_assign_id': null,
        'group_ids': [
            '437976459733426d968dfe14790f6dbf'
        ],
        'id': '0fbeda21195e46fbbc24f8e5a9bd739f'
    },
    {
        'name': 'Susan Griffiths',
        'description': 'Project Manager',
        'type': ControlObjectType.Employee,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.People,
        'device_id': '882e20812e0b4826810c85a7533dca51',
        'group_ids': [
            '437976459733426d968dfe14790f6dbf'
        ],
        'id': 'e04e5192d2714c88a41a3755a9626209'
    },
    {
        'category': ControlObjectCategory.People,
        'type': ControlObjectType.Employee,
        'name': 'Harvey Keitel',
        'organization_id': '00000000000000000000000000000000',
        'description': 'Driver',
        'device_id': '6c3fe909a3cf4ad8a58c0a56a2102683',
        'group_ids': [
            'e892a72d6a2b4ca8899efb44a860f7d0',
            '437976459733426d968dfe14790f6dbf'
        ],
        'id': 'b65b292a886949db8ca9bc72f3fbe68f'
    },
    {
        'category': ControlObjectCategory.Equipment,
        'type': ControlObjectType.HaulTruck,
        'name': 'TK124',
        'description': 'Haul truck',
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'af5d132786364812ab80fb785d113a65',
        'group_ids': [
            '044d550bdc36426caf7f062c185c533e',
            'de56b3d20b50452cb5e440377819835f'
        ],
        'id': '95f8d418ee48467c82d1c412d7be7664'
    },
    {
        'name': 'Tim Roth',
        'description': 'shift supervisor',
        'type': ControlObjectType.Employee,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.People,
        'device_id': '892e33e05c4b48a696025d64a7f5cf4b',
        'perm_assign_id': '4eef83ee351740699ce79639a4ae92a8',
        'group_ids': [
            'e892a72d6a2b4ca8899efb44a860f7d0'
        ],
        'id': '43118a2fb2d64ffe8b87c4703e9464e1'
    },
    {
        'category': ControlObjectCategory.Equipment,
        'type': ControlObjectType.LightVehicle,
        'name': 'Toyota H12',
        'description': 'Supervisor Vehicle',
        'organization_id': '00000000000000000000000000000000',
        'device_id': '053a18a5a24a47d4b14392b75de4e0ea',
        'group_ids': [
            '896ba1e245a248ccb52aaae57d522374'
        ],
        'id': '4eef83ee351740699ce79639a4ae92a8'
    },
    {
        'name': 'Vincent Vega',
        'description': 'Geologist',
        'type': ControlObjectType.Employee,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.People,
        'device_id': '24525ee90a9a4b22a16359d872916e1b',
        'perm_assign_id': '4eef83ee351740699ce79639a4ae92a8',
        'group_ids': [
            '5cc46f1f9705494d8184eab112ce2980',
            'd0c7726c6d8b40cb8b29ba67b0a89b37'
        ],
        'id': 'd54d3d8559394bbda644227ec9481b91'
    },
    {
        'category': ControlObjectCategory.Equipment,
        'type': ControlObjectType.Bus,
        'name': 'Van 103',
        'description': 'Crew Van',
        'organization_id': '00000000000000000000000000000000',
        'device_id': '423a9863a94d42e593f912269d9c31a5',
        'group_ids': [
            '896ba1e245a248ccb52aaae57d522374'
        ],
        'id': '1bab7b4b9109441e8ad6a9d58bf8ee29'
    },
    {
        'name': 'JCB 3CX',
        'description': 'Backhoe',
        'type': ControlObjectType.Excavator,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.Equipment,
        'device_id': null,
        'group_ids': [
            '4dfb98d581a34d5e9cc5887335ddcc1b',
            '5cc46f1f9705494d8184eab112ce2980'
        ],
        'id': '7a956331bcce4bf48371984f8c187929'
    },
    {
        'category': ControlObjectCategory.Equipment,
        'type': ControlObjectType.Dozer,
        'name': 'CAT D10-26',
        'description': 'track dozer',
        'organization_id': '00000000000000000000000000000000',
        'device_id': '48b0caa2b98b4d13aef9b67f5bd23c66',
        'group_ids': [
            '28417b77fae741d59fcfd8933f6af461'
        ],
        'id': '1e4d7d227ca54d49a95b705e764ab4b4'
    },
    {
        'category': ControlObjectCategory.Equipment,
        'type': ControlObjectType.Excavator,
        'name': 'EX05',
        'description': 'Shovel',
        'organization_id': '00000000000000000000000000000000',
        'device_id': '547b9d5b475842afac780edc25b7a723',
        'group_ids': [
            '4dfb98d581a34d5e9cc5887335ddcc1b'
        ],
        'id': '7fd8fb30b9e44f2da9192b1e4a21ecf0'
    },
    {
        'category': ControlObjectCategory.Asset,
        'type': ControlObjectType.Generator,
        'name': 'APG3014-1',
        'organization_id': '00000000000000000000000000000000',
        'description': 'Power Generator',
        'device_id': '8477b12c42a64707b5b0cc19885a00e5',
        'group_ids': [
            '5cc46f1f9705494d8184eab112ce2980'
        ],
        'id': '2ff6d17cec174c0eafc81d6cdad95630'
    },
    {
        'name': 'Jerry Lewis',
        'description': 'Lab Tech',
        'type': ControlObjectType.Employee,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.People,
        'device_id': '35e47c0a1f594d47960d3bddb0185020',
        'group_ids': [
            'd2ca097c76c94d61b20d96f96ee041af',
            'd0c7726c6d8b40cb8b29ba67b0a89b37'
        ],
        'id': 'a37ba2449acd4cf6b3a5eccff65f0f5d'
    },
    {
        'name': 'Crane 13',
        'category': ControlObjectCategory.Asset,
        'organization_id': '00000000000000000000000000000000',
        'description': 'UNIC mini crane',
        'type': ControlObjectType.Crane,
        'device_id': 'e0a31d48021e492c8c7d45b17ac36175',
        'group_ids': [],
        'id': '60256da4ba014328ade33005b4687736'
    },
    {
        'category': ControlObjectCategory.Equipment,
        'type': ControlObjectType.Bus,
        'name': 'Van 102',
        'description': 'Crew Van',
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'ae0f537f46be4b80b44d659062473a7a',
        'group_ids': [
            '896ba1e245a248ccb52aaae57d522374'
        ],
        'id': '6348633470884f04aeb59122472d8c06'
    },
    {
        'name': 'Butch Coolidge',
        'description': 'Driver',
        'type': ControlObjectType.Employee,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.People,
        'device_id': '488ff4239c8b440081e616ad5599e34d',
        'perm_assign_id': '163e0427ff294aca9b053a61414842a0',
        'group_ids': [
            'e892a72d6a2b4ca8899efb44a860f7d0'
        ],
        'id': 'b2dab7d007c14b20ba56f0353db786bc'
    },
    {
        'name': 'Karen Maruyama',
        'description': 'Environmental control',
        'type': ControlObjectType.Employee,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.People,
        'device_id': '20510ba1b168452cb18603780771feea',
        'group_ids': [
            'd2ca097c76c94d61b20d96f96ee041af',
            'd0c7726c6d8b40cb8b29ba67b0a89b37'
        ],
        'id': '7322a1eabe604efe873ac0c461e7265a'
    },
    {
        'category': ControlObjectCategory.Equipment,
        'type': ControlObjectType.HaulTruck,
        'name': 'TK125',
        'description': 'Haul truck',
        'organization_id': '00000000000000000000000000000000',
        'device_id': '70b05b8f091e44159f64aef2edeee200',
        'group_ids': [
            '044d550bdc36426caf7f062c185c533e',
            'de56b3d20b50452cb5e440377819835f'
        ],
        'id': '45c29d02316e4320a036edd931f26673'
    },
    {
        'name': 'Jules Winnfield',
        'description': 'Blasting QA',
        'type': ControlObjectType.Employee,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.People,
        'device_id': 'a889326f2b6b48bbbea388dfdeb7245b',
        'group_ids': [
            '561154dd93154c9eb307d1f0569a67db'
        ],
        'id': '6fb41f9479024da79b9f76a2daba053c'
    },
    {
        'name': 'James Dean',
        'description': 'Quality supervisor',
        'type': ControlObjectType.Employee,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.People,
        'device_id': 'ff65253d71fc4e278d9e89013095c927',
        'group_ids': [
            'e892a72d6a2b4ca8899efb44a860f7d0',
            '561154dd93154c9eb307d1f0569a67db'
        ],
        'id': 'e17172ad05d448d18450aca6f6fff653'
    },
    {
        'category': ControlObjectCategory.Equipment,
        'type': ControlObjectType.HaulTruck,
        'name': 'TK127',
        'description': 'Haul truck',
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'be12687fb1ac456d8dd7db21a2f39f7b',
        'group_ids': [
            '044d550bdc36426caf7f062c185c533e',
            'de56b3d20b50452cb5e440377819835f'
        ],
        'id': '328e0c25d6b34d5bb1f21747f7ead395'
    },
    {
        'name': 'Dressta TD-25',
        'description': 'track dozer',
        'type': ControlObjectType.Dozer,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.Equipment,
        'device_id': '4c5af465898140298c536dabd25c5272',
        'group_ids': [
            '28417b77fae741d59fcfd8933f6af461'
        ],
        'id': 'dfc175a4d12c47fda8684b7a762e91e0'
    },
    {
        'category': ControlObjectCategory.Equipment,
        'type': ControlObjectType.Grader,
        'description': 'Grader',
        'name': 'GR-10',
        'organization_id': '00000000000000000000000000000000',
        'device_id': '78e6029d02ac4a68b85385492c1ca87e',
        'group_ids': [],
        'id': 'dece51d9502a4cce81e767a83eedced5'
    },
    {
        'name': 'Ed Sullivan',
        'description': 'MSHA Admin',
        'type': ControlObjectType.Employee,
        'organization_id': '00000000000000000000000000000000',
        'category': ControlObjectCategory.People,
        'device_id': 'ae3d9375bb324bd6a9e6ee7b3090b840',
        'group_ids': [
            '437976459733426d968dfe14790f6dbf'
        ],
        'id': '362d4e9ab5164032887ca3a43ba01c5f'
    },
    {
        'category': ControlObjectCategory.Equipment,
        'type': ControlObjectType.Excavator,
        'name': 'EX02',
        'description': 'Shovel',
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'cd14aa82932a4b5db3b643459314de2e',
        'group_ids': [
            '4dfb98d581a34d5e9cc5887335ddcc1b'
        ],
        'id': '36929eb1ee404aaa9de3114033c51386'
    },
    {
        'category': ControlObjectCategory.Equipment,
        'type': ControlObjectType.Grader,
        'name': 'GR-08',
        'description': 'Grader',
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'dafdca329983483ebe8109a708500090',
        'group_ids': [],
        'id': '163e0427ff294aca9b053a61414842a0'
    },
    {
        'type': ControlObjectType.Employee,
        'category': ControlObjectCategory.People,
        'name': 'ууу',
        'description': 'уу',
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'a5fe4b9884f9424493e36f2808eca6c8',
        'group_ids': [],
        'id': '8d85e5b1e04a4907af634cad194fa311'
    },
    {
        'type': ControlObjectType.Employee,
        'category': ControlObjectCategory.People,
        'name': 'sdf',
        'description': 'w',
        'organization_id': '00000000000000000000000000000000',
        'device_id': '697bf7d8c50f49fcbf590034eeca7498',
        'group_ids': [],
        'id': '3a25d450730a4c108375f117dc60b32f'
    }
];
const objectGroupsDefault: Partial<ObjectGroup>[] = [
    {
        'name': 'Quality control',
        'organization_id': '00000000000000000000000000000000',
        'object_ids': [
            '841abccea54d47bd87b04195764a859b',
            '6470351cad3a46f8b484a92d7dcacce1',
            'e17172ad05d448d18450aca6f6fff653',
            '6fb41f9479024da79b9f76a2daba053c'
        ],
        'id': '561154dd93154c9eb307d1f0569a67db'
    },
    {
        'name': 'Ancillary workers',
        'organization_id': '00000000000000000000000000000000',
        'object_ids': [
            '6470351cad3a46f8b484a92d7dcacce1',
            'a37ba2449acd4cf6b3a5eccff65f0f5d',
            '7322a1eabe604efe873ac0c461e7265a'
        ],
        'id': 'd2ca097c76c94d61b20d96f96ee041af'
    },
    {
        'name': 'Special equipment',
        'organization_id': '00000000000000000000000000000000',
        'object_ids': [
            '7a956331bcce4bf48371984f8c187929',
            'd54d3d8559394bbda644227ec9481b91',
            '2ff6d17cec174c0eafc81d6cdad95630'
        ],
        'id': '5cc46f1f9705494d8184eab112ce2980'
    },
    {
        'name': 'Haul trucks',
        'organization_id': '00000000000000000000000000000000',
        'object_ids': [
            'a84e8721a8174e7e9b69e011dceb4ba6',
            '95f8d418ee48467c82d1c412d7be7664',
            '45c29d02316e4320a036edd931f26673',
            '328e0c25d6b34d5bb1f21747f7ead395'
        ],
        'id': '044d550bdc36426caf7f062c185c533e'
    },
    {
        'name': 'Excavators',
        'organization_id': '00000000000000000000000000000000',
        'object_ids': [
            '7a956331bcce4bf48371984f8c187929',
            '36929eb1ee404aaa9de3114033c51386',
            '7fd8fb30b9e44f2da9192b1e4a21ecf0'
        ],
        'id': '4dfb98d581a34d5e9cc5887335ddcc1b'
    },
    {
        'name': 'Машины',
        'organization_id': '00000000000000000000000000000000',
        'object_ids': [
            '4eef83ee351740699ce79639a4ae92a8',
            '6348633470884f04aeb59122472d8c06',
            '1bab7b4b9109441e8ad6a9d58bf8ee29'
        ],
        'id': '896ba1e245a248ccb52aaae57d522374'
    },
    {
        'name': 'Environmental control',
        'organization_id': '00000000000000000000000000000000',
        'object_ids': [
            '7322a1eabe604efe873ac0c461e7265a',
            'a37ba2449acd4cf6b3a5eccff65f0f5d',
            'd54d3d8559394bbda644227ec9481b91'
        ],
        'id': 'd0c7726c6d8b40cb8b29ba67b0a89b37'
    },
    {
        'name': 'MSHA',
        'organization_id': '00000000000000000000000000000000',
        'object_ids': [
            '362d4e9ab5164032887ca3a43ba01c5f',
            'b65b292a886949db8ca9bc72f3fbe68f',
            '0fbeda21195e46fbbc24f8e5a9bd739f',
            'e04e5192d2714c88a41a3755a9626209'
        ],
        'id': '437976459733426d968dfe14790f6dbf'
    },
    {
        'name': 'Drivers',
        'organization_id': '00000000000000000000000000000000',
        'object_ids': [
            'e17172ad05d448d18450aca6f6fff653',
            '6470351cad3a46f8b484a92d7dcacce1',
            'b65b292a886949db8ca9bc72f3fbe68f',
            '43118a2fb2d64ffe8b87c4703e9464e1',
            'b2dab7d007c14b20ba56f0353db786bc'
        ],
        'id': 'e892a72d6a2b4ca8899efb44a860f7d0'
    },
    {
        'name': 'Dozers',
        'organization_id': '00000000000000000000000000000000',
        'object_ids': [
            'dfc175a4d12c47fda8684b7a762e91e0',
            '1e4d7d227ca54d49a95b705e764ab4b4'
        ],
        'id': '28417b77fae741d59fcfd8933f6af461'
    },
    {
        'name': 'Самосвалы',
        'organization_id': '00000000000000000000000000000000',
        'object_ids': [
            'a84e8721a8174e7e9b69e011dceb4ba6',
            '95f8d418ee48467c82d1c412d7be7664',
            '45c29d02316e4320a036edd931f26673',
            '328e0c25d6b34d5bb1f21747f7ead395'
        ],
        'id': 'de56b3d20b50452cb5e440377819835f'
    }
];
const zonesDefault: Partial<Zone>[] = [
    {
        'name': 'Workshop to Power plant road',
        'type': 'line',
        'geometry': {
            'type': 'LineString',
            'coordinates': [
                [
                    30.662047863006592,
                    64.66115236426374
                ],
                [
                    30.66200762987137,
                    64.66121176838622
                ],
                [
                    30.662037134170532,
                    64.66125510174612
                ],
                [
                    30.66235899925232,
                    64.66128207744516
                ],
                [
                    30.66258430480957,
                    64.6613084791672
                ],
                [
                    30.662670470774174,
                    64.66137577474471
                ],
                [
                    30.66266007721424,
                    64.66146602803967
                ],
                [
                    30.662650018930435,
                    64.66173606869664
                ],
                [
                    30.662629902362823,
                    64.66223022753003
                ],
                [
                    30.662675499916077,
                    64.66321851819467
                ],
                [
                    30.662697292864323,
                    64.66436787374981
                ],
                [
                    30.662815645337105,
                    64.66450716615805
                ],
                [
                    30.663175731897354,
                    64.6647421341693
                ],
                [
                    30.66358644515276,
                    64.6649456985364
                ],
                [
                    30.6640937179327,
                    64.66512171565245
                ],
                [
                    30.665076076984406,
                    64.66550129182413
                ],
                [
                    30.66641852259636,
                    64.66600334425789
                ],
                [
                    30.667782425880432,
                    64.66651456884209
                ],
                [
                    30.668600499629974,
                    64.66682207364308
                ],
                [
                    30.669418573379517,
                    64.66713875618925
                ],
                [
                    30.671011805534363,
                    64.6677262050739
                ],
                [
                    30.672519207000732,
                    64.6682997265334
                ],
                [
                    30.674031972885132,
                    64.6688663503828
                ],
                [
                    30.676006078720093,
                    64.66959103786164
                ],
                [
                    30.677905082702637,
                    64.67031111589927
                ],
                [
                    30.677824281156063,
                    64.67050418536576
                ],
                [
                    30.677357241511345,
                    64.67076380855872
                ],
                [
                    30.676058381795883,
                    64.67130599704579
                ],
                [
                    30.67502774298191,
                    64.67163245239853
                ],
                [
                    30.6739541888237,
                    64.67192218540404
                ],
                [
                    30.672510489821434,
                    64.67227961413401
                ],
                [
                    30.67100241780281,
                    64.67268752463292
                ],
                [
                    30.66807210445404,
                    64.67348496906617
                ],
                [
                    30.665749311447144,
                    64.67465527670521
                ],
                [
                    30.664907097816467,
                    64.67497538146769
                ],
                [
                    30.66358208656311,
                    64.67512109098611
                ],
                [
                    30.662262439727783,
                    64.67518304597714
                ],
                [
                    30.66006302833557,
                    64.67513944803524
                ],
                [
                    30.65863609313965,
                    64.67490310007744
                ],
                [
                    30.65788507461548,
                    64.67460479388872
                ],
                [
                    30.656790733337402,
                    64.67429730561308
                ],
                [
                    30.65668017603457,
                    64.67421100318145
                ],
                [
                    30.656827110797167,
                    64.6741614159101
                ],
                [
                    30.65764669328928,
                    64.67429171227728
                ],
                [
                    30.657826736569405,
                    64.67427235072134
                ],
                [
                    30.657961517572403,
                    64.67401792424971
                ],
                [
                    30.658471807837486,
                    64.67396543235817
                ],
                [
                    30.658896267414093,
                    64.67401390848016
                ],
                [
                    30.659049153327942,
                    64.67395080345223
                ],
                [
                    30.659226179122925,
                    64.67378787706463
                ],
                [
                    30.66007375717163,
                    64.67392097193331
                ],
                [
                    30.660696029663086,
                    64.6738750772248
                ]
            ]
        },
        'distance': 2,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.667292629368603,
                64.66816770512044
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.65668017603457,
                        64.66115236426374
                    ],
                    [
                        30.677905082702637,
                        64.67518304597714
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': '7fa504f7b9034d979c27697f0520fdde'
    },
    {
        'distance': 171.35837965261078,
        'name': 'East dump zone',
        'type': 'circle',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.69097280502319,
                        64.69835380599969
                    ],
                    [
                        30.693092221198444,
                        64.69805947402303
                    ],
                    [
                        30.694401994877204,
                        64.69728891805146
                    ],
                    [
                        30.694401874304816,
                        64.69633648878231
                    ],
                    [
                        30.69309202610822,
                        64.69556598182211
                    ],
                    [
                        30.69097280502319,
                        64.69527168013617
                    ],
                    [
                        30.688853583938165,
                        64.69556598182211
                    ],
                    [
                        30.68754373574157,
                        64.69633648878231
                    ],
                    [
                        30.687543615169183,
                        64.69728891805146
                    ],
                    [
                        30.688853388847942,
                        64.69805947402303
                    ]
                ]
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.687543615169183,
                        64.69527168013617
                    ],
                    [
                        30.694401994877204,
                        64.69835380599969
                    ]
                ]
            ]
        },
        'center': {
            'type': 'Point',
            'coordinates': [
                30.690972805023193,
                64.69681274306794
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': 'caef7aeb8b80489aa1f0aab8644f58d2'
    },
    {
        'name': 'Excavator zone',
        'organization_id': '00000000000000000000000000000000',
        'type': 'object',
        'distance': 12,
        'geometry': null,
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [
            '4dfb98d581a34d5e9cc5887335ddcc1b'
        ],
        'include_object_ids': [],
        'id': '338c32dee6a04c468a479330ad1d7acf'
    },
    {
        'name': 'West dump zone',
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.617269847109355,
                        64.68925295896192
                    ],
                    [
                        30.61662611694578,
                        64.68881261569415
                    ],
                    [
                        30.61443743438963,
                        64.68846400553218
                    ],
                    [
                        30.613364550783672,
                        64.68870252875908
                    ],
                    [
                        30.612291667177715,
                        64.68831722096436
                    ],
                    [
                        30.610231730654277,
                        64.68857409343626
                    ],
                    [
                        30.608858439638652,
                        64.68881261569415
                    ],
                    [
                        30.607313487246074,
                        64.68851904954013
                    ],
                    [
                        30.60662684173826,
                        64.68771172621746
                    ],
                    [
                        30.60714182586912,
                        64.68743649685993
                    ],
                    [
                        30.608214709475078,
                        64.68741814813671
                    ],
                    [
                        30.60941633911375,
                        64.68727135790367
                    ],
                    [
                        30.610789630129375,
                        64.68727135790367
                    ],
                    [
                        30.612162921145,
                        64.68695942601829
                    ],
                    [
                        30.61212000580076,
                        64.68642729863284
                    ],
                    [
                        30.613536212160625,
                        64.68613370663712
                    ],
                    [
                        30.614051196291484,
                        64.68699612407352
                    ],
                    [
                        30.615596148684062,
                        64.68710621794102
                    ],
                    [
                        30.61593947143797,
                        64.68756493757466
                    ],
                    [
                        30.61692652435545,
                        64.68743649685993
                    ],
                    [
                        30.61615404815916,
                        64.6876933776806
                    ],
                    [
                        30.61714110107664,
                        64.68806034605741
                    ],
                    [
                        30.61838564605955,
                        64.68820713201669
                    ]
                ]
            ]
        },
        'distance': null,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.612506243898906,
                64.68769333279951
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.60662684173826,
                        64.68613370663712
                    ],
                    [
                        30.61838564605955,
                        64.68925295896192
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': '9f88b6307a3645f597bc4e48f7758ee1'
    },
    {
        'name': 'Workshop',
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.655181407928467,
                        64.6740953711172
                    ],
                    [
                        30.655460357666016,
                        64.67396686656413
                    ],
                    [
                        30.656286478042603,
                        64.67395768764426
                    ],
                    [
                        30.657048225402832,
                        64.6741366760228
                    ],
                    [
                        30.657455921173096,
                        64.67431566321994
                    ],
                    [
                        30.65807819366455,
                        64.67442580860015
                    ],
                    [
                        30.658979415893555,
                        64.6746919914218
                    ],
                    [
                        30.660781860351562,
                        64.67504077874996
                    ],
                    [
                        30.661897659301758,
                        64.67500406450563
                    ],
                    [
                        30.66260576248169,
                        64.6749673502116
                    ],
                    [
                        30.664268732070923,
                        64.67492145727417
                    ],
                    [
                        30.664730072021484,
                        64.67450841734168
                    ],
                    [
                        30.666017532348633,
                        64.67432484201872
                    ],
                    [
                        30.66730499267578,
                        64.6729847045083
                    ],
                    [
                        30.661425590515137,
                        64.67232379039147
                    ],
                    [
                        30.658464431762695,
                        64.67190153127245
                    ],
                    [
                        30.655717849731445,
                        64.67186481277746
                    ],
                    [
                        30.65312147140503,
                        64.67210348210622
                    ],
                    [
                        30.65256357192993,
                        64.67294798747999
                    ],
                    [
                        30.65112590789795,
                        64.67311780331929
                    ],
                    [
                        30.650428533554077,
                        64.67354233826501
                    ]
                ]
            ]
        },
        'distance': null,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.65886676311493,
                64.67345279576371
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.650428533554077,
                        64.67186481277746
                    ],
                    [
                        30.66730499267578,
                        64.67504077874996
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': 'd290e04542364648b058e252baebb4cf'
    },
    {
        'name': 'Truckshop',
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.70901870727539,
                        64.65894599729246
                    ],
                    [
                        30.717945098876953,
                        64.65789900076989
                    ],
                    [
                        30.718116760253906,
                        64.65745814804264
                    ],
                    [
                        30.720863342285156,
                        64.65703565745808
                    ],
                    [
                        30.720949172973633,
                        64.65637435464181
                    ],
                    [
                        30.72498321533203,
                        64.65637435464181
                    ],
                    [
                        30.72498321533203,
                        64.65518029484997
                    ],
                    [
                        30.723609924316406,
                        64.65516192428896
                    ],
                    [
                        30.723652839660645,
                        64.65407803917863
                    ],
                    [
                        30.7177734375,
                        64.65400455387544
                    ],
                    [
                        30.7177734375,
                        64.65336154898506
                    ],
                    [
                        30.711336135864258,
                        64.6534350360293
                    ],
                    [
                        30.711164474487305,
                        64.6549598472971
                    ],
                    [
                        30.707902908325195,
                        64.65642946382535
                    ],
                    [
                        30.709362030029297,
                        64.65769694415896
                    ]
                ]
            ]
        },
        'distance': null,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.716443061828613,
                64.65615377313875
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.707902908325195,
                        64.65336154898506
                    ],
                    [
                        30.72498321533203,
                        64.65894599729246
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': 'a831914ad5a646938194939c60b3c633'
    },
    {
        'name': 'Work zone  3',
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.68977117538452,
                        64.68107959526189
                    ],
                    [
                        30.69005012512207,
                        64.68132735991522
                    ],
                    [
                        30.68882703781128,
                        64.68185958743891
                    ],
                    [
                        30.685222148895264,
                        64.68196052596274
                    ],
                    [
                        30.68129539489746,
                        64.68193299731169
                    ],
                    [
                        30.6817889213562,
                        64.68163018030496
                    ],
                    [
                        30.682475566864014,
                        64.68141912402693
                    ]
                ]
            ]
        },
        'distance': null,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.685672760009766,
                64.68152006061231
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.68129539489746,
                        64.68107959526189
                    ],
                    [
                        30.69005012512207,
                        64.68196052596274
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': '0ad7195fef7d4c64a8137f0d577460d6'
    },
    {
        'name': 'Powerplant',
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.659708976745605,
                        64.66245405957979
                    ],
                    [
                        30.6723690032959,
                        64.66249079081669
                    ],
                    [
                        30.67230463027954,
                        64.66094803604756
                    ],
                    [
                        30.6723690032959,
                        64.65933172266986
                    ],
                    [
                        30.65983772277832,
                        64.65923988379164
                    ]
                ]
            ]
        },
        'distance': null,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.666038990020752,
                64.66086533730416
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.659708976745605,
                        64.65923988379164
                    ],
                    [
                        30.6723690032959,
                        64.66249079081669
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': 'ae5a413ec4d04782bfeee2bfa0af07ff'
    },
    {
        'name': 'Power plant to Truck shop road',
        'type': 'line',
        'geometry': {
            'type': 'LineString',
            'coordinates': [
                [
                    30.661983489990234,
                    64.66122353440471
                ],
                [
                    30.662455558776855,
                    64.66128322534674
                ],
                [
                    30.662670135498047,
                    64.66133373296432
                ],
                [
                    30.662691593170166,
                    64.66148525525294
                ],
                [
                    30.662702322006226,
                    64.66271347287578
                ],
                [
                    30.664520859718323,
                    64.66272609912335
                ],
                [
                    30.668316185474396,
                    64.66272782088393
                ],
                [
                    30.67052498459816,
                    64.66273786448511
                ],
                [
                    30.671843960881233,
                    64.6627337035651
                ],
                [
                    30.67251417785883,
                    64.66273621446518
                ],
                [
                    30.672905445098877,
                    64.66265608076735
                ],
                [
                    30.672916173934937,
                    64.66203164678092
                ],
                [
                    30.67318707704544,
                    64.66175386086657
                ],
                [
                    30.673715472221375,
                    64.66148525525287
                ],
                [
                    30.67417949438095,
                    64.66132684556742
                ],
                [
                    30.675044506788254,
                    64.66129355645799
                ],
                [
                    30.676006078720093,
                    64.66127863374045
                ],
                [
                    30.678908228874207,
                    64.66118220982948
                ],
                [
                    30.679136216640472,
                    64.66106512319111
                ],
                [
                    30.679228752851486,
                    64.66090097146503
                ],
                [
                    30.681949853897095,
                    64.66091130272183
                ],
                [
                    30.683113932609558,
                    64.66091130272183
                ],
                [
                    30.683363378047943,
                    64.66069549342916
                ],
                [
                    30.68362757563591,
                    64.66060136330645
                ],
                [
                    30.684610605239868,
                    64.66055774191933
                ],
                [
                    30.686107277870178,
                    64.66050952872564
                ],
                [
                    30.687821209430695,
                    64.66065531597772
                ],
                [
                    30.689513683319092,
                    64.66071386024431
                ],
                [
                    30.694255828857422,
                    64.6606358011941
                ],
                [
                    30.696101188659668,
                    64.66064039290917
                ],
                [
                    30.69808602333069,
                    64.66064957633694
                ],
                [
                    30.705242156982422,
                    64.65968070757212
                ],
                [
                    30.708085298538208,
                    64.65927661938024
                ],
                [
                    30.70976436138153,
                    64.65905620510266
                ],
                [
                    30.71005940437317,
                    64.65852352987322
                ],
                [
                    30.71026861667633,
                    64.65814697728152
                ],
                [
                    30.710265934467316,
                    64.65786685550064
                ],
                [
                    30.71026459336281,
                    64.65735482214865
                ],
                [
                    30.710391998291016,
                    64.65681522497661
                ],
                [
                    30.71048855781555,
                    64.65597021720946
                ],
                [
                    30.7108935713768,
                    64.65566940646359
                ],
                [
                    30.71149170398712,
                    64.65542370360932
                ],
                [
                    30.711762607097626,
                    64.65507236762598
                ],
                [
                    30.71212336421013,
                    64.65496099546613
                ],
                [
                    30.712260827422142,
                    64.65517627629085
                ],
                [
                    30.71231245994568,
                    64.65542829620645
                ]
            ]
        },
        'distance': 3,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.687147974967957,
                64.65884942997562
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.661983489990234,
                        64.65496099546613
                    ],
                    [
                        30.71231245994568,
                        64.66273786448511
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': '4f41464158934e9596e60d94ccaa13c8'
    },
    {
        'name': 'Work zone 1',
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.666006803512573,
                        64.67795481331704
                    ],
                    [
                        30.667970180511475,
                        64.67829896994782
                    ],
                    [
                        30.670158863067627,
                        64.6774913421509
                    ],
                    [
                        30.669472217559814,
                        64.67703704094212
                    ],
                    [
                        30.668442249298096,
                        64.6768810165486
                    ]
                ]
            ]
        },
        'distance': null,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.6680828332901,
                64.6775899932482
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.666006803512573,
                        64.6768810165486
                    ],
                    [
                        30.670158863067627,
                        64.67829896994782
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': '89f9cac59b1a41aeb5629269e65fd85d'
    },
    {
        'name': 'Work zone 2',
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.66809892654419,
                        64.6818917042827
                    ],
                    [
                        30.67108154296875,
                        64.68225416316763
                    ],
                    [
                        30.67229390144348,
                        64.68204769983994
                    ],
                    [
                        30.672250986099243,
                        64.68193299731169
                    ],
                    [
                        30.670223236083984,
                        64.68160723948476
                    ],
                    [
                        30.66985845565796,
                        64.68140077122943
                    ],
                    [
                        30.668978691101074,
                        64.68136406559718
                    ],
                    [
                        30.66804528236389,
                        64.68144206500631
                    ]
                ]
            ]
        },
        'distance': null,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.670169591903687,
                64.6818091143824
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.66804528236389,
                        64.68136406559718
                    ],
                    [
                        30.67229390144348,
                        64.68225416316763
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': '9e49d18d4a254e7ebc952de2d51e3962'
    },
    {
        'name': 'Work zone 4',
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.66711187362671,
                        64.68352961285814
                    ],
                    [
                        30.667927265167236,
                        64.68246062492267
                    ],
                    [
                        30.670523643493652,
                        64.68276802062191
                    ],
                    [
                        30.67257285118103,
                        64.68308458866836
                    ],
                    [
                        30.672647953033447,
                        64.68358007905755
                    ],
                    [
                        30.67011594772339,
                        64.68405720938979
                    ],
                    [
                        30.668785572052002,
                        64.68394710313557
                    ]
                ]
            ]
        },
        'distance': null,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.669879913330078,
                64.68325891715622
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.66711187362671,
                        64.68246062492267
                    ],
                    [
                        30.672647953033447,
                        64.68405720938979
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': 'c9d63b234fa548ed87f0ab9c77502f59'
    },
    {
        'distance': null,
        'name': 'North Shovel zone',
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.671860923148643,
                        64.70043537633168
                    ],
                    [
                        30.670358886100303,
                        64.69980264187326
                    ],
                    [
                        30.67018722472335,
                        64.69889477965613
                    ],
                    [
                        30.671753634788047,
                        64.6987480515928
                    ],
                    [
                        30.673234214164268,
                        64.70025197656076
                    ]
                ]
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.67018722472335,
                        64.6987480515928
                    ],
                    [
                        30.673234214164268,
                        64.70043537633168
                    ]
                ]
            ]
        },
        'center': {
            'type': 'Point',
            'coordinates': [
                30.67171071944381,
                64.69959171396223
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': '799f183da6f347dbb876863726b1bd4b'
    },
    {
        'name': 'Warehouse',
        'distance': null,
        'organization_id': '00000000000000000000000000000000',
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.676467418670654,
                        64.67468740208494
                    ],
                    [
                        30.676649808883667,
                        64.67440745106781
                    ],
                    [
                        30.67655324935913,
                        64.67425141154152
                    ],
                    [
                        30.677518844604492,
                        64.67327843894526
                    ],
                    [
                        30.675373077392578,
                        64.67284701539565
                    ],
                    [
                        30.67206859588623,
                        64.67410454999059
                    ],
                    [
                        30.67205786705017,
                        64.67470575942768
                    ],
                    [
                        30.673388242721558,
                        64.6749948859368
                    ],
                    [
                        30.673141479492188,
                        64.67533908014212
                    ],
                    [
                        30.67330241203308,
                        64.67562361071963
                    ],
                    [
                        30.67404270172119,
                        64.67576128573356
                    ],
                    [
                        30.674504041671753,
                        64.67543086452562
                    ],
                    [
                        30.675276517868042,
                        64.67505684121622
                    ]
                ]
            ]
        },
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.67205786705017,
                        64.67284701539565
                    ],
                    [
                        30.677518844604492,
                        64.67576128573356
                    ]
                ]
            ]
        },
        'center': {
            'type': 'Point',
            'coordinates': [
                30.67478835582733,
                64.67430415056461
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': '9372a17a191345a694e8d2a184a43a2c'
    },
    {
        'name': 'Special Eqmt zone',
        'organization_id': '00000000000000000000000000000000',
        'type': 'object',
        'distance': 10,
        'geometry': null,
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [
            '5cc46f1f9705494d8184eab112ce2980'
        ],
        'include_object_ids': [],
        'id': '925b6c972b274baba4e45233c653e19d'
    },
    {
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.647445373035453,
                        64.68761852708572
                    ],
                    [
                        30.647681407428763,
                        64.68717815725739
                    ],
                    [
                        30.64798181483843,
                        64.68717815725739
                    ],
                    [
                        30.64823930690386,
                        64.68768274708778
                    ],
                    [
                        30.648840121723197,
                        64.68764604996237
                    ],
                    [
                        30.648604087329886,
                        64.68694879513754
                    ],
                    [
                        30.648067645526908,
                        64.68676530404399
                    ],
                    [
                        30.647445373035453,
                        64.6868387006305
                    ],
                    [
                        30.64699476192095,
                        64.68713228498869
                    ],
                    [
                        30.646823100543997,
                        64.68764604996237
                    ]
                ]
            ]
        },
        'distance': null,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.647831611133597,
                64.68722402556588
            ]
        },
        'name': 'Dangerous turn',
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.646823100543997,
                        64.68676530404399
                    ],
                    [
                        30.648840121723197,
                        64.68768274708778
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': '5e5d94eee3634856bab542f062ba684c'
    },
    {
        'name': 'East dump road',
        'type': 'line',
        'geometry': {
            'coordinates': [
                [
                    30.671383475210064,
                    64.69954834865418
                ],
                [
                    30.670789043820378,
                    64.69818922094842
                ],
                [
                    30.670681755459782,
                    64.6972262784409
                ],
                [
                    30.6702526020174,
                    64.69634584390452
                ],
                [
                    30.670059482968327,
                    64.69615324503499
                ],
                [
                    30.67044572106647,
                    64.69545620910897
                ],
                [
                    30.670531551754948,
                    64.69479584273947
                ],
                [
                    30.671346943295475,
                    64.69353892363266
                ],
                [
                    30.671625893033024,
                    64.69265836924491
                ],
                [
                    30.67221847092037,
                    64.6918921216926
                ],
                [
                    30.67294803177242,
                    64.69162610773594
                ],
                [
                    30.67376342331295,
                    64.69152520520707
                ],
                [
                    30.67522254501705,
                    64.69186460312855
                ],
                [
                    30.677067904819296,
                    64.69247000508128
                ],
                [
                    30.677770167954804,
                    64.69266849190521
                ],
                [
                    30.67864993251169,
                    64.69268683707337
                ],
                [
                    30.680302173264863,
                    64.69237496752557
                ],
                [
                    30.68360665477121,
                    64.69164114266356
                ],
                [
                    30.68508723414743,
                    64.69130174194282
                ],
                [
                    30.68633177913034,
                    64.6912833958368
                ],
                [
                    30.687297374375703,
                    64.69158610499767
                ],
                [
                    30.68787673152292,
                    64.69251255747447
                ],
                [
                    30.68832734263742,
                    64.69364076869921
                ],
                [
                    30.68914273417795,
                    64.69453963507065
                ],
                [
                    30.69008687175119,
                    64.69536509832419
                ],
                [
                    30.69062331355417,
                    64.6958511926949
                ],
                [
                    30.69113829768503,
                    64.69673164330875
                ],
                [
                    30.691309959061982,
                    64.69707097600924
                ],
                [
                    30.69140651858652,
                    64.6973002524545
                ]
            ],
            'type': 'LineString'
        },
        'distance': 2.5,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.680733000777423,
                64.69541587224549
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.670059482968327,
                        64.6912833958368
                    ],
                    [
                        30.69140651858652,
                        64.69954834865418
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': '580dc418dc8144dfb13946f9b44b26be'
    },
    {
        'name': 'South Shovel zone',
        'type': 'polygon',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.655312302658103,
                        64.68738506377693
                    ],
                    [
                        30.65535521800234,
                        64.68673367525797
                    ],
                    [
                        30.65563416773989,
                        64.68624741728385
                    ],
                    [
                        30.654818776199363,
                        64.68609144589688
                    ],
                    [
                        30.653745892593406,
                        64.68619236866152
                    ],
                    [
                        30.654067757675193,
                        64.68730249426788
                    ]
                ]
            ]
        },
        'distance': null,
        'center': {
            'type': 'Point',
            'coordinates': [
                30.65469003016665,
                64.68673825483691
            ]
        },
        'organization_id': '00000000000000000000000000000000',
        'boundaries': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [
                        30.653745892593406,
                        64.68609144589688
                    ],
                    [
                        30.65563416773989,
                        64.68738506377693
                    ]
                ]
            ]
        },
        'exclude_group_ids': [],
        'exclude_object_ids': [],
        'include_group_ids': [],
        'include_object_ids': [],
        'id': 'ea0bea19abc34ed8939330da4565546d'
    }
];
const currentObjecStatesDefault: Partial<ObjectState>[] = [
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'e67bfd966bd54310aa3870a1e6f76036',
        'object_id': '841abccea54d47bd87b04195764a859b',
        'time': new Date('2019-02-13T14:00:05.230Z'),
        'online': 7863436.992997163,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6754227,
                64.6745148
            ]
        },
        'alt': 200,
        'angle': 225,
        'speed': 5,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.988Z'),
        'state_time': new Date('2019-02-13T13:59:39.045Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:39.045Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6754227,
                64.6745148
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:05.230Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': 'e67bfd966bd54310aa3870a1e6f76036',
            'time': new Date('2019-02-13T14:00:05.230Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.6745148,
            'lng': 30.6754227,
            'alt': 200,
            'angle': 225,
            'speed': 5,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6755676,
                64.6744843
            ]
        },
        'im_time': new Date('2019-02-13T13:59:42.386Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 105.07299999999998,
                'zone_id': '9372a17a191345a694e8d2a184a43a2c'
            }
        ],
        'group_ids': [
            '561154dd93154c9eb307d1f0569a67db'
        ],
        'beacons': null,
        'id': '841abccea54d47bd87b04195764a859b'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'ff65253d71fc4e278d9e89013095c927',
        'object_id': 'e17172ad05d448d18450aca6f6fff653',
        'time': new Date('2019-02-13T14:00:05.182Z'),
        'online': 7863436.978997756,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6754436,
                64.6738
            ]
        },
        'alt': 200,
        'angle': 135,
        'speed': 5,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.909Z'),
        'state_time': new Date('2019-02-13T13:59:39.010Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:39.010Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6754436,
                64.6738
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:05.182Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': 'ff65253d71fc4e278d9e89013095c927',
            'time': new Date('2019-02-13T14:00:05.182Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.6738,
            'lng': 30.6754436,
            'alt': 200,
            'angle': 135,
            'speed': 5,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6754322,
                64.67381
            ]
        },
        'im_time': new Date('2019-02-13T14:00:01.909Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 105.05199999999999,
                'zone_id': '9372a17a191345a694e8d2a184a43a2c'
            }
        ],
        'group_ids': [
            'e892a72d6a2b4ca8899efb44a860f7d0',
            '561154dd93154c9eb307d1f0569a67db'
        ],
        'beacons': null,
        'id': 'e17172ad05d448d18450aca6f6fff653'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'a889326f2b6b48bbbea388dfdeb7245b',
        'object_id': '6fb41f9479024da79b9f76a2daba053c',
        'time': new Date('2019-02-13T14:00:05.047Z'),
        'online': 7863436.885997702,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6763973,
                64.67374
            ]
        },
        'alt': 200,
        'angle': 135,
        'speed': 5,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.851Z'),
        'state_time': new Date('2019-02-13T13:59:38.981Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:38.981Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6763973,
                64.67374
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:05.047Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': 'a889326f2b6b48bbbea388dfdeb7245b',
            'time': new Date('2019-02-13T14:00:05.047Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.67374,
            'lng': 30.6763973,
            'alt': 200,
            'angle': 135,
            'speed': 5,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.676363,
                64.6737747
            ]
        },
        'im_time': new Date('2019-02-13T13:59:54.745Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 104.94299999999997,
                'zone_id': '9372a17a191345a694e8d2a184a43a2c'
            }
        ],
        'group_ids': [
            '561154dd93154c9eb307d1f0569a67db'
        ],
        'beacons': null,
        'id': '6fb41f9479024da79b9f76a2daba053c'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '58974eb97b6948cb986b17e219314a31',
        'object_id': '6470351cad3a46f8b484a92d7dcacce1',
        'time': new Date('2019-02-13T14:00:04.928Z'),
        'online': 7863436.817996868,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6759338,
                64.6742249
            ]
        },
        'alt': 200,
        'angle': 180,
        'speed': 4,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.776Z'),
        'state_time': new Date('2019-02-13T13:59:38.951Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:38.951Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6759338,
                64.6742249
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.928Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '58974eb97b6948cb986b17e219314a31',
            'time': new Date('2019-02-13T14:00:04.928Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.6742249,
            'lng': 30.6759338,
            'alt': 200,
            'angle': 180,
            'speed': 4,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6759071,
                64.67421
            ]
        },
        'im_time': new Date('2019-02-13T13:58:37.881Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 104.86799999999998,
                'zone_id': '9372a17a191345a694e8d2a184a43a2c'
            }
        ],
        'group_ids': [
            'd2ca097c76c94d61b20d96f96ee041af',
            'e892a72d6a2b4ca8899efb44a860f7d0',
            '561154dd93154c9eb307d1f0569a67db'
        ],
        'beacons': null,
        'id': '6470351cad3a46f8b484a92d7dcacce1'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '423a9863a94d42e593f912269d9c31a5',
        'object_id': '1bab7b4b9109441e8ad6a9d58bf8ee29',
        'time': new Date('2019-02-13T14:00:04.891Z'),
        'online': 7863436.821998219,
        'offline': 0,
        'assign_id': null,
        'assign_time': new Date('2019-02-13T12:00:00.000Z'),
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6760178,
                64.6741638
            ]
        },
        'alt': 200,
        'angle': 315,
        'speed': 0,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.668Z'),
        'state_time': new Date('2019-02-13T13:59:38.925Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:38.925Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6760178,
                64.6741638
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.891Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '423a9863a94d42e593f912269d9c31a5',
            'time': new Date('2019-02-13T14:00:04.891Z'),
            'freezed': true,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 1
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.6741638,
            'lng': 30.6760178,
            'alt': 200,
            'angle': 315,
            'speed': 0,
            'power': true
        },
        'freezed': 88.05000000000001,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6758766,
                64.67422
            ]
        },
        'im_time': new Date('2019-02-13T13:58:37.841Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 1,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 104.85600000000001,
                'zone_id': '9372a17a191345a694e8d2a184a43a2c'
            }
        ],
        'group_ids': [
            '896ba1e245a248ccb52aaae57d522374'
        ],
        'beacons': null,
        'id': '1bab7b4b9109441e8ad6a9d58bf8ee29'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '882e20812e0b4826810c85a7533dca51',
        'object_id': 'e04e5192d2714c88a41a3755a9626209',
        'time': new Date('2019-02-13T14:00:04.861Z'),
        'online': 7863436.82999744,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6618423,
                64.6604462
            ]
        },
        'alt': 200,
        'angle': 45,
        'speed': 4,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.610Z'),
        'state_time': new Date('2019-02-13T13:59:38.898Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:38.898Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6618423,
                64.6604462
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.861Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '882e20812e0b4826810c85a7533dca51',
            'time': new Date('2019-02-13T14:00:04.861Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.6604462,
            'lng': 30.6618423,
            'alt': 200,
            'angle': 45,
            'speed': 4,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6617317,
                64.66044
            ]
        },
        'im_time': new Date('2019-02-13T13:59:49.328Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 765.1399999999996,
                'zone_id': 'ae5a413ec4d04782bfeee2bfa0af07ff'
            }
        ],
        'group_ids': [
            '437976459733426d968dfe14790f6dbf'
        ],
        'beacons': null,
        'id': 'e04e5192d2714c88a41a3755a9626209'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'ae3d9375bb324bd6a9e6ee7b3090b840',
        'object_id': '362d4e9ab5164032887ca3a43ba01c5f',
        'time': new Date('2019-02-13T14:00:04.824Z'),
        'online': 7863436.826997987,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6677628,
                64.65986
            ]
        },
        'alt': 200,
        'angle': 45,
        'speed': 4,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.552Z'),
        'state_time': new Date('2019-02-13T13:59:16.353Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:16.353Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6677628,
                64.65986
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.824Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': 'ae3d9375bb324bd6a9e6ee7b3090b840',
            'time': new Date('2019-02-13T14:00:04.824Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.65986,
            'lng': 30.6677628,
            'alt': 200,
            'angle': 45,
            'speed': 4,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6675587,
                64.65986
            ]
        },
        'im_time': new Date('2019-02-13T13:59:40.532Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 765.1279999999997,
                'zone_id': 'ae5a413ec4d04782bfeee2bfa0af07ff'
            }
        ],
        'group_ids': [
            '437976459733426d968dfe14790f6dbf'
        ],
        'beacons': null,
        'id': '362d4e9ab5164032887ca3a43ba01c5f'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '2c27a52a4b5c4dd99233e74040f9bd3f',
        'object_id': '0fbeda21195e46fbbc24f8e5a9bd739f',
        'time': new Date('2019-02-13T14:00:04.754Z'),
        'online': 47862.3229999997,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6645966,
                64.6615448
            ]
        },
        'alt': 200,
        'angle': 225,
        'speed': 4,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.483Z'),
        'state_time': new Date('2019-02-13T13:59:47.485Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:47.485Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6645966,
                64.6615448
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.754Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '2c27a52a4b5c4dd99233e74040f9bd3f',
            'time': new Date('2019-02-13T14:00:04.754Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.6615448,
            'lng': 30.6645966,
            'alt': 200,
            'angle': 225,
            'speed': 4,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6646137,
                64.6615448
            ]
        },
        'im_time': new Date('2019-02-13T14:00:03.325Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 765.0840000000005,
                'zone_id': 'ae5a413ec4d04782bfeee2bfa0af07ff'
            }
        ],
        'group_ids': [
            '437976459733426d968dfe14790f6dbf'
        ],
        'beacons': null,
        'id': '0fbeda21195e46fbbc24f8e5a9bd739f'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '6c3fe909a3cf4ad8a58c0a56a2102683',
        'object_id': 'b65b292a886949db8ca9bc72f3fbe68f',
        'time': new Date('2019-02-13T14:00:04.714Z'),
        'online': 7863436.789997704,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6620579,
                64.66117
            ]
        },
        'alt': 200,
        'angle': 135,
        'speed': 6,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.429Z'),
        'state_time': new Date('2019-02-13T13:59:16.284Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:16.284Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6620579,
                64.66117
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.714Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '6c3fe909a3cf4ad8a58c0a56a2102683',
            'time': new Date('2019-02-13T14:00:04.714Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.66117,
            'lng': 30.6620579,
            'alt': 200,
            'angle': 135,
            'speed': 6,
            'power': true
        },
        'freezed': 0,
        'immobile': 451.96499999999975,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.66199,
                64.66119
            ]
        },
        'im_time': new Date('2019-02-13T13:47:32.622Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 21.882,
                'zone_id': '7fa504f7b9034d979c27697f0520fdde'
            },
            {
                'exited': false,
                'entered': false,
                'duration': 765.0700000000004,
                'zone_id': 'ae5a413ec4d04782bfeee2bfa0af07ff'
            }
        ],
        'group_ids': [
            'e892a72d6a2b4ca8899efb44a860f7d0',
            '437976459733426d968dfe14790f6dbf'
        ],
        'beacons': null,
        'id': 'b65b292a886949db8ca9bc72f3fbe68f'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'ae0f537f46be4b80b44d659062473a7a',
        'object_id': '6348633470884f04aeb59122472d8c06',
        'time': new Date('2019-02-13T14:00:04.667Z'),
        'online': 7863436.7759973435,
        'offline': 0,
        'assign_id': null,
        'assign_time': new Date('2019-02-13T12:00:00.000Z'),
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6620369,
                64.6611557
            ]
        },
        'alt': 200,
        'angle': 45,
        'speed': 0,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.364Z'),
        'state_time': new Date('2019-02-13T13:59:16.257Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T14:00:03.232Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6620369,
                64.6611557
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.667Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': 'ae0f537f46be4b80b44d659062473a7a',
            'time': new Date('2019-02-13T14:00:04.667Z'),
            'freezed': true,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 1
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.6611557,
            'lng': 30.6620369,
            'alt': 200,
            'angle': 45,
            'speed': 0,
            'power': true
        },
        'freezed': 753.0760000000002,
        'immobile': 450.29499999999985,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6620369,
                64.6611557
            ]
        },
        'im_time': new Date('2019-02-13T13:47:34.293Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 1,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 753.0760000000002,
                'zone_id': '7fa504f7b9034d979c27697f0520fdde'
            },
            {
                'exited': false,
                'entered': false,
                'duration': 765.0460000000002,
                'zone_id': 'ae5a413ec4d04782bfeee2bfa0af07ff'
            }
        ],
        'group_ids': [
            '896ba1e245a248ccb52aaae57d522374'
        ],
        'beacons': null,
        'id': '6348633470884f04aeb59122472d8c06'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '053a18a5a24a47d4b14392b75de4e0ea',
        'object_id': '4eef83ee351740699ce79639a4ae92a8',
        'time': new Date('2019-02-13T14:00:04.634Z'),
        'online': 3343.7709999999956,
        'offline': 0,
        'assign_id': null,
        'assign_time': new Date('2019-02-13T12:00:00.000Z'),
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6827068,
                64.68182
            ]
        },
        'alt': 200,
        'angle': 0,
        'speed': 0,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.324Z'),
        'state_time': new Date('2019-02-13T13:59:23.501Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:23.501Z'),
        'attend_start': new Date('2019-02-13T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6827068,
                64.68182
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.634Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '053a18a5a24a47d4b14392b75de4e0ea',
            'time': new Date('2019-02-13T14:00:04.634Z'),
            'freezed': true,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 1
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.68182,
            'lng': 30.6827068,
            'alt': 200,
            'angle': 0,
            'speed': 0,
            'power': true
        },
        'freezed': 686.3550000000001,
        'immobile': 385.1500000000001,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6827068,
                64.68182
            ]
        },
        'im_time': new Date('2019-02-13T13:48:39.279Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 1,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 694.7420000000001,
                'zone_id': '0ad7195fef7d4c64a8137f0d577460d6'
            }
        ],
        'group_ids': [
            '896ba1e245a248ccb52aaae57d522374'
        ],
        'beacons': null,
        'id': '4eef83ee351740699ce79639a4ae92a8'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '892e33e05c4b48a696025d64a7f5cf4b',
        'object_id': '43118a2fb2d64ffe8b87c4703e9464e1',
        'time': new Date('2019-02-13T14:00:04.566Z'),
        'online': 3343.030000000004,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.68901,
                64.6815643
            ]
        },
        'alt': 200,
        'angle': 135,
        'speed': 4,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.281Z'),
        'state_time': new Date('2019-02-13T13:59:52.666Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:23.472Z'),
        'attend_start': new Date('2019-02-13T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.68901,
                64.6815643
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.566Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '892e33e05c4b48a696025d64a7f5cf4b',
            'time': new Date('2019-02-13T14:00:04.566Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.6815643,
            'lng': 30.68901,
            'alt': 200,
            'angle': 135,
            'speed': 4,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6889229,
                64.68161
            ]
        },
        'im_time': new Date('2019-02-13T13:59:50.998Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 694.6420000000003,
                'zone_id': '0ad7195fef7d4c64a8137f0d577460d6'
            }
        ],
        'group_ids': [
            'e892a72d6a2b4ca8899efb44a860f7d0'
        ],
        'beacons': null,
        'id': '43118a2fb2d64ffe8b87c4703e9464e1'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '70b05b8f091e44159f64aef2edeee200',
        'object_id': '45c29d02316e4320a036edd931f26673',
        'time': new Date('2019-02-13T14:00:04.474Z'),
        'online': 7863436.827997565,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6914063,
                64.6973
            ]
        },
        'alt': 200,
        'angle': 45,
        'speed': 0,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.236Z'),
        'state_time': new Date('2019-02-13T13:59:38.569Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T14:00:03.097Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6914063,
                64.6973
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.474Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '70b05b8f091e44159f64aef2edeee200',
            'time': new Date('2019-02-13T14:00:04.474Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.6973,
            'lng': 30.6914063,
            'alt': 200,
            'angle': 45,
            'speed': 0,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6913853,
                64.69725
            ]
        },
        'im_time': new Date('2019-02-13T13:56:03.233Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 268.9680000000001,
                'zone_id': 'caef7aeb8b80489aa1f0aab8644f58d2'
            },
            {
                'exited': false,
                'entered': false,
                'duration': 5703.805000000001,
                'zone_id': '580dc418dc8144dfb13946f9b44b26be'
            }
        ],
        'group_ids': [
            '044d550bdc36426caf7f062c185c533e',
            'de56b3d20b50452cb5e440377819835f'
        ],
        'beacons': null,
        'id': '45c29d02316e4320a036edd931f26673'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'af5d132786364812ab80fb785d113a65',
        'object_id': '95f8d418ee48467c82d1c412d7be7664',
        'time': new Date('2019-02-13T14:00:04.394Z'),
        'online': 7863436.781997473,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6623344,
                64.68953
            ]
        },
        'alt': 200,
        'angle': 315,
        'speed': 34,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.182Z'),
        'state_time': new Date('2019-02-13T13:59:47.257Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:47.257Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6623344,
                64.68953
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.394Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': 'af5d132786364812ab80fb785d113a65',
            'time': new Date('2019-02-13T14:00:04.394Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.68953,
            'lng': 30.6623344,
            'alt': 200,
            'angle': 315,
            'speed': 34,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6623344,
                64.68953
            ]
        },
        'im_time': new Date('2019-02-13T14:00:04.394Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [],
        'group_ids': [
            '044d550bdc36426caf7f062c185c533e',
            'de56b3d20b50452cb5e440377819835f'
        ],
        'beacons': null,
        'id': '95f8d418ee48467c82d1c412d7be7664'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'afbdd036a6d449bf9fef99d73792b890',
        'object_id': 'a84e8721a8174e7e9b69e011dceb4ba6',
        'time': new Date('2019-02-13T14:00:04.355Z'),
        'online': 7863436.779997206,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6713524,
                64.69954
            ]
        },
        'alt': 200,
        'angle': 315,
        'speed': 0,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.142Z'),
        'state_time': new Date('2019-02-13T13:59:35.135Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:47.228Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6713524,
                64.69954
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.355Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': 'afbdd036a6d449bf9fef99d73792b890',
            'time': new Date('2019-02-13T14:00:04.355Z'),
            'freezed': true,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 1
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.69954,
            'lng': 30.6713524,
            'alt': 200,
            'angle': 315,
            'speed': 0,
            'power': true
        },
        'freezed': 177.18900000000005,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.671423,
                64.6994553
            ]
        },
        'im_time': new Date('2019-02-13T13:57:06.447Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 1,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 193.31800000000007,
                'zone_id': '799f183da6f347dbb876863726b1bd4b'
            },
            {
                'exited': false,
                'entered': false,
                'duration': 177.18900000000005,
                'zone_id': '580dc418dc8144dfb13946f9b44b26be'
            }
        ],
        'group_ids': [
            '044d550bdc36426caf7f062c185c533e',
            'de56b3d20b50452cb5e440377819835f'
        ],
        'beacons': null,
        'id': 'a84e8721a8174e7e9b69e011dceb4ba6'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '78e6029d02ac4a68b85385492c1ca87e',
        'object_id': 'dece51d9502a4cce81e767a83eedced5',
        'time': new Date('2019-02-13T14:00:04.313Z'),
        'online': 7863436.801997523,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.651844,
                64.69572
            ]
        },
        'alt': 200,
        'angle': 225,
        'speed': 34,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.104Z'),
        'state_time': new Date('2019-02-13T13:59:16.068Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:47.197Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.651844,
                64.69572
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.313Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '78e6029d02ac4a68b85385492c1ca87e',
            'time': new Date('2019-02-13T14:00:04.313Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.69572,
            'lng': 30.651844,
            'alt': 200,
            'angle': 225,
            'speed': 34,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.651844,
                64.69572
            ]
        },
        'im_time': new Date('2019-02-13T14:00:04.313Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [],
        'group_ids': [],
        'beacons': null,
        'id': 'dece51d9502a4cce81e767a83eedced5'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'dafdca329983483ebe8109a708500090',
        'object_id': '163e0427ff294aca9b053a61414842a0',
        'time': new Date('2019-02-13T14:00:04.262Z'),
        'online': 7863436.800997421,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6484585,
                64.68795
            ]
        },
        'alt': 200,
        'angle': 225,
        'speed': 29,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.073Z'),
        'state_time': new Date('2019-02-13T13:59:47.158Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:47.158Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6484585,
                64.68795
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.262Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': 'dafdca329983483ebe8109a708500090',
            'time': new Date('2019-02-13T14:00:04.262Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.68795,
            'lng': 30.6484585,
            'alt': 200,
            'angle': 225,
            'speed': 29,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6484585,
                64.68795
            ]
        },
        'im_time': new Date('2019-02-13T14:00:04.262Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [],
        'group_ids': [],
        'beacons': null,
        'id': '163e0427ff294aca9b053a61414842a0'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '547b9d5b475842afac780edc25b7a723',
        'object_id': '7fd8fb30b9e44f2da9192b1e4a21ecf0',
        'time': new Date('2019-02-13T14:00:04.179Z'),
        'online': 7863436.777997711,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6546478,
                64.68687
            ]
        },
        'alt': 200,
        'angle': 315,
        'speed': 12,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:01.025Z'),
        'state_time': new Date('2019-02-13T13:59:47.128Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:47.128Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6546478,
                64.68687
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.179Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '547b9d5b475842afac780edc25b7a723',
            'time': new Date('2019-02-13T14:00:04.179Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.68687,
            'lng': 30.6546478,
            'alt': 200,
            'angle': 315,
            'speed': 12,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6546478,
                64.68687
            ]
        },
        'im_time': new Date('2019-02-13T14:00:04.179Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 3038396.4659999446,
                'zone_id': '338c32dee6a04c468a479330ad1d7acf'
            },
            {
                'exited': false,
                'entered': false,
                'duration': 6662860.458998422,
                'zone_id': 'ea0bea19abc34ed8939330da4565546d'
            }
        ],
        'group_ids': [
            '4dfb98d581a34d5e9cc5887335ddcc1b'
        ],
        'beacons': null,
        'id': '7fd8fb30b9e44f2da9192b1e4a21ecf0'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'cd14aa82932a4b5db3b643459314de2e',
        'object_id': '36929eb1ee404aaa9de3114033c51386',
        'time': new Date('2019-02-13T14:00:04.123Z'),
        'online': 7863436.77199787,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6716328,
                64.6999
            ]
        },
        'alt': 200,
        'angle': 45,
        'speed': 10,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:00.971Z'),
        'state_time': new Date('2019-02-13T13:59:47.101Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:47.101Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6716328,
                64.6999
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:04.123Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': 'cd14aa82932a4b5db3b643459314de2e',
            'time': new Date('2019-02-13T14:00:04.123Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.6999,
            'lng': 30.6716328,
            'alt': 200,
            'angle': 45,
            'speed': 10,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.67145,
                64.69987
            ]
        },
        'im_time': new Date('2019-02-13T13:59:54.269Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 469373.4819999944,
                'zone_id': '338c32dee6a04c468a479330ad1d7acf'
            },
            {
                'exited': false,
                'entered': false,
                'duration': 6662860.60199831,
                'zone_id': '799f183da6f347dbb876863726b1bd4b'
            }
        ],
        'group_ids': [
            '4dfb98d581a34d5e9cc5887335ddcc1b'
        ],
        'beacons': null,
        'id': '36929eb1ee404aaa9de3114033c51386'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '48b0caa2b98b4d13aef9b67f5bd23c66',
        'object_id': '1e4d7d227ca54d49a95b705e764ab4b4',
        'time': new Date('2019-02-13T14:00:03.958Z'),
        'online': 7863436.669997443,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6920357,
                64.6975861
            ]
        },
        'alt': 200,
        'angle': 135,
        'speed': 25,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:00.928Z'),
        'state_time': new Date('2019-02-13T13:59:47.073Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:47.073Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6920357,
                64.6975861
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:03.958Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '48b0caa2b98b4d13aef9b67f5bd23c66',
            'time': new Date('2019-02-13T14:00:03.958Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.6975861,
            'lng': 30.6920357,
            'alt': 200,
            'angle': 135,
            'speed': 25,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6920357,
                64.6975861
            ]
        },
        'im_time': new Date('2019-02-13T14:00:03.958Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 6662856.230998184,
                'zone_id': 'caef7aeb8b80489aa1f0aab8644f58d2'
            }
        ],
        'group_ids': [
            '28417b77fae741d59fcfd8933f6af461'
        ],
        'beacons': null,
        'id': '1e4d7d227ca54d49a95b705e764ab4b4'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': '4c5af465898140298c536dabd25c5272',
        'object_id': 'dfc175a4d12c47fda8684b7a762e91e0',
        'time': new Date('2019-02-13T14:00:03.888Z'),
        'online': 7863436.67099791,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6117,
                64.68727
            ]
        },
        'alt': 200,
        'angle': 135,
        'speed': 22,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:00.892Z'),
        'state_time': new Date('2019-02-13T13:59:38.319Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:38.319Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6117,
                64.68727
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:03.888Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': '4c5af465898140298c536dabd25c5272',
            'time': new Date('2019-02-13T14:00:03.888Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                }
            ],
            'events': [],
            'lat': 64.68727,
            'lng': 30.6117,
            'alt': 200,
            'angle': 135,
            'speed': 22,
            'power': true
        },
        'freezed': 0,
        'immobile': 0,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6117,
                64.68727
            ]
        },
        'im_time': new Date('2019-02-13T14:00:03.888Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 7442507.458998,
                'zone_id': '9f88b6307a3645f597bc4e48f7758ee1'
            }
        ],
        'group_ids': [
            '28417b77fae741d59fcfd8933f6af461'
        ],
        'beacons': null,
        'id': 'dfc175a4d12c47fda8684b7a762e91e0'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': 'e0a31d48021e492c8c7d45b17ac36175',
        'object_id': '60256da4ba014328ade33005b4687736',
        'time': new Date('2019-02-13T14:00:03.844Z'),
        'online': 7863436.774998083,
        'offline': 0,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'expected': true,
        'pos': {
            'type': 'Point',
            'coordinates': [
                30.6741676,
                64.67447
            ]
        },
        'alt': 200,
        'angle': 0,
        'speed': 0,
        'quality': 2,
        'connected': false,
        'pressed': null,
        'long_pressed': null,
        'pos_time': new Date('2019-02-13T14:00:00.857Z'),
        'state_time': new Date('2019-02-13T13:59:38.292Z'),
        'rule_time': null,
        'attend_time': new Date('2019-02-13T13:59:38.292Z'),
        'attend_start': new Date('2018-11-05T00:00:00.000Z'),
        'last_pos': {
            'type': 'Point',
            'coordinates': [
                30.6741676,
                64.67447
            ]
        },
        'last_pos_time': new Date('2019-02-13T14:00:03.844Z'),
        'extra': {
            'organization_id': '00000000000000000000000000000000',
            'device_id': 'e0a31d48021e492c8c7d45b17ac36175',
            'time': new Date('2019-02-13T14:00:03.844Z'),
            'freezed': false,
            'pressed': false,
            'long_pressed': false,
            'params': [
                {
                    'id': 1,
                    'typ': 1,
                    'val': 1
                },
                {
                    'id': 2,
                    'typ': 2,
                    'val': 0
                },
                {
                    'id': 3,
                    'typ': 3,
                    'val': 0
                },
                {
                    'id': 9,
                    'val': 1000
                }
            ],
            'events': [],
            'lat': 64.67447,
            'lng': 30.6741676,
            'alt': 200,
            'angle': 0,
            'speed': 0,
            'power': true
        },
        'freezed': 0,
        'immobile': 8637197.829998849,
        'im_pos': {
            'type': 'Point',
            'coordinates': [
                30.6741676,
                64.67447
            ]
        },
        'im_time': new Date('2018-11-05T14:25:41.410Z'),
        'power': true,
        'power_changed': false,
        'states': [],
        'commands': null,
        'events': null,
        'params': [
            {
                'val': 1,
                'typ': 3,
                'id': 1
            },
            {
                'val': 0,
                'typ': 4,
                'id': 2
            },
            {
                'val': 0,
                'typ': null,
                'id': 3
            },
            {
                'val': 1000,
                'typ': null,
                'id': 9
            }
        ],
        'zones': [
            {
                'exited': false,
                'entered': false,
                'duration': 31277828.35001598,
                'zone_id': '9372a17a191345a694e8d2a184a43a2c'
            }
        ],
        'group_ids': [],
        'beacons': null,
        'id': '60256da4ba014328ade33005b4687736'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': null,
        'object_id': 'a37ba2449acd4cf6b3a5eccff65f0f5d',
        'time': new Date('2018-07-25T19:55:03.961Z'),
        'online': 0,
        'offline': 900.001,
        'connected': false,
        'expected': true,
        'freezed': 0,
        'pressed': false,
        'long_pressed': false,
        'power': null,
        'power_changed': false,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'state_time': new Date('2018-07-25T19:55:03.961Z'),
        'pos_time': null,
        'last_pos_time': null,
        'rule_time': null,
        'attend_time': null,
        'attend_start': null,
        'states': [],
        'commands': [],
        'events': [],
        'params': [],
        'zones': [],
        'group_ids': [],
        'beacons': [],
        'id': 'a37ba2449acd4cf6b3a5eccff65f0f5d'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': null,
        'object_id': '328e0c25d6b34d5bb1f21747f7ead395',
        'time': new Date('2018-07-25T19:55:03.961Z'),
        'online': 0,
        'offline': 900.001,
        'connected': false,
        'expected': true,
        'freezed': 0,
        'pressed': false,
        'long_pressed': false,
        'power': null,
        'power_changed': false,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'state_time': new Date('2018-07-25T19:55:03.961Z'),
        'pos_time': null,
        'last_pos_time': null,
        'rule_time': null,
        'attend_time': null,
        'attend_start': null,
        'states': [],
        'commands': [],
        'events': [],
        'params': [],
        'zones': [],
        'group_ids': [],
        'beacons': [],
        'id': '328e0c25d6b34d5bb1f21747f7ead395'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': null,
        'object_id': '7322a1eabe604efe873ac0c461e7265a',
        'time': new Date('2018-07-25T19:55:03.961Z'),
        'online': 0,
        'offline': 900.001,
        'connected': false,
        'expected': true,
        'freezed': 0,
        'pressed': false,
        'long_pressed': false,
        'power': null,
        'power_changed': false,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'state_time': new Date('2018-07-25T19:55:03.961Z'),
        'pos_time': null,
        'last_pos_time': null,
        'rule_time': null,
        'attend_time': null,
        'attend_start': null,
        'states': [],
        'commands': [],
        'events': [],
        'params': [],
        'zones': [],
        'group_ids': [],
        'beacons': [],
        'id': '7322a1eabe604efe873ac0c461e7265a'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': null,
        'object_id': '7a956331bcce4bf48371984f8c187929',
        'time': new Date('2018-07-25T19:55:03.961Z'),
        'online': 0,
        'offline': 900.001,
        'connected': false,
        'expected': true,
        'freezed': 0,
        'pressed': false,
        'long_pressed': false,
        'power': null,
        'power_changed': false,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'state_time': new Date('2018-07-25T19:55:03.961Z'),
        'pos_time': null,
        'last_pos_time': null,
        'rule_time': null,
        'attend_time': null,
        'attend_start': null,
        'states': [],
        'commands': [],
        'events': [],
        'params': [],
        'zones': [],
        'group_ids': [],
        'beacons': [],
        'id': '7a956331bcce4bf48371984f8c187929'
    },
    {
        'organization_id': '00000000000000000000000000000000',
        'device_id': null,
        'object_id': 'b2dab7d007c14b20ba56f0353db786bc',
        'time': new Date('2017-12-09T03:46:51.755Z'),
        'online': 0,
        'offline': 1199.998,
        'connected': false,
        'expected': true,
        'pressed': false,
        'long_pressed': false,
        'assign_id': null,
        'assign_time': null,
        'assigner': false,
        'assignee': false,
        'state_time': new Date('2017-12-09T03:46:51.755Z'),
        'pos_time': null,
        'rule_time': null,
        'attend_time': null,
        'attend_start': null,
        'freezed': 0,
        'states': [],
        'commands': [],
        'events': [],
        'params': [],
        'zones': [],
        'group_ids': [],
        'beacons': [],
        'id': 'b2dab7d007c14b20ba56f0353db786bc'
    }
];

export let users: User[] = JSON.parse(localStorage.getItem('mockUsers')) || cloneDeep(usersDefault);
export let organizations = (JSON.parse(localStorage.getItem('mockOrganizations')) || cloneDeep(organizationsDefault)) as Organization[];
export let userOrganizations: UserOrganizations[] = JSON.parse(localStorage.getItem('mockUserOrganizations'))
    || cloneDeep(userOrganizationsDefault);
export let sessions: Session[] = JSON.parse(localStorage.getItem('mockSessions')) || [];
export let applications: Application[] = JSON.parse(localStorage.getItem('mockApplications')) || cloneDeep(applicationsDefault);
export let notifications: Notification[] = JSON.parse(localStorage.getItem('mockNotifications')) || cloneDeep(notificationsDefault);
export let emergencyPlans: EmergencyPlan[] = JSON.parse(localStorage.getItem('mockEmergencyPlans')) || cloneDeep(emergencyPlansDefault);
export let controlObjects: ControlObject[] = JSON.parse(localStorage.getItem('mockControlObjects')) || cloneDeep(controlObjectsDefaullt);
export let objectGroups: ObjectGroup[] = JSON.parse(localStorage.getItem('mockObjectGroups')) || cloneDeep(objectGroupsDefault);
export let zones: Zone[] = JSON.parse(localStorage.getItem('mockZones')) || cloneDeep(zonesDefault);
export let currentObjectStates: ObjectState[]
    = JSON.parse(localStorage.getItem('mockCurrentObjectStates')) || cloneDeep(currentObjecStatesDefault);

// TODO: all functions should be cloneDeep
export function resetToCurrentDefault() {
    localStorage.clear();
    users = cloneDeep<any>(usersDefault);
    organizations = cloneDeep<any>(organizationsDefault);
    userOrganizations = cloneDeep<any>(userOrganizationsDefault);
    sessions = [];
    applications = cloneDeep<any>(applicationsDefault);
    notifications = cloneDeep<any>(notificationsDefault);
    emergencyPlans = cloneDeep<any>(emergencyPlansDefault);
    controlObjects = cloneDeep<any>(controlObjectsDefaullt);
    objectGroups = cloneDeep<any>(objectGroupsDefault);
    zones = cloneDeep<any>(zonesDefault);
    currentObjectStates = cloneDeep<any>(currentObjecStatesDefault);
    onReset.emit();
}
