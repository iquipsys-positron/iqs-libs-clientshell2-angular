import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatProgressBarModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { PipButtonToggleGroupModule } from 'pip-webui2-buttons';
import {
    PipAppbarModule,
    PipMainLayoutAltModule,
    PipRootLayoutModule,
    PipShadowModule,
} from 'pip-webui2-layouts';
import {
    PipBreadcrumbModule,
    PipNavIconModule,
    PipPrimaryActionsModule,
    PipSecondaryActionsModule,
} from 'pip-webui2-nav';
import { PipPictureModule } from 'pip-webui2-pictures';

import { IqsShellContainerComponent } from './shell-container.component';
import { IqsSidenavModule, IqsSendSignalDialogComponent } from '../components/index';
import { IqsApplicationsModule } from '../../applications/index';
import { IqsEmergencyModule } from '../../emergency/emergency.module';
import { IqsHelpModule } from '../../help/index';
import { IqsObjectsModule } from '../../objects/index';
import { IqsSignalsModule } from '../../signals/index';
import { IqsZonesModule } from '../../zones/index';

@NgModule({
    declarations: [IqsShellContainerComponent, IqsSendSignalDialogComponent],
    entryComponents: [IqsSendSignalDialogComponent],
    exports: [IqsShellContainerComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        // pip-suite2 & pip-webui2
        PipAppbarModule.forRoot(),
        PipBreadcrumbModule,
        PipButtonToggleGroupModule,
        PipMainLayoutAltModule,
        PipNavIconModule,
        PipPictureModule,
        PipPrimaryActionsModule,
        PipRootLayoutModule,
        PipShadowModule,
        PipSecondaryActionsModule,
        // iqs-clients2
        IqsApplicationsModule,
        IqsEmergencyModule.forRoot(),
        IqsHelpModule.forRoot(),
        IqsSidenavModule,
        IqsObjectsModule,
        IqsSignalsModule,
        IqsZonesModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IqsShellContainerModule { }
