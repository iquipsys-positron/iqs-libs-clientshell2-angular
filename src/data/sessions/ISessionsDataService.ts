export interface ISessionsDataService {
    readSessions(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    // createSession(data: Session, successCallback?: (data: Session) => void, errorCallback?: (error: any) => void): void;
    // readSession(id: string, successCallback?: (data: Session) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    // updateSession(id: string, data: Session, successCallback?: (data: Session) => void, errorCallback?: (error: any) => void): void;
    // deleteSession(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    deleteSession(params: any, successCallback?:() => void, errorCallback?: (error: any) => void): void;
}

export interface ISessionsDataProvider {

}


