import '../../services/type_collections/TypeCollectionsService';

import { IObjectFormatService } from './IObjectFormatService';
import { ControlObject } from '../../data';
import { ITypeCollectionsService, TypeCollection } from '../../services';

(() => {

    class ObjectFormatService implements IObjectFormatService {


        constructor(
            private pipTranslate: pip.services.ITranslateService,
            private iqsTypeCollectionsService: ITypeCollectionsService
        ) {

        }

        public formatSubtitle(item: ControlObject): string {
            let result: string = '';

            if (!item) return result;

            if (item.description) {
                return item.description;
            }

            let objectTypeCollection: TypeCollection = this.iqsTypeCollectionsService.getObjectType();
            if (item.type && objectTypeCollection[item.type]) {
                return this.pipTranslate.translate(objectTypeCollection[item.type].title)
            }

            return result;
        }

    }

    angular
        .module('iqsFormats.Object', ['iqsTypeCollections.Service'])
        .service('iqsObjectFormat', ObjectFormatService);
})();