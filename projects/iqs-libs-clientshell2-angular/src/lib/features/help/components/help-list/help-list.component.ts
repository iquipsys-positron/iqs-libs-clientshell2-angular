import { Component, Input, Output, EventEmitter } from '@angular/core';

import { HelpArticle, HelpTopic } from '../../models/index';

@Component({
    selector: 'iqs-help-list',
    templateUrl: './help-list.component.html',
    styleUrls: ['./help-list.component.scss']
})
export class HelpListComponent {

    @Input() items: HelpArticle[] | HelpTopic[];
    @Input() language: string;

    @Output() select = new EventEmitter<HelpArticle | HelpTopic>();

    constructor() { }

    public onSelect(item: HelpArticle | HelpTopic) {
        this.select.emit(item);
    }

}
