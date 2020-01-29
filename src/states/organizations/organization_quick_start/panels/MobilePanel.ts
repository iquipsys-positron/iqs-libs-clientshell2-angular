import {
    IControlObjectsDataService,
    ControlObject,
    DataPage,
    Device,
    DeviceStatus,
    DeviceType,
    ObjectType,
    ObjectCategory,
    Organization
} from "../../../../data";
import { IDevicesViewModel, IObjectsViewModel } from '../../../../models';
import { ITypeCollectionsService, TypeCollection } from '../../../../services';
import { IValidatorsService } from '../../../../validators';


interface IMobilePanelBindings {
    [key: string]: any;

    onNext: any;
    onAddPhone: any;
    organization: any;
    ngDisabled: any;
}

const MobilePanelBindings: IMobilePanelBindings = {
    onNext: '&iqsNext',
    onAddPhone: '&iqsAddPhone',
    organization: '<?iqsOrganization',
    ngDisabled: '&?'
}

class MobilePanelChanges implements ng.IOnChangesObject, IMobilePanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onNext: ng.IChangesObject<() => ng.IPromise<void>>;
    onAddPhone: ng.IChangesObject<() => ng.IPromise<void>>;
    organization: ng.IChangesObject<Organization>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class MobilePanelController implements ng.IController {
    public $onInit() { }
    public organization: Organization;
    public object: ControlObject = <ControlObject>{
        type: ObjectType.Employee,
        category: ObjectCategory.People
    };
    public device: Device = <Device>{
        type: DeviceType.Smartphone
    };

    public onNext: () => void;
    public onAddPhone: () => void;
    public ngDisabled: () => boolean;

    public form: any;
    public touchedErrorsWithHint: Function;
    public categoryCollection: TypeCollection;
    public typeCollection: any[];
    public isQuery: boolean = false;
    public transaction: pip.services.Transaction;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $scope: ng.IScope,
        private $timeout: ng.ITimeoutService,
        public pipMedia: pip.layouts.IMediaService,
        private pipFormErrors: pip.errors.IFormErrorsService,
        private iqsTypeCollectionsService: ITypeCollectionsService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsDevicesViewModel: IDevicesViewModel,
        private iqsControlObjectsData: IControlObjectsDataService,
        private iqsValidatorsService: IValidatorsService
    ) {
        "ngInject";

        $element.addClass('iqs-mobile-panel');
        this.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
        iqsTypeCollectionsService.init();
        this.categoryCollection = iqsTypeCollectionsService.getObjectCategory();
        this.transaction = pipTransaction.create('create_invitation');
    }

    public $postLink() {
        this.form = this.$scope.form;
    }

    private prepare() {
        this.filterTypeCollection();
    }

    public filterTypeCollection() {
        let typeCollection = [];
        _.values(this.iqsTypeCollectionsService.getObjectType()).forEach(element => {
            if (element.id == ObjectType.Other) {
                typeCollection.push(element);
            }
            if (this.object.category == ObjectCategory.People) {
                if (element.id == ObjectType.Employee || element.id == ObjectType.Contractor || element.id == ObjectType.Visitor) {
                    typeCollection.push(element);
                }
            }
            if (this.object.category == ObjectCategory.Asset) {
                if (element.id == ObjectType.Pump ||
                    element.id == ObjectType.Generator ||
                    element.id == ObjectType.Crane ||
                    element.id == ObjectType.ForkLift ||
                    element.id == ObjectType.AccessPoint ||
                    element.id == ObjectType.Welding) {
                    typeCollection.push(element);
                }
            }
            if (this.object.category == ObjectCategory.Equipment) {
                if (element.id == ObjectType.Excavator || element.id == ObjectType.HaulTruck ||
                    element.id == ObjectType.Drill ||
                    element.id == ObjectType.Dozer ||
                    element.id == ObjectType.Grader ||
                    element.id == ObjectType.Bus ||
                    element.id == ObjectType.WaterTruck ||
                    element.id == ObjectType.BlastTruck ||
                    element.id == ObjectType.SpecialVehicle ||
                    element.id == ObjectType.Locomotive ||
                    element.id == ObjectType.Dumpcar ||
                    element.id == ObjectType.LightVehicle) {
                    typeCollection.push(element);
                }
            }
        });

        this.typeCollection = typeCollection;
    }

    public $onChanges(changes: MobilePanelChanges): void {
        this.prepare();
    }

    public onSkip() {
        if (this.onNext) {
            this.onNext();
        }
    }

    private checkDublicat(data, callback) {
        if (!data || !data.data || data.data.length == 0) {

            callback();
        } else {

            let name: string = this.object.name.toLocaleLowerCase();
            let index: number = _.findIndex(data.data, (item: ControlObject) => {
                return item.name && item.name.toLocaleLowerCase() == name;
            });

            if (index != -1) {
                // set error
                if (this.form && this.form.object_name) {
                    this.form.$submitted = true;
                    this.form['object_name'].$dirty = true;
                    this.form.object_name.$setValidity('uniqueValidate', false);
                }

                callback(new Error('Object name is present'));
            } else {
                callback();
            }
        }
    }

    public onSavePhone(): void {
        // todo save
        if (this.form.$invalid) {
            this.pipFormErrors.resetFormErrors(this.form, true);

            return;
        }
        this.transaction.begin('save');
        this.object.org_id = this.organization.id;
        switch (this.object.category) {
            case (ObjectCategory.People): {
                this.object.type = ObjectType.Employee;
                break;
            }
            case (ObjectCategory.Asset): {
                this.object.type = ObjectType.Other;
                break;
            }
            case (ObjectCategory.Equipment): {
                this.object.type = ObjectType.LightVehicle;
                break;
            }
        }
        this.device.org_id = this.organization.id
        this.device.status = DeviceStatus.Active;
        async.series([
            // check object name
            (seriesCallback) => {
                this.iqsControlObjectsData.readControlObjects(
                    {
                        org_id: this.organization.id
                    },
                    (data: DataPage<ControlObject>) => {
                        this.checkDublicat(data, seriesCallback)
                    },
                    (error: any) => {
                        seriesCallback(error);
                    });
            },
            (seriesCallback) => {
                async.parallel([
                    // save objec
                    (callback) => {
                        this.iqsObjectsViewModel.saveObject(
                            this.object,
                            (item) => {
                                this.object = item;
                                callback();
                            },
                            (error) => {
                                callback(error);
                            });
                    },
                    // save device
                    (callback) => {
                        this.iqsDevicesViewModel.saveDevice(
                            this.device,
                            (item) => {
                                this.device = item;
                                callback()
                            },
                            (error) => {
                                callback(error);
                            });
                    },
                ],
                    // optional callback
                    (error, results) => {
                        if (error) {
                            seriesCallback(error);
                        } else {
                            // link device and object
                            seriesCallback();
                        }
                    });
            },
            // link device and object
            (seriesCallback) => {
                this.device.object_id = this.object.id;
                this.iqsDevicesViewModel.updateDevice(
                    this.device,
                    (item) => {
                        this.device = item;
                        seriesCallback();
                    },
                    (error: any) => {
                        seriesCallback(error);
                    });
            },
        ],
            (error) => {
                // Error
                if (!error) {
                    this.transaction.end();
                    // todo: send sms!!!
                    if (this.onAddPhone) {
                        this.onAddPhone();
                    }
                } else {
                    //todo error
                    this.transaction.end(error);
                }
            });

        this.pipFormErrors.resetFormErrors(this.form, false);
    }

    public onChangeUdi() {
        if (!this.device.udi) { return }

        this.isQuery = true;
        this.iqsDevicesViewModel.verifyDeviceUdi(
            {
                udi: this.device.udi,
                org_id: this.organization.id
            },
            (data) => {
                if (this.form) {
                    if (!this.form.phone) return;

                    if (!data) {
                        this.form.phone.$setValidity('verifyDeviceUdi', true);
                    } else {
                        this.form.phone.$setValidity('verifyDeviceUdi', false);
                    }
                }
                this.isQuery = false;
            },
            (err) => {
                // this.error = err;
                this.isQuery = false;
            });
    }
}

