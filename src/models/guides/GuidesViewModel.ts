import { GuidesModel } from './GuidesModel'
import { IGuidesViewModel } from './IGuidesViewModel';
import { ISettingsViewModel } from '../../models/settings/ISettingsViewModel';
import { IOrganizationService } from '../../services';

class GuideViewModel implements IGuidesViewModel {
    public model: GuidesModel;

    constructor(
        $location: ng.ILocationService,
        $timeout: ng.ITimeoutService,
        pipTransaction: pip.services.ITransactionService,
        pipTranslate: pip.services.ITranslateService,
        pipGuideData: pip.guidance.IGuideDataService,
        iqsSettingsViewModel: ISettingsViewModel,
        pipGuidance: pip.guidance.IIntroGuidanceService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        this.model = new GuidesModel(
            $location,
            $timeout,
            pipTransaction,
            pipTranslate,
            iqsSettingsViewModel,
            pipGuideData,
            pipGuidance,
            iqsOrganization
        );
    }

    // Show last relize or introduction guide
    public showLastGuide(showAllways?: boolean, successCallback?: () => void, errorCallback?: () => void): void {
        this.model.showLastGuide(showAllways, successCallback, errorCallback);
    }

    // show content related guide
    public showContentGuide(key: string, successCallback?: () => void, errorCallback?: () => void): void {
        this.model.showContentGuide(key, successCallback, errorCallback);
    }

    // show intofuction
    public showIntroduction(successCallback?: () => void, errorCallback?: () => void): void {
        this.model.showIntroduction(successCallback, errorCallback);
    }

    // show guide
    public showGuide(guide: pip.guidance.Guide): void {
        this.model.showGuide(guide);
    }

    public read(successCallback?: (data: pip.guidance.Guide[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.model.read(successCallback, errorCallback);
    }

    // data operation
    public get(): pip.guidance.Guide[] {
        return this.model.get();
    }

    public getTransaction(): pip.services.Transaction {
        return this.model.getTransaction();
    }

    public reload(successCallback?: (data: pip.guidance.Guide[]) => void, errorCallback?: (error: any) => void): void {
        this.model.reload(successCallback, errorCallback);
    }

    public get state(): string {
        return this.model.state;
    }

    public set state(value: string) {
        this.model.state = value;
    }

    public clean(): void {
        this.model.cleanUp();
    }

}

angular.module('iqsGuides.ViewModel', ['iqsSettings.ViewModel'])
    .service('iqsGuidesViewModel', GuideViewModel);