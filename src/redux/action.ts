import { Action } from "redux";

export const SET_TITLE = "SEI_TITLE";

export interface ActionSetTitle extends Action {
    title: string;
}

export const setTitle: (title: string) => ActionSetTitle = (title: string) => {
    return {
        type: SET_TITLE,
        title: title,
    };
};

export const SET_SIDEBAR_OPEN = "SET_SIDEBAR_OPEN";

export interface ActionSetSidebarOpen extends Action {
    open: boolean;
}

export const setSidebarOpen: (open: boolean) => ActionSetSidebarOpen = (open: boolean) => {
    return {
        type: SET_SIDEBAR_OPEN,
        open: open,
    };
};
