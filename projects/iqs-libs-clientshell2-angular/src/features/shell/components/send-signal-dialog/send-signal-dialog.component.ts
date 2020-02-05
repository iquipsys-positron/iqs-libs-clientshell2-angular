import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDialogRef, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { find, uniq } from 'lodash';
import { Subscription, BehaviorSubject, Observable, throwError } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';

import { sendSignalDialogTranslateions } from './send-signal-dialog.strings';
import { ControlObject, ObjectGroup } from '../../../objects/models/index';
import { IqsControlObjectsService } from '../../../objects/services/control-objects.service';
import { IqsCurrentObjectStatesService } from '../../../objects/services/current-object-states.service';
import { IqsObjectGroupsService } from '../../../objects/services/object-groups.service';
import { IqsSessionConfigService } from '../../../session/services/session.config.service';
import { SignalType } from '../../../signals/models/index';
import { IqsSignalsSendService } from '../../../signals/services/signals.send.service';
import { Zone } from '../../../zones/models/index';
import { IqsZonesService } from '../../../zones/services/zones.service';

@Component({
    selector: 'iqs-send-signal-dialog',
    templateUrl: './send-signal-dialog.component.html',
    styleUrls: ['./send-signal-dialog.component.scss']
})
export class IqsSendSignalDialogComponent implements OnInit, OnDestroy {

    private subs: Subscription;

    public form: FormGroup;
    public listType = 'objects';
    public loading$: BehaviorSubject<boolean>;
    public signalTypes: { title: string, value: number }[];
    public objects: ControlObject[] = [];
    public allObjects: ControlObject[] = [];
    public filteredObjects$: Observable<ControlObject[]>;
    public groups: ObjectGroup[] = [];
    public allGroups: ObjectGroup[] = [];
    public filteredGroups$: Observable<ObjectGroup[]>;
    public zones: Zone[] = [];
    public allZones: Zone[] = [];
    public filteredZones$: Observable<any[]>;
    public serverUrl: string;

