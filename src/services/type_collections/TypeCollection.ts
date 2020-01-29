import { TypeCollectionItem, TypeNumericCollectionItem } from './TypeCollectioItem';

export class TypeCollection {
    [key: string]: TypeCollectionItem;
}

export class TypeNumericCollection {
    [key: number]: TypeNumericCollectionItem;
}