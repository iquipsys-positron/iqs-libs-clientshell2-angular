import { LoadingStatus } from "./LoadingStatus";

export interface ILoadingService {
    isLoading: boolean;
    isDone: boolean;
    completed: number;
    total: number;
    progress: number;
    status: LoadingStatus;
    start(callback?: Function): void;
    restart(callback?: Function): void;
    reset(): void;
    clean(): void;
    push(name: string, cleanFn: Function[], asyncFn: Function, asyncQueue: Function[], asyncAlways?: (cb: any, error?: any, results?: any) => void): void;
    
}

export interface ILoadingProvider {
    
}