    @ViewChild('objectInput') objectInput: ElementRef<HTMLInputElement>;
    @ViewChild('zoneInput') zoneInput: ElementRef<HTMLInputElement>;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<IqsSendSignalDialogComponent>,
        private currentObjectStatesService: IqsCurrentObjectStatesService,
        private objectsService: IqsControlObjectsService,
        private objectGroupsService: IqsObjectGroupsService,
        private sessionConfigService: IqsSessionConfigService,
        private snackBar: MatSnackBar,
        private signalsSend: IqsSignalsSendService,
        private translate: TranslateService,
        private zonesService: IqsZonesService
    ) {
        this.subs = new Subscription();
        this.loading$ = new BehaviorSubject(false);
        this.translate.setTranslation('en', sendSignalDialogTranslateions.en, true);
        this.translate.setTranslation('ru', sendSignalDialogTranslateions.ru, true);

        this.signalTypes = Object.entries(SignalType)
            .filter(e => Number.isNaN(parseInt(e[0], 10)) && parseInt(e[1], 10) > 0)
            .map(e => ({ title: 'SIGNAL_TYPE_' + e[0].toUpperCase(), value: e[1] }));
        this.form = this.fb.group({
            type: [SignalType.Attention],
            object: [''],
            zone: ['']
        });
        this.subs.add(this.objectsService.objects$.subscribe(data => {
            this.allObjects = data;
        }));
        this.subs.add(this.objectGroupsService.groups$.subscribe(data => {
            this.allGroups = data;
        }));
        this.subs.add(this.zonesService.zones$.subscribe(data => {
            this.allZones = data;
        }));
        this.filteredObjects$ = this.form.get('object').valueChanges.pipe(
            startWith(null),
            map(obj => typeof obj === 'string' ? this._filterObjects(obj) : this.allObjects.slice())
        );
        this.filteredGroups$ = this.form.get('object').valueChanges.pipe(
            startWith(null),
            map(obj => typeof obj === 'string' ? this._filterGroups(obj) : this.allGroups.slice())
        );
        this.filteredZones$ = this.form.get('zone').valueChanges.pipe(
            startWith(null),
            map(obj => typeof obj === 'string' ? this._filterZones(obj) : this.allZones.slice())
        );
        this.serverUrl = this.sessionConfigService.serverUrl;
    }

    ngOnInit() {
        this.objectsService.init();
        this.objectGroupsService.init();
        this.zonesService.init();
        this.currentObjectStatesService.init();
        this.currentObjectStatesService.startLive();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
        this.currentObjectStatesService.stopLive();
    }

    public remove(type: string, obj: ControlObject): void {
        let src;
        switch (type) {
            case 'object':
                src = this.objects;
                break;
            case 'zone':
                src = this.zones;
                break;
        }
        const index = src.indexOf(obj);

        if (index >= 0) {
            src.splice(index, 1);
        }
    }

    public selected(event: MatAutocompleteSelectedEvent): void {
        const [type, value] = event.option.value;
        switch (type) {
            case 'object':
                this.objects.push(value);
                this.objectInput.nativeElement.value = '';
                this.form.get('object').setValue(null);
                break;
            case 'group':
                this.groups.push(value);
                this.objectInput.nativeElement.value = '';
                this.form.get('object').setValue(null);
                break;
            case 'zone':
                this.zones.push(value);
                this.zoneInput.nativeElement.value = '';
                this.form.get('zone').setValue(null);
                break;
        }
    }

    public onSubmit() {
        const zoneIds = this.zones.map(zone => zone.id);
        const objects = [...this.objects];
        let deviceIds = [];
        this.loading$.next(true);
        this.form.disable();
        for (const group of this.groups) {
            for (const oid of group.object_ids) {
                const obj = find(this.allObjects, ['id', oid]);
                if (obj) { objects.push(obj); }
            }
        }
        for (const obj of objects) {
            if (obj.device_id) { deviceIds.push(obj.device_id); }
        }
        this.currentObjectStatesService.states$.pipe(
            switchMap(states => {
                for (const state of states) {
                    if (!state.zones || !state.zones.length || !state.device_id) { continue; }
                    for (const zone of state.zones) {
                        if (zoneIds.includes(zone.zone_id)) {
                            deviceIds.push(state.device_id);
                        }
                    }
                }
                deviceIds = uniq(deviceIds);
                if (!deviceIds.length) { return throwError(this.translate.instant('SEND_SIGNAL_ERROR_EMPTY')); }
                return this.signalsSend.sendBatch(deviceIds, this.form.get('type').value);
            })
        ).subscribe(() => {
            this.loading$.next(false);
            this.snackBar.open(
                this.translate.instant('SEND_SIGNAL_SUCCESS'),
                'OK',
                { horizontalPosition: 'left', verticalPosition: 'bottom', duration: 2000 }
            );
            this.dialogRef.close();
        }, (error) => {
            this.loading$.next(false);
            this.form.enable();
            let message: string;
            if (error.code) {
                if (error.code === 'UNKNOWN') { message = this.translate.instant('SEND_SIGNAL_ERROR_UNKNOWN'); }
            } else {
                message = error;
            }
            this.snackBar.open(
                message,
                undefined,
                { horizontalPosition: 'left', verticalPosition: 'bottom', duration: 2000, panelClass: 'pip-error-snackbar' }
            );
        });
    }

    public get disableSendButton(): boolean {
        return (!this.objects.length && !this.groups.length && !this.zones.length) || this.loading$.getValue();
    }

    private _filterObjects(val: string): ControlObject[] {
        const filterValue = val.toLowerCase();

        return this.allObjects.filter(obj => obj.name.toLowerCase().indexOf(filterValue) >= 0);
    }

    private _filterGroups(val: string): ObjectGroup[] {
        const filterValue = val.toLowerCase();

        return this.allGroups.filter(group => group.name.toLowerCase().indexOf(filterValue) >= 0);
    }

    private _filterZones(val: string): Zone[] {
        const filterValue = val.toLowerCase();

        return this.allZones.filter(obj => obj.name.toLowerCase().indexOf(filterValue) >= 0);
    }
}
