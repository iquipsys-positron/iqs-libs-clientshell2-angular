import '../data/credit_cards/CreditCardDataService';
import '../models/credit_card/CreditCardViewModel';
import '../rest/CreditCardResources';

angular.module('iqsCreditCards', [
    'iqsCreditCards.Data',
    'iqsCreditCards.Resource',
    'iqsCreditCards.ViewModel',
]);