import { Action } from "redux";
import User from "../model/data/User";

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
    user: User;
}

export const setUserLogin: (userData: User) => ActionSetUserLogin = (userData) => {
    return {
        type: SET_USER_LOGIN,
        user: userData,
    };
};
