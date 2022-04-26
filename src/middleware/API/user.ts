import API from "./index";
import ApiResponse from "../../model/ApiResponse";
import { message } from "antd";
import User from "../../model/data/User";

export interface GetUserType {
    (id?: number, email?: string): Promise<User | null>;
}

export const getUser: GetUserType = async (id?: number, email?: string) => {
    const res = await API.get<ApiResponse<User>>("/user", {
        responseType: "json",
        params: {
            id: id,
            email: email,
        },
    });

    if (res.status === 200 && res.data.code === 200) {
        console.log("[API]", "Get user data success:", res.data.data);
        return res.data.data;
    } else {
        if (res.status === 200) {
            switch (res.data.code) {
                case 2001:
                    console.info(res.data.message);
                    break;
                default:
                    message.error(`Error ${res.data.code}: ${res.data.message}`);
            }
        } else {
            message.error(`Error ${res.data.code}: ${res.data.message}`);
        }
        return null;
    }
};
