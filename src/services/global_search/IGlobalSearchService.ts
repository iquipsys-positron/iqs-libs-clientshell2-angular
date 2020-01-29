import { SearchResult } from './SearchResult';

export interface IGlobalSearchService {
    isInit: boolean;
    getSpecialSearchCollection(objectType: string, updateCallback?: () => void): string[];
    getDefaultCollection(objectType: string): string[];
    init(): string[];
    initAutocompleteParallel(successCallback?: (data: string[]) => void): angular.IPromise<any>;
    searchObjectsParallel(search: string, objectType: string, successCallback?: (data: SearchResult[]) => void): angular.IPromise<any>;
    clean(): void;
}
