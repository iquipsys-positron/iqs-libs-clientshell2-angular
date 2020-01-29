import { HelpTopic } from './HelpTopic';

export class HelpTopicTreeItem extends HelpTopic {
    public super_topic: HelpTopicTreeItem[] = [];
    public sub_topic: HelpTopicTreeItem[] = [];
    public showTopic: boolean = false;
}