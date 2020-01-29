import { States } from '../../common/States';
import {
    IControlObjectsDataService,
    ICurrentObjectStatesDataService,
    DataPage,
    ControlObject,
    ObjectCategory,
    ObjectState
} from '../../data';
import {
    IObjectConfigsService
} from '../../services';

export class ObjectParams {
    // skip: number = 0;
    total: boolean = true;
    // size: number = 100;
    type?: string;
}

export class AssociatedArray {
    [key: string]: ControlObject;
}

export class ObjectsModel {
    public state: string;
    public allObjects: ControlObject[];
    public objects: ControlObject[];
    public selectedIndex: number;
    public personsCount: number = 0;
    public devicesCount: number = 0;
    public assetsCount: number = 0;
    private transaction: pip.services.Transaction;
    private readonly THRESHOLD: number = 15 * 60 * 1000; // 15 min
    private selectedItem: ControlObject;
    private associatedArr: AssociatedArray = {};

    constructor(
        private $location: ng.ILocationService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsControlObjectsData: IControlObjectsDataService,
        protected iqsCurrentObjectStatesData: ICurrentObjectStatesDataService,
        private iqsObjectConfigs: IObjectConfigsService
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('OBJECTS');
    }

    private setState() {
        this.state = (this.objects && this.objects.length > 0) ? States.Data : States.Empty;
    }

    private sortCollection(data: ControlObject[]): ControlObject[] {
        let collection: ControlObject[] = _.sortBy(data, function (item: ControlObject) {
            return item.name ? item.name.toLocaleLowerCase() : '';
        });

        return collection;
    }

    public filterData(type: string): ControlObject[] {
        switch (type) {
            case ObjectCategory.People: {
                this.objects = _.filter(this.allObjects, (item: ControlObject) => {
                    return item.category == ObjectCategory.People ? true : false;
                })
                break;
            }
            case ObjectCategory.Equipment: {
                this.objects = _.filter(this.allObjects, (item: ControlObject) => {
                    return item.category == ObjectCategory.Equipment ? true : false;
                })
                break;
            }
            case ObjectCategory.Asset: {
                this.objects = _.filter(this.allObjects, (item: ControlObject) => {
                    return item.category == ObjectCategory.Asset ? true : false;
                })
                break;
            }
            default: {
                this.objects = this.allObjects;

            }
        }

        return this.objects;
    }

    public setCountsByType() {
        this.personsCount = 0;
        this.devicesCount = 0;
        this.assetsCount = 0;

        _.each(this.allObjects, (object) => {
            switch (object.category) {
                case ObjectCategory.People: {
                    this.personsCount++;
                    break;
                }
                case ObjectCategory.Equipment: {
                    this.devicesCount++;
                    break;
                }
                case ObjectCategory.Asset: {
                    this.assetsCount++;
                    break;
                }
            }
        });
    }