(() => {
    angular
        .module('iqsMobilePanel', ['iqsValidatorsService'])
        .component('iqsMobilePanel', {
            bindings: MobilePanelBindings,
            // templateUrl: 'states/organizations/organization_quick_start/panels/MobilePanel.html',
            controller: MobilePanelController,
            controllerAs: '$ctrl',
            template: `
                <form name="form" novalidate autocomplete="off">
                    <div class="pip-body {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }}">

                        <h2 class="text-center bm24 lm24 rm24">
                            {{:: 'SITES_QUICK_START_ADD_MOBILE_TITLE' | translate}}
                        </h2>

                        <md-input-container class="md-block flex bm0">
                            <label>{{::'DEVICE_UDI_PHONE' | translate}}</label>
                            <input iqs-test-udi ng-model="$ctrl.device.udi" required aria-label="PHONE" ng-change="$ctrl.onChangeUdi()"
                                   iqs-phone-validator ng-change="$ctrl.error=''" name="phone" ng-disabled="$ctrl.transaction.busy()">

                            <div class="hint" ng-if="!$ctrl.touchedErrorsWithHint($ctrl.form, $ctrl.form.phone, true)">
                                {{::'DEVICE_UDI_HINT_PHONE' | translate}}
                            </div>

                            <div ng-messages="$ctrl.touchedErrorsWithHint($ctrl.form, $ctrl.form.phone, true)" role="alert">
                                <div ng-message="required">{{ 'DEVICE_UDI_PHONE_REQUIRED_ERROR' | translate }}</div>
                                <div ng-message="phoneValidate">{{ 'DEVICE_UDI_PHONE_VALIDATE_ERROR' | translate }}</div>
                                <div ng-message="verifyDeviceUdi">{{ 'DEVICE_UDI_NOT_UNIQUE' | translate }}</div>
                            </div>
                        </md-input-container>

                        <md-input-container class="md-block flex bm24">
                            <label>{{::'CATEGORY'| translate}}</label>
                            <md-select iqs-test-category ng-model="$ctrl.object.category" ng-change="$ctrl.filterTypeCollection()"
                                       required aria-label="CATEGORY" name="category" ng-disabled="$ctrl.transaction.busy()">
                                <md-option iqs-test-option-category ng-repeat="type in $ctrl.categoryCollection track by type.id"
                                           ng-value="type.id">
                                    {{::type.title | translate}}
                                </md-option>
                            </md-select>

                            <div ng-messages="$ctrl.touchedErrorsWithHint($ctrl.form, $ctrl.form.category, true)" role="alert">
                                <div ng-message="required">{{ 'OBJECT_CATEGORY_REQUIRED_ERROR' | translate }}</div>
                            </div>
                        </md-input-container>

                        <!-- <md-input-container class="md-block flex bm24">
                            <label>{{::'TYPE'| translate}}</label>
                            <md-select iqs-test-type ng-model="$ctrl.object.type" required aria-label="TYPE" name="object_type" ng-disabled="$ctrl.transaction.busy()">
                                <md-option iqs-test-option-type ng-repeat="type in $ctrl.typeCollection  track by type.id" ng-value="type.id">
                                    {{::type.title | translate}}
                                </md-option>
                            </md-select>

                            <div ng-messages="$ctrl.touchedErrorsWithHint($ctrl.form, $ctrl.form.object_type, true)" role="alert">
                                <div ng-message="required">{{ 'OBJECT_TYPE_REQUIRED_ERROR' | translate }}</div>
                            </div>
                        </md-input-container> -->

                        <md-input-container class="md-block flex">
                            <label ng-if="$ctrl.object.category != 'person'">{{::'CONFIG_OBJECT_NAME' | translate}}</label>
                            <label ng-if="$ctrl.object.category == 'person'">{{::'CONFIG_PERSON_NAME' | translate}}</label>
                            <input iqs-test-name ng-model="$ctrl.object.name" required ng-disabled="$ctrl.transaction.busy()"
                                   aria-label="OBJECT_NAME" name="object_name" pip-clear-errors>

                            <div ng-messages="$ctrl.touchedErrorsWithHint($ctrl.form, $ctrl.form.object_name, true)" role="alert">
                                <div ng-message="required">
                                    <span ng-show="$ctrl.object.category != 'person'">
                                        {{ 'OBJECT_NAME_REQUIRED_ERROR' | translate }}
                                    </span>
                                    <span ng-show="$ctrl.object.category == 'person'">
                                        {{ 'OBJECT_PERSON_NAME_REQUIRED_ERROR' | translate }}
                                    </span>
                                </div>
                                <div ng-message="uniqueValidate">{{ 'SITE_CREATE_OBJECT_NAME_UNIQUE_ERROR' | translate }}</div>
                            </div>
                        </md-input-container>

                        <md-input-container class="md-block flex">
                            <label ng-if="$ctrl.object.category == 'person'">{{::'SETTINGS_BASIC_INFO_DESCRIPTION' | translate}}</label>
                            <label ng-if="$ctrl.object.category != 'person'">{{::'OBJECTS_EDIT_DESCRIPTION_ASSET' | translate}}</label>
                            <input iqs-test-description ng-model="$ctrl.object.description" ng-disabled="$ctrl.transaction.busy()">
                        </md-input-container>


                    </div>
                    <div class="pip-footer {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }} tp0">
                        <div ng-if="!$ctrl.pipMedia('gt-sm')">
                            <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm0 tm16" ng-disabled="$ctrl.transaction.busy()"
                                       ng-click="$ctrl.onSkip()">
                                {{ ::'SITES_QUICK_START_MOBILE_SKIP_BUTTON' | translate }}
                            </md-button>
                            <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm0 rm0 bm0" ng-disabled="$ctrl.transaction.busy()"
                                       ng-click="$ctrl.onSavePhone()">
                                {{ ::'SITES_QUICK_START_MOBILE_CREATE_BUTTON' | translate }}
                            </md-button>
                        </div>
                        <div class="layout-row layout-align-start-center tm16" ng-if="$ctrl.pipMedia('gt-sm')">
                            <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm8 bm0" ng-disabled="$ctrl.transaction.busy()"
                                       ng-click="$ctrl.onSkip()">
                                {{ ::'SITES_QUICK_START_MOBILE_SKIP_BUTTON' | translate }}
                            </md-button>
                            <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm8 rm0 bm0" ng-disabled="$ctrl.transaction.busy()"
                                       ng-click="$ctrl.onSavePhone()">
                                {{ ::'SITES_QUICK_START_MOBILE_CREATE_BUTTON' | translate }}
                            </md-button>
                        </div>

                    </div>

                </form>
            `
        })
})();
