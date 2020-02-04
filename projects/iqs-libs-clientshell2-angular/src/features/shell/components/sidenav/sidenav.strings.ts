export function getSidenavTranslations(favoritesGroupName: string) {
    return {
        en: {
            'SiDENAV.ORGANIZATION.CONNECT': 'Connect to organization',
            'SiDENAV.ORGANIZATION.DISCONNECT': 'Disconnect from organization',
            [favoritesGroupName]: 'Favorite',
            'apps': 'Applications',
            'analytics': 'Analytics',
            'administration': 'Administration',
            'config': 'Configuration',
        },
        ru: {
            'SiDENAV.ORGANIZATION.CONNECT': 'Подключиться к сайту',
            'SiDENAV.ORGANIZATION.DISCONNECT': 'Отключиться от сайта',
            [favoritesGroupName]: 'Избранное',
            'apps': 'Приложения',
            'analytics': 'Аналитика',
            'administration': 'Администрирование',
            'config': 'Конфигурации',
        }
    };
}
