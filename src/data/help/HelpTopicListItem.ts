import { HelpTopicTreeItem } from './HelpTopicTreeItem';

export class HelpTopicListItem extends HelpTopicTreeItem {
    public sub_topics_count?: number;
    public listIndex?: number;
    public level?: number;
    public showCurrent?: boolean;
}