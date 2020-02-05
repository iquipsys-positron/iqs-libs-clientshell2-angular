import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { IqsAskDialogComponent, IqsAskDialogData } from 'iqs-libs-clientshell2-angular';
import { PipNavService } from 'pip-webui2-nav';

import { anotherPageTranslations } from './another-page.strings';

@Component({
    selector: 'iqs-another-page',
    templateUrl: './another-page.component.html',
    styleUrls: ['./another-page.component.scss']
})
export class AnotherPageComponent implements OnInit {

    constructor(
        private dialog: MatDialog,
        private navService: PipNavService,
        private translate: TranslateService
    ) {
        this.navService.showBreadcrumb({
            items: [{ title: 'title' }]
        });
        this.translate.setTranslation('en', anotherPageTranslations.en, true);
        this.translate.setTranslation('ru', anotherPageTranslations.ru, true);
    }

    ngOnInit() {
    }

    public openDialog(isFirst?: boolean) {
        const data = isFirst
            ? <IqsAskDialogData>{
                title: 'first_dialog_title',
                content: [
                    'first_dialog_content_1',
                    'first_dialog_content_2'
                ],
                actions: {
                    cancel: {
                        text: 'first_dialog_action_cancel',
                        returnValue: false
                    },
                    ok: {
                        text: 'first_dialog_action_ok',
                        returnValue: true,
                        color: 'primary'
                    }
                }
            }
            : <IqsAskDialogData>{
                title: 'second_dialog_title',
                content: [
                    'second_dialog_content_1',
                    'second_dialog_content_2',
                    'second_dialog_content_3'
                ],
                actions: {
                    yes: {
                        text: 'second_dialog_action_yes',
                        returnValue: 100,
                        color: 'primary'
                    },
                    maybe: {
                        text: 'second_dialog_action_maybe',
                        returnValue: 50,
                        color: 'accent'
                    },
                    no: {
                        text: 'second_dialog_action_no',
                        returnValue: 0,
                        color: 'warn'
                    }
                },
                initFocusActionKey: 'maybe'
            };
        this.dialog.open(IqsAskDialogComponent, { data }).afterClosed().subscribe(ret => {
            const res = this.translate.instant('you_choosed', {
                res: this.translate.instant(
                    isFirst
                        ? (ret === data.actions.ok.returnValue ? 'first_dialog_action_ok' : 'first_dialog_action_cancel')
                        : (ret === data.actions.yes.returnValue
                            ? 'second_dialog_action_yes'
                            : (ret === data.actions.maybe.returnValue ? 'second_dialog_action_maybe' : 'second_dialog_action_no'))
                )
            });
            const subData = <IqsAskDialogData>{
                title: 'result_dialog_title',
                content: [res],
                actions: {
                    ok: {
                        text: 'result_dialog_action_ok',
                        returnValue: true,
                        color: 'accent'
                    }
                }
            };
            this.dialog.open(IqsAskDialogComponent, { data: subData });
        });
    }

    public openSecondDialog() {

    }
}
