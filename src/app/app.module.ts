import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
    IqsShellModule,
    IqsShellContainerComponent
} from 'iqs-libs-clientshell2-angular';
import { mockProvidersAndServices } from 'iqs-libs-clientshell2-angular/mock';

import { AppRoutingModule } from './app-routing.module';
import { AnotherPageModule } from './another-page/another-page.module';
import { ExamplePageModule } from './example-page/example-page.module';
import { environment } from '../environments/environment';

@NgModule({
    imports: [
        // Angular and vendors
        BrowserModule,
        BrowserAnimationsModule,
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
        // iqs-clients2
        IqsShellModule.forRoot({
            session: {
                // serverUrl: 'http://api.positron.stage.iquipsys.net:30018',
                autorizedUrl: '/example'
            }
        }),
        // application modules
        AnotherPageModule,
        AppRoutingModule,
        ExamplePageModule
    ],
    providers: mockProvidersAndServices,
    bootstrap: [IqsShellContainerComponent]
})
export class AppModule { }
