import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface IqsAskDialogData {
    title: string;
    content: string[];
    actions: {
        [action_name: string]: {
            text: string;
            returnValue: any;
            color?: string;
        }
    };
    initFocusActionKey?: string;
}

@Component({
    selector: 'iqs-ask-dialog',
    templateUrl: './ask-dialog.component.html',
    styleUrls: ['./ask-dialog.component.scss']
})
export class IqsAskDialogComponent {

    public keys: string[];
    public initFocusKey: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: IqsAskDialogData,
        private dialogRef: MatDialogRef<IqsAskDialogComponent>
    ) {
        this.keys = Object.keys(this.data.actions).filter(key => this.data.actions.hasOwnProperty(key));
        if (this.keys.length) {
            if (this.data.initFocusActionKey && this.data.actions.hasOwnProperty(this.data.initFocusActionKey)) {
                this.initFocusKey = this.data.initFocusActionKey;
            } else {
                this.initFocusKey = this.keys[this.keys.length - 1];
            }
        }
    }

    public onClose(key: string) {
        this.dialogRef.close(this.data.actions[key].returnValue);
    }
}
