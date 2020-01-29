export interface IDemoService {
    demo_en: any;
    demo_ru: any;
    
    setDemoParams(): void;
    signin(): void;
    isDemoUser(identity: pip.entry.SessionData): boolean;
}
