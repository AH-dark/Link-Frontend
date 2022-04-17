type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    create_time: Date;
    register_ip: string;
    login_time: Date;
    available: boolean;
};

export default User;
