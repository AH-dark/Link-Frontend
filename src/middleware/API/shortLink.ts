import API from "./index";
import ApiResponse from "../../model/ApiResponse";
import ShortLink, { ShortLinkBasic } from "../../model/data/ShortLink";
import { AxiosResponse } from "axios";
import { message } from "antd";

export interface GenerateShortLinkType {
    (origin: string, key?: string, userId?: number): Promise<ShortLink | null>;
}

export const generateShortLink: GenerateShortLinkType = async (origin, key, userId) => {
    const res = await API.post<
        ApiResponse<ShortLink>,
        AxiosResponse<ApiResponse<ShortLink>, ShortLinkBasic>,
        ShortLinkBasic
    >(
        "/shortLink",
        {
            key: key,
            origin: origin,
            userId: typeof userId !== "undefined" ? userId : 0,
        },
        {
            responseType: "json",
        }
    );

    if (res.status === 200 && res.data.code === 200) {
        return res.data.data;
    } else {
        message.error(`Error ${res.data.code}: ${res.data.message}`);
        return null;
    }
};

export interface GetShortLinkType {
    (key: string): Promise<ShortLink | null>;
}

export const getShortLink: GetShortLinkType = async (key: string) => {
    const res = await API.get<ApiResponse<ShortLink>>("/shortLink", {
        responseType: "json",
        params: {
            key: key,
        },
    });

    if (res.status === 200 && res.data.code === 200) {
        return res.data.data;
    } else {
        message.error(`Error ${res.data.code}: ${res.data.message}`);
        return null;
    }
};

export interface GetShortLinkByUserType {
    (userId: number): Promise<ShortLink[] | null>;
}

export const getShortLinkByUser: GetShortLinkByUserType = async (userId: number) => {
    const res = await API.get<ApiResponse<ShortLink[]>>("/shortLink", {
        responseType: "json",
        params: {
            userId: userId,
        },
    });

    if (res.status === 200 && res.data.code === 200) {
        return res.data.data;
    } else {
        message.error(`Error ${res.data.code}: ${res.data.message}`);
        return null;
    }
};
