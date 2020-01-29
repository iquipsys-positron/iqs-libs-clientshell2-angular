export class AccessRole {
    public static readonly empty: number = 0;
    public static readonly user: number = 1;
    public static readonly manager: number = 2;
    public static readonly admin: number = 3;

    public static readonly roles = [
        'empty', 'user', 'manager', 'admin'
    ];
}