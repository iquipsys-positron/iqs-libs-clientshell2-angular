export enum UserRole {
    user = 'user',
    manager = 'manager',
    admin = 'admin',
    unknown = 'unknown'
}

export const userRoleValue = {
    [UserRole.user]: 1,
    [UserRole.manager]: 2,
    [UserRole.admin]: 3,
    [UserRole.unknown]: 0
};
