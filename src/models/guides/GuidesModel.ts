import { DataPage, GuideType, GuideStatus } from '../../data';
import { States } from '../../common/States';
import { ISettingsViewModel } from '../../models/settings/ISettingsViewModel';
import { IOrganizationService } from '../../services';

export class GuidesModel {
    private _state: string;
    private transaction: pip.services.Transaction;

    private guides: pip.guidance.Guide[];
    private APP_NAME = 'Positron';
    private GUIDE_INTRO_KEY = 'intro';
    private GUIDE_RELEASE_KEY = 'release';

    constructor(
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private pipTransaction: pip.services.ITransactionService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsSettingsViewModel: ISettingsViewModel,
        private pipGuideData: pip.guidance.IGuideDataService,
        private pipGuidance: pip.guidance.IIntroGuidanceService,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('Guide');
        this.guides = [];
    }

    private markView(guide: pip.guidance.Guide, settings: any): void {
        if (!guide || !guide.id) return;

        let guideType: string = guide.type && (guide.type == GuideType.Introduction || guide.type == GuideType.NewRelease) ? guide.type : GuideType.NewRelease;
        let settingKey = guideType == GuideType.NewRelease ? this.GUIDE_RELEASE_KEY : this.GUIDE_INTRO_KEY;
        settings = settings ? settings : {};

        if (!settings[this.APP_NAME]) {
            settings[this.APP_NAME] = {};
        } else {
            settings[this.APP_NAME] = JSON.parse(settings[this.APP_NAME], function (key, value) {
                return value;
            });
        }

        if (!settings[this.APP_NAME][settingKey]) settings[this.APP_NAME][settingKey] = {};

        settings[this.APP_NAME][settingKey].lastId = guide.id;
        settings[this.APP_NAME][settingKey].create_time = guide.create_time || new Date().toISOString();

        delete settings.$promise;
        delete settings.$resolved;
        settings[this.APP_NAME] = JSON.stringify(settings[this.APP_NAME]);

        this.iqsSettingsViewModel.create(settings,
            (settings: any) => {

            },
            (error: any) => {

            });

    }

    private getLastReleaseGuide(guides: pip.guidance.Guide[]): pip.guidance.Guide {
        if (!guides || guides.length == 0) return null;

        let guidesSort: pip.guidance.Guide[] = null;

        guidesSort = _.filter(guides, (guide: pip.guidance.Guide) => {
            return guide.type === GuideType.Introduction && guide.status === GuideStatus.Completed && guide.app === this.APP_NAME;
        });

        if (!guidesSort || guidesSort.length == 0) return null;

        guidesSort = _.sortBy(guidesSort, (guide: pip.guidance.Guide) => {
            return -moment(guide.create_time).valueOf();
        });

        return guidesSort[0];
    }

    private getLastIntroGuide(guides: pip.guidance.Guide[]): pip.guidance.Guide {
        if (!guides || guides.length == 0) return null;

        let guidesSort: pip.guidance.Guide[] = null;

        guidesSort = _.filter(guides, (guide: pip.guidance.Guide) => {
            return guide.type === GuideType.NewRelease && guide.status === GuideStatus.Completed && guide.app === this.APP_NAME;
        });

        if (!guidesSort || guidesSort.length == 0) return null;

        guidesSort = _.sortBy(guidesSort, (guide: pip.guidance.Guide) => {
            return -moment(guide.create_time).valueOf();
        });

        return guidesSort[0];
    }


    private getHelpGuide(guides: pip.guidance.Guide[]): pip.guidance.Guide[] {
        if (!guides || guides.length == 0) return [];

        let guidesSort: pip.guidance.Guide[];

        guidesSort = _.filter(guides, (guide: pip.guidance.Guide) => {
            return guide.type !== GuideType.NewRelease && guide.type !== GuideType.Introduction && guide.status === GuideStatus.Completed && guide.app === this.APP_NAME;
        });

        if (!guidesSort || guidesSort.length == 0) return [];

        guidesSort = _.sortBy(guidesSort, (guide: pip.guidance.Guide) => {
            return -moment(guide.create_time).valueOf();
        });

        return guidesSort;
    }

