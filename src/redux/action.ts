import { Action } from "redux";
import User from "../model/data/User";
import SiteConfig from "../model/data/SiteConfig";
import Cookie from "js-cookie";
import dayjs from "dayjs";

export const SET_TITLE = "SEI_TITLE";

export interface ActionSetTitle extends Action {
    title: string;
}

export const setTitle: (title: string) => ActionSetTitle = (title) => {
    return {
        type: SET_TITLE,
        title: title,
    };
};

export const SET_SIDEBAR_OPEN = "SET_SIDEBAR_OPEN";

export interface ActionSetSidebarOpen extends Action {
    open: boolean;
}

export const setSidebarOpen: (open: boolean) => ActionSetSidebarOpen = (open) => {
    return {
        type: SET_SIDEBAR_OPEN,
        open: open,
    };
};

export const SET_USER_LOGIN = "SET_USER_LOGIN";

export interface ActionSetUserLogin extends Action {
    user: User | undefined;
}

export const setUserLogin: (userData: User | undefined) => ActionSetUserLogin = (userData) => {
    return {
        type: SET_USER_LOGIN,
        user: userData,
    };
};

export const SET_SITE_CONFIG = "SET_SITE_CONFIG";

export interface ActionSetSiteConfig extends Action {
    site: SiteConfig & {
        isSet: boolean;
    };
}

export const setSiteConfig: (siteConfig: SiteConfig) => ActionSetSiteConfig = (siteConfig) => {
    Cookie.set("siteConfig", JSON.stringify(siteConfig), {
        expires: dayjs().add(2, "hour").toDate(),
    });

    return {
        type: SET_SITE_CONFIG,
        site: {
            ...siteConfig,
            isSet: true,
        },
    };
};

export const SET_USER = "SET_USER";

export interface ActionSetUser extends Action {
    user: User;
}

export const setUser: (user: User) => ActionSetUser = (user) => {
    return {
        type: SET_USER,
        user: user,
    };
};
