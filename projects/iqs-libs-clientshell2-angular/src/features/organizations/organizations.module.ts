import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { organizationsReducer } from './store/organizations.reducer';
import { OrganizationsEffects } from './store/organizations.effects';
import { IqsOrganizationsDataService } from './services/organizations.data.service';
import { IqsOrganizationsService } from './services/organizations.service';

@NgModule({
  imports: [
    // Angular and vendors
    CommonModule,
    StoreModule.forFeature('organizations', organizationsReducer),
    EffectsModule.forFeature([OrganizationsEffects]),
  ],
  providers: [
    IqsOrganizationsDataService,
    IqsOrganizationsService
  ]
})
export class IqsOrganizationsModule {}
