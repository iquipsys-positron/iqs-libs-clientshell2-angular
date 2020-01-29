export interface IShellService {
    hideNav: string[];
    hideBar: string[];
    hideAux: string[];
    // showEmmergencyPlan: boolean; 
    addOrganizations: string;
    panel: string;
    hideMain(): string[];
}

export interface IShellProvider {
    hideNav: string[];
    hideBar: string[];
    hideAux: string[];
    addOrganizations: string;
    addHideBar(value: string);
    addHideNav(value: string);
    addHideAux(value: string);
}