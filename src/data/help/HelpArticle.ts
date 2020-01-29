import { HelpArticleContent } from './HelpArticleContent';

export class HelpArticle {
    /* Identification */
    public id: string;
    public topic_id?: string;
    public app: string;
    public index?: number;
    public min_ver?: number;
    public max_ver?: number;

    /* Auto-generated fields */
    public create_time?: Date;

    /* Content */
    public content: HelpArticleContent[];
    
    /* Search */
    public tags?: string[];
    public all_tags?: string[];

    /* Status */
    public status?: string;
   
    /* Custom fields */
    public custom_hdr?: any;
    public custom_dat?: any;
}