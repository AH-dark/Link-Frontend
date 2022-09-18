import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import User from "model/data/User";
import ApiResponse from "model/ApiResponse";
import SiteConfig from "model/data/SiteConfig";
import ShortLink, { ShortLinkBasic } from "model/data/ShortLink";
import LimitData from "model/ApiResponse/LimitData";
import StatData from "model/data/StatData";

const baseUrl = "/";

const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") return "http://localhost:8080/";

    return baseUrl;
};

const rootApi = createApi({
    reducerPath: "rootApi",
    baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl(), credentials: "include" }),
    tagTypes: ["Root/Users", "Root/ShortLinks", "Root/SiteConfig", "Root/Stat"],
    endpoints: (builder) => ({
        getUser: builder.query<User | undefined, { id?: number; email?: string } | void>({
            query: (data) => ({ url: "api/root/user", params: data ? data : undefined, method: "GET" }),
            transformResponse: (response: ApiResponse<User>) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            providesTags: (result) => [{ type: "Root/Users", id: result?.id, email: result?.email }],
        }),
        getAllUser: builder.query<
            LimitData<Array<User>> | undefined,
            {
                page: number;
                limit: number;
            }
        >({
            query: (data) => ({
                url: "api/root/user/all",
                method: "GET",
                params: data,
            }),
            transformResponse: (response: ApiResponse<LimitData<Array<User>>>) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            providesTags: ["Root/Users"],
        }),
        putUser: builder.mutation<User | undefined, User>({
            query: (data) => ({ url: "api/root/user", body: data, method: "PUT" }),
            transformResponse: (response: ApiResponse<User>) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            invalidatesTags: (result) => [{ type: "Root/Users", id: result?.id, email: result?.email }],
        }),
        createUser: builder.mutation<User | undefined, User>({
            query: (data) => ({ url: "api/root/user", body: data, method: "POST" }),
            transformResponse: (response: ApiResponse<User>) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            invalidatesTags: (result) => [{ type: "Root/Users", id: result?.id, email: result?.email }],
        }),
        getSiteConfig: builder.query<SiteConfig | undefined, void>({
            query: () => ({ url: "api/root/siteConfig", method: "GET" }),
            transformResponse: (response: ApiResponse<SiteConfig>) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            providesTags: ["Root/SiteConfig"],
        }),
        putSiteConfig: builder.mutation<SiteConfig | undefined, SiteConfig>({
            query: (data) => ({ url: "api/root/siteConfig", method: "PUT", body: data }),
            transformResponse: (response: ApiResponse<SiteConfig>) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            invalidatesTags: ["Root/SiteConfig"],
        }),
        getShortLink: builder.query<ShortLink | undefined, string>({
            query: (key) => ({
                url: "api/root/link",
                method: "GET",
                params: {
                    key: key,
                },
            }),
            transformResponse: (response: ApiResponse<ShortLink>) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            providesTags: ["Root/ShortLinks"],
        }),
        getAllShortLink: builder.query<
            LimitData<Array<ShortLink>> | undefined,
            {
                page: number;
                limit: number;
            }
        >({
            query: (data) => ({
                url: "api/root/link/all",
                method: "GET",
                params: data,
            }),
            transformResponse: (response: ApiResponse<LimitData<Array<ShortLink>>>) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            providesTags: ["Root/ShortLinks"],
        }),
        postShortLink: builder.mutation<ShortLink | undefined, ShortLinkBasic>({
            query: (data) => ({ url: "api/root/link", method: "POST", body: data }),
            transformResponse: (response: ApiResponse) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            invalidatesTags: ["Root/ShortLinks"],
        }),
        putShortLink: builder.mutation<ShortLink | undefined, ShortLink>({
            query: (data) => ({ url: "api/root/link", method: "PUT", body: data }),
            transformResponse: (response: ApiResponse) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            invalidatesTags: ["Root/ShortLinks"],
        }),
        deleteShortLink: builder.mutation<SiteConfig | undefined, string>({
            query: (key) => ({ url: "api/root/link", method: "DELETE", params: { key: key } }),
            transformResponse: (response: ApiResponse) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            invalidatesTags: ["Root/ShortLinks"],
        }),
        getStatData: builder.query<StatData, number>({
            query: (day) => ({ url: "api/root/stat", method: "GET", params: { day } }),
            transformResponse: (response: ApiResponse) => {
                if (response.code !== 200) {
                    return undefined;
                } else return response.data;
            },
            providesTags: ["Root/Stat"],
        }),
    }),
});

export const {
    useGetUserQuery,
    useGetAllUserQuery,
    usePutUserMutation,
    useCreateUserMutation,
    useGetSiteConfigQuery,
    usePutSiteConfigMutation,
    useGetShortLinkQuery,
    useGetAllShortLinkQuery,
    usePostShortLinkMutation,
    usePutShortLinkMutation,
    useDeleteShortLinkMutation,
    useGetStatDataQuery,
} = rootApi;
export default rootApi;
