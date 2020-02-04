import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { sessionReducer } from './store/session.reducer';
import { SessionEffects } from './store/session.effects';
import { IqsSessionDataService } from './services/session.data.service';
import { IqsSessionService } from './services/session.service';

@NgModule({
  imports: [
    // Angular and vendors
    CommonModule,
    StoreModule.forFeature('auth', sessionReducer),
    EffectsModule.forFeature([SessionEffects]),
  ],
  declarations: [],
  providers: [
    IqsSessionDataService,
    IqsSessionService
  ]
})
export class IqsSessionModule { }
