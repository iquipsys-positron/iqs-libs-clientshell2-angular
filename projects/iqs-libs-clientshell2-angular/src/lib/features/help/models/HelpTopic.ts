import { HelpArticle } from './HelpArticle';
import { MultiString } from '../../../common/index';

export class HelpTopic {
    title: MultiString;
    articles: HelpArticle[];
}
