import { CreditCard } from '../../data';
import { AssocietedObject } from './CreditCardsModel';

export interface ICreditCardsViewModel {
    state: string;
    isSort: boolean;
    selectAllow: boolean;
    filter: any;
    selectedIndex: number;
    search: string;

    read(isLoading?: boolean, successCallback?: (data: CreditCard[]) => void, errorCallback?: (error: any) => void);
    reload(successCallback?: (data: CreditCard[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(): CreditCard[];
    applyFilter(localFilter?: AssocietedObject): CreditCard[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): CreditCard;
    removeItem(id: string): void;
    create(creditCard: CreditCard, successCallback?: (data: CreditCard) => void, errorCallback?: (error: any) => void): void;
    deleteCreditCardById(id: string, customerId?: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    clean(): void;
}