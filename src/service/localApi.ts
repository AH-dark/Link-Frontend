import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { message } from "antd";
import User, { UserPutData } from "model/data/User";
import ApiResponse from "model/ApiResponse";
import SiteConfig from "model/data/SiteConfig";
import ShortLink from "model/data/ShortLink";
import LoginData from "model/data/LoginData";

const baseUrl = "/";

const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") return "http://localhost:8080/";

    return baseUrl;
};

const localApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl(), credentials: "include" }),
    tagTypes: ["Users", "ShortLinks", "SiteConfig"],
    endpoints: (builder) => ({
        getUser: builder.query<User | undefined, { id?: number; email?: string } | void>({
            query: (data) => ({ url: "api/user", params: data ? data : undefined, method: "GET" }),
            transformResponse: (response: ApiResponse<User>, meta, args) => {
                if (response.code !== 200) {
                    if (args && typeof args.id !== "undefined" && args.id === 0 && response.code === 2007) {
                        // do not send error when user id equals to 0
                        return undefined;
                    }
                    if (!args && response.code === 2001) {
                        // do not send error when get user by session
                        return undefined;
                    }
                    message.error(`Error ${response.code}: ${response.message}`);
                    return undefined;
                } else return response.data;
            },
            providesTags: (result) => [{ type: "Users", id: result?.id, email: result?.email }],
        }),
        putUser: builder.mutation<User | undefined, UserPutData>({
            query: (data) => ({
                url: "api/user",
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: ApiResponse<User>) => {
                if (response.code !== 200) {
                    message.error(`Error ${response.code}: ${response.message}`);
                    return undefined;
                } else return response.data;
            },
            invalidatesTags: (result) => [{ type: "Users", key: result?.id }],
        }),
        getSiteConfig: builder.query<SiteConfig | undefined, void>({
            query: () => ({ url: "api/siteConfig", method: "GET" }),
            transformResponse: (response: ApiResponse<SiteConfig>) => {
                if (response.code !== 200) {
                    message.error(`Error ${response.code}: ${response.message}`);
                    return undefined;
                } else return response.data;
            },
            providesTags: ["SiteConfig"],
        }),
        getShortLink: builder.query<ShortLink | undefined, string>({
            query: (key) => ({
                url: "api/shortLink",
                method: "GET",
                params: {
                    key: key,
                },
            }),
            transformResponse: (response: ApiResponse<ShortLink>) => {
                if (response.code !== 200) {
                    message.error(`Error ${response.code}: ${response.message}`);
                    return undefined;
                } else return response.data;
            },
            providesTags: ["ShortLinks"],
        }),
        getShortLinkByUser: builder.query<ShortLink[] | undefined, number>({
            query: (userId) => ({
                url: "api/shortLink",
                method: "GET",
                params: {
                    userId,
                },
            }),
            transformResponse: (response: ApiResponse<ShortLink[]>) => {
                if (response.code !== 200) {
                    message.error(`Error ${response.code}: ${response.message}`);
                    return undefined;
                } else return response.data;
            },
            providesTags: (result) => {
                let arr: Array<{ type: "ShortLinks"; key: string }> = [];
                result?.forEach((item) => {
                    arr.push({
                        type: "ShortLinks",
                        key: item.key,
                    });
                });
                return arr;
            },
        }),
        postShortLink: builder.mutation<ShortLink | undefined, { origin: string; key?: string; userId?: number }>({
            query: ({ origin, key, userId }) => ({
                url: "api/shortLink",
                method: "POST",
                body: {
                    key: key,
                    origin: origin,
                    userId: typeof userId !== "undefined" ? userId : 0,
                },
            }),
            transformResponse: (response: ApiResponse<ShortLink>) => {
                if (response.code !== 200) {
                    message.error(`Error ${response.code}: ${response.message}`);
                    return undefined;
                } else return response.data;
            },
            invalidatesTags: (result) => [{ type: "ShortLinks", key: result?.key }],
        }),
        getLatestShortLink: builder.query<ShortLink[] | undefined, { size?: number; page?: number } | void>({
            query: (data) => ({
                url: "api/shortLink/latest",
                method: "GET",
                params: data ? data : undefined,
            }),
            transformResponse: (response: ApiResponse<ShortLink[]>) => {
                if (response.code !== 200) {
                    message.error(`Error ${response.code}: ${response.message}`);
                    return undefined;
                } else return response.data;
            },
            providesTags: (result) => {
                let arr: Array<{ type: "ShortLinks"; key: string }> = [];
                result?.forEach((item) => {
                    arr.push({
                        type: "ShortLinks",
                        key: item.key,
                    });
                });
                return arr;
            },
        }),
        login: builder.mutation<User | undefined, LoginData>({
            query: (data) => ({
                url: "api/login",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: ApiResponse<User>) => {
                if (response.code !== 200) {
                    message.error(`Error ${response.code}: ${response.message}`);
                    return undefined;
                } else return response.data;
            },
            invalidatesTags: (result) => [{ type: "Users", id: result?.id, email: result?.email }],
        }),
        logout: builder.mutation<User | undefined, void>({
            query: () => ({
                url: "api/logout",
                method: "POST",
            }),
            transformResponse: (response: ApiResponse<User>) => {
                if (response.code !== 200) {
                    message.error(`Error ${response.code}: ${response.message}`);
                    return undefined;
                } else return response.data;
            },
            invalidatesTags: (result) => [{ type: "Users", id: result?.id, email: result?.email }],
        }),
    }),
});

export const {
    useGetUserQuery,
    usePutUserMutation,
    useGetSiteConfigQuery,
    useGetShortLinkQuery,
    useGetShortLinkByUserQuery,
    useGetLatestShortLinkQuery,
    usePostShortLinkMutation,
    useLoginMutation,
    useLogoutMutation,
} = localApi;
export default localApi;
