
export interface IGuidesViewModel {
    // Show last relize or introduction guide
    showLastGuide(showAllways?: boolean, successCallback?: () => void, errorCallback?: () => void): void;
    // show content related guide
    showContentGuide(key: string, successCallback?: () => void, errorCallback?: () => void): void;
    // show intofuction
    showIntroduction(successCallback?: () => void, errorCallback?: () => void): void;
    showGuide(guide: pip.guidance.Guide): void;
    read(successCallback?: (data: pip.guidance.Guide[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    get(): pip.guidance.Guide[];
    getTransaction(): pip.services.Transaction;
    reload(successCallback?: (data: pip.guidance.Guide[]) => void, errorCallback?: (error: any) => void): void;
    clean(): void;

    state: string;
}
