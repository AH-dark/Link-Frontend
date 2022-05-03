import API from "../index";
import ApiResponse from "../../../model/ApiResponse";
import { message } from "antd";
import LimitData from "../../../model/ApiResponse/LimitData";
import User from "../../../model/data/User";

export interface GetAllUserType {
    (page?: number, limit?: number): Promise<LimitData<User[]> | null>;
}

export const getAllUser: GetAllUserType = async (page: number = 1, limit: number = 10) => {
    const res = await API.get<ApiResponse<LimitData<User[]>>>("/root/user/all", {
        responseType: "json",
        params: {
            page: page,
            limit: limit,
        },
    });

    if (res.status === 200 && res.data.code === 200) {
        return res.data.data;
    } else {
        message.error(`Error ${res.data.code}: ${res.data.message}`);
        return null;
    }
};

export interface GetUserType {
    (id?: number, email?: string): Promise<User | null>;
}

export const getUser: GetUserType = async (id, email) => {
    const res = await API.get<ApiResponse<User>>("/root/user", {
        responseType: "json",
        params: {
            id: id,
            email: email,
        },
    });

    if (res.status === 200 && res.data.code === 200) {
        return res.data.data;
    } else {
        message.error(`Error ${res.data.code}: ${res.data.message}`);
        return null;
    }
};

export interface SetUserType {
    (data: User): Promise<User | null>;
}

export const setUser: SetUserType = async (data) => {
    const res = await API.put("/root/user", data);

    if (res.status === 200 && res.data.code === 200) {
        return res.data.data;
    } else {
        message.error(`Error ${res.data.code}: ${res.data.message}`);
        return null;
    }
};

export interface AddUserType {
    (data: User): Promise<User | null>;
}

export const addUser: AddUserType = async (data) => {
    const res = await API.post("/root/user", data);

    if (res.status === 200 && res.data.code === 200) {
        return res.data.data;
    } else {
        message.error(`Error ${res.data.code}: ${res.data.message}`);
        return null;
    }
};