    private getLastGuide(guides: pip.guidance.Guide[], settings: any): pip.guidance.Guide {
        if (!guides || guides.length == 0) return null;

        let guidesSort: pip.guidance.Guide[];
        if (!settings || !settings[this.GUIDE_INTRO_KEY] || !settings[this.GUIDE_INTRO_KEY].lastId) {
            guidesSort = _.filter(guides, (guide: pip.guidance.Guide) => {
                return guide.type === GuideType.Introduction && guide.status === GuideStatus.Completed && guide.app === this.APP_NAME;
            });

            guidesSort = _.sortBy(guidesSort, (guide: pip.guidance.Guide) => {
                return -moment(guide.create_time).valueOf();
            });

            return guidesSort[0] || null;
        }

        if (settings && settings[this.GUIDE_INTRO_KEY] && settings[this.GUIDE_INTRO_KEY].lastId) {
            guidesSort = _.filter(guides, (guide: pip.guidance.Guide) => {
                return guide.type === GuideType.Introduction && guide.status === GuideStatus.Completed && guide.app === this.APP_NAME;
            });

            guidesSort = _.sortBy(guidesSort, (guide: pip.guidance.Guide) => {
                return -moment(guide.create_time).valueOf();
            });

            if (!guidesSort || guidesSort.length == 0) return null;

            if (guidesSort[0].id != settings[this.GUIDE_INTRO_KEY].lastId) {
                return guidesSort[0];
            }
        }

        guidesSort = _.filter(guides, (guide: pip.guidance.Guide) => {
            return guide.type === GuideType.NewRelease && guide.status === GuideStatus.Completed && guide.app === this.APP_NAME;
        });

        guidesSort = _.sortBy(guidesSort, (guide: pip.guidance.Guide) => {
            return -moment(guide.create_time).valueOf();
        });
        if (!guidesSort || guidesSort.length == 0) return null;

        let lastCreateTime: moment.Moment;
        lastCreateTime = settings[this.GUIDE_INTRO_KEY].create_time ? moment(settings[this.GUIDE_INTRO_KEY].create_time) : null;

        let lastRealeseId: string = settings[this.GUIDE_RELEASE_KEY] && settings[this.GUIDE_RELEASE_KEY].lastId ? settings[this.GUIDE_RELEASE_KEY].lastId : null;

        if (!lastCreateTime || (guidesSort.length > 0 &&
            lastCreateTime.valueOf() < moment(guidesSort[0].create_time).valueOf() &&
            guidesSort[0].id != lastRealeseId)) {

            return guidesSort[0];
        }

        return null;
    }

    // Show last relize or introduction guide
    public showLastGuide(showAllways: boolean = false, successCallback?: () => void, errorCallback?: () => void): void {
        async.parallel([
            (callback) => {
                // read last settings
                this.iqsSettingsViewModel.read(
                    (data: any) => {
                        callback(null, data);
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                this.pipGuideData.readGuides(
                    {
                        app: this.APP_NAME
                    },
                    (data: DataPage<pip.guidance.Guide>) => {
                        callback(null, data.data);
                    },
                    (error: any) => {
                        callback(error);
                    }
                );
            }
        ],
            // optional callback
            (error, results) => {
                if (error) {
                    if (errorCallback) errorCallback();
                } else {
                    let settings: any

                    if (results && results[0] && results[0][this.APP_NAME]) {
                        settings = JSON.parse(results[0][this.APP_NAME], function (key, value) {
                            return value;
                        });
                    } else {
                        settings = {};
                    }

                    let guides: pip.guidance.Guide[] = <pip.guidance.Guide[]>results[1];
                    let guide = showAllways ? this.getLastGuide(guides, {}) : this.getLastGuide(guides, settings);

                    if (guide) {
                        this.pipGuidance.showGuide(
                            guide,
                            this.pipTranslate.language,
                            () => {
                                if (!showAllways)
                                    this.markView(guide, results[0])
                            },
                            () => {

                            }
                        );
                    }

                }
            });
    }

    public showGuide(guide: pip.guidance.Guide): void {
        if (guide) {
            this.pipGuidance.showGuide(
                guide,
                this.pipTranslate.language,
                () => {

                },
                () => {

                }
            );
        }
    }

    // show content related guide
    public showContentGuide(key: string, successCallback?: () => void, errorCallback?: () => void): void {

    }

    // show intofuction
    public showIntroduction(successCallback?: () => void, errorCallback?: () => void): void {

    }

    public read(successCallback?: (data: pip.guidance.Guide[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('read');

        return this.pipGuideData.readGuides(
            {
                app: this.APP_NAME,
                status: GuideStatus.Completed
            },
            (data: DataPage<pip.guidance.Guide>) => {
                // take last realese
                let ReleaseGuide: pip.guidance.Guide = this.getLastReleaseGuide(data.data);
                // take last intro
                let IntroGuide: pip.guidance.Guide = this.getLastIntroGuide(data.data);
                // take other
                this.guides = this.getHelpGuide(data.data);

                if (ReleaseGuide) this.guides.unshift(ReleaseGuide);
                if (IntroGuide) this.guides.unshift(IntroGuide);

                this.setState();
                this.transaction.end();
                successCallback(data.data);
            },
            (error: any) => {
                this.setState();
                this.transaction.end(error);
                errorCallback(error);
            }
        );
    }

    private setState() {
        this._state = (this.guides && this.guides.length > 0) ? States.Data : States.Empty;
    }

    // data operation
    public get(): pip.guidance.Guide[] {
        return this.guides;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public reload(successCallback?: (data: pip.guidance.Guide[]) => void, errorCallback?: (error: any) => void) {
        this.guides = new Array();
        this._state = States.Progress;
        this.read(successCallback, errorCallback);
    }

    public get state(): string {
        return this._state;
    }

    public set state(value: string) {
        if (value) {
            this._state = value;
        }
    }

    public cleanUp(): void {
        this.guides = [];
        this.state = States.Empty;
    }

}