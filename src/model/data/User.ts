export default interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: number;
    description: string | undefined;
    registerIP: string;
    createTime: Date;
    loginTime: Date;
    available: boolean;
}
