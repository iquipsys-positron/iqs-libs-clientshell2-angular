export enum UserRole {
    user = 'user',
    manager = 'manager',
    admin = 'admin',
    org_admin = 'org_admin',
    unknown = 'unknown'
}

export const userRoleValue = {
    [UserRole.user]: 1,
    [UserRole.manager]: 2,
    [UserRole.org_admin]: 3,
    [UserRole.admin]: 4,
    [UserRole.unknown]: 0
};
