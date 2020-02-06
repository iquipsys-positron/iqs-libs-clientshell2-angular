import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { IqsControlObjectsDataService } from './services/control-objects.data.service';
import { IqsControlObjectsService } from './services/control-objects.service';
import { controlObjectsReducer } from './store/control-objects.reducer';
import { ControlObjectsEffects } from './store/control-objects.effects';

import { IqsCurrentObjectStatesDataService } from './services/current-object-states.data.service';
import { IqsCurrentObjectStatesService } from './services/current-object-states.service';
import { currentObjectStatesReducer } from './store/current-object-states.reducer';
import { CurrentObjectStatesEffects } from './store/current-object-states.effects';

import { IqsObjectGroupsDataService } from './services/object-groups.data.service';
import { IqsObjectGroupsService } from './services/object-groups.service';
import { objectGroupsReducer } from './store/object-groups.reducer';
import { ObjectGroupsEffects } from './store/object-groups.effects';


@NgModule({
    imports: [
        // Angular and vendors
        StoreModule.forFeature('objects', controlObjectsReducer),
        StoreModule.forFeature('object_groups', objectGroupsReducer),
        StoreModule.forFeature('current_object_states', currentObjectStatesReducer),
        EffectsModule.forFeature([ControlObjectsEffects]),
        EffectsModule.forFeature([ObjectGroupsEffects]),
        EffectsModule.forFeature([CurrentObjectStatesEffects]),
    ],
    providers: [
        IqsControlObjectsDataService,
        IqsCurrentObjectStatesDataService,
        IqsObjectGroupsDataService,

        IqsControlObjectsService,
        IqsCurrentObjectStatesService,
        IqsObjectGroupsService,
    ]
})
export class IqsObjectsModule { }
