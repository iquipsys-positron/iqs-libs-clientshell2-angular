export enum LoadingStatus {
    // loading didn't started or reseted
    Empty = 'empty',
    // loading progress started in any way
    Progress = 'progress',
    // loading completed partially
    Breaked = 'breaked',
    // loading completed
    Completed = 'completed',
    // loading error
    Error = 'error'
}