    private updateAssociationArray(): void {
        let array: AssociatedArray = {};
        _.each(this.allObjects, (item: ControlObject) => {
            array[item.id] = item;
        }) 

        this.associatedArr = array;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public filterWithArrayObjects(objects) {
        this.objects = _.filter(this.allObjects, (item: ObjectState) => {
            return _.findIndex(objects, { id: item.id }) != -1 ? true : false;
        });
        this.setState();
    }

    // read without transaction for objectStates
    public read(successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void) {
        let params: ObjectParams = new ObjectParams();
        this.iqsControlObjectsData.readControlObjects(
            params,
            (data: DataPage<ControlObject>) => {
                this.allObjects = this.sortCollection(data.data);
                this.updateAssociationArray();
                if (successCallback) successCallback(this.objects);
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public getObjects(type?: string, successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void) {
        this.state = States.Progress;
        let params: ObjectParams = new ObjectParams();
        // TODO: where are type use?
        this.transaction.begin('read');
        this.iqsControlObjectsData.readControlObjects(
            params,
            (data: DataPage<ControlObject>) => {
                this.allObjects = this.sortCollection(data.data);
                this.updateAssociationArray();
                if (type && type == 'all') {
                    this.objects = this.allObjects;
                } else {
                    this.objects = this.filterData(type);
                }

                this.getObjectsCallback();
                this.transaction.end();
                if (successCallback) successCallback(this.objects);
            },
            (error: any) => {
                this.transaction.end(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public selectItem(index?: number) {
        if (index === undefined || index === null || index < 0 || index > this.objects.length - 1) {
            let id: string = this.$location.search()['object_id'];
            if (id) {
                index = _.findIndex(this.objects, (item: ControlObject) => {
                    return item.id == id;
                });
            }
            if (!index || index == -1) {
                index = 0;
            }
        }

        if (this.objects.length > index) {
            this.selectedIndex = index;
        } else {
            this.selectedIndex = 0;
        }

        this.selectedIndex = index;

        this.selectedItem = (this.objects && this.objects.length > 0) ? this.objects[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('object_id', this.selectedItem.id);
        }
        this.setState();
    }

    public getAllObjects(successCallback?: (data: ControlObject[]) => void, errorCallback?: (error: any) => void) {
        this.getObjects('all', successCallback, errorCallback);
    }

    public isObjectActive(object: ControlObject, nowTime?: number): boolean {
        let utcNow = nowTime || new Date().getUTCMilliseconds();
        let time = moment(object.state.time).valueOf();

        return (utcNow - time < this.THRESHOLD);
    }

    private getObjectsCallback() {
        if (!this.$location.search()['object_id'] && this.iqsObjectConfigs.id) {
            this.$location.search('object_id', this.iqsObjectConfigs.id);
        }
        this.selectItem();

        if (this.state == States.Data && this.selectedIndex) {
            this.iqsObjectConfigs.id = this.objects[this.selectedIndex].id;
        }
        this.setCountsByType();
    }

    public getObjectById(objectId: string) {
        let item: ControlObject = this.associatedArr[objectId];

        if (!item) {
            // extra condition
            return _.find(this.allObjects, (object) => { return object.id === objectId; });
        } else {
            return item;
        }
    }

    public getObjectByName(name: string): string {
        if (!name) return null;

        let query = name.toLocaleLowerCase();

        let item: ControlObject = _.find(this.allObjects, (object) => { 
            return object.name ? object.name.toLocaleLowerCase() === name : false; 
        });

        return !item ? null : item.id;
    }

    private extendObject(object: ControlObject, data: ObjectState, callback?: (item: ControlObject) => void) {
        object.state = data;
        object.latitude = data.pos.coordinates[1];
        object.longitude = data.pos.coordinates[0];
        if (callback) {
            callback(object);
        }
        //object.icon = MapIcons[object.type];
    }

    public saveObject(data: ControlObject, callback?: (item: ControlObject) => void, errorCallback?: (err: any) => void) {
        this.transaction.begin('save');
        this.iqsControlObjectsData.saveControlObject(data,
            (item: ControlObject) => {
                if (!this.allObjects) this.allObjects = [];
                if (!this.objects) this.objects = [];
                this.allObjects.push(item);
                this.allObjects = this.sortCollection(this.allObjects);
                let index: number = _.findIndex(this.objects, { id: item.id });
                if (index == -1) {
                    this.objects.push(item);
                    this.objects = this.sortCollection(this.objects);
                }
                this.$location.search('object_id', item.id);
                this.updateAssociationArray();
                this.selectItem();
                this.transaction.end();
                if (callback) {
                    callback(item);
                }
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback(err);
                }
            })
    }

    public remove(id: string): void {
        _.remove(this.objects, { id: id });
        _.remove(this.allObjects, { id: id });
        this.setState();
    }

    public deleteObject(id: string, callback?: () => void, errorCallback?: () => void) {
        this.transaction.begin('delete');
        let index: number;
        if (this.selectedItem && this.selectedItem.id == id) {
            index = this.selectedIndex < this.objects.length - 1 ? this.selectedIndex : this.selectedIndex - 1;
        } else {
            index = this.selectedIndex;
        }        
        this.iqsControlObjectsData.deleteControlObject(id,
            (item) => {
                this.remove(id);
                this.updateAssociationArray();
                this.selectItem(index);
                this.transaction.end();
                if (callback) {
                    callback();
                }
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback();
                }
            })
    }

    public updateObject(data: ControlObject, callback?: (item) => void, errorCallback?: (err) => void) {
        this.transaction.begin('update');
        this.iqsControlObjectsData.updateControlObject(data.id, data,
            (item: ControlObject) => {
                let localIndex: number;
                let index: number = _.findIndex(this.objects, { id: item.id });

                if (index > -1) {
                    let object: ControlObject = _.cloneDeep(this.objects[index]);
                    if (item.device_id && object.device_id != item.device_id) {
                        localIndex = _.findIndex(this.objects, { device_id: item.device_id });

                        if (localIndex != index && localIndex > -1) {
                            this.objects[localIndex].device_id = null;
                        }
                    }
                    this.objects[index] = item;
                    this.objects = this.sortCollection(this.objects);
                }

                index = _.findIndex(this.allObjects, { id: item.id });
                if (index > -1) {
                    if (item.device_id && this.allObjects[index].device_id != item.device_id) {
                        localIndex = _.findIndex(this.allObjects, { device_id: item.device_id })
                        if (localIndex != index && localIndex > -1) {
                            this.allObjects[localIndex].device_id = null;
                        }
                    }
                    this.allObjects[index] = item;
                    this.allObjects = this.sortCollection(this.allObjects);
                }
                this.$location.search('object_id', item.id);
                this.selectItem();
                this.updateAssociationArray();
                this.transaction.end();
                if (callback) {
                    callback(item);
                }
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback(err);
                }
            })
    }

    public clean(): void {
        this.allObjects = [];
        this.associatedArr = {};
        this.objects = [];
        this.state = States.Empty;
        this.selectedIndex = -1;
    }
}