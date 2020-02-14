export class ApplicationConfig {
    public id: string;
    public productName?: string;
    public favoritesGroupName: string;
    public defaultFavoritesIds: string[];
}

export const applicationConfigDefault: ApplicationConfig = {
    id: 'unknown',
    productName: 'iQuipsys Positron',
    favoritesGroupName: 'favourites',
    defaultFavoritesIds: [
        'iqs_positron_monitoring',
        'iqs_positron_retrospective',
        'iqs_positron_schedule',
        'iqs_positron_incidents'
    ]
};
