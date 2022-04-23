import { Reducer } from "redux";
import { SET_SIDEBAR_OPEN, SET_SITE_CONFIG, SET_TITLE, SET_USER_LOGIN } from "./action";
import User from "../model/data/User";
import SiteConfig from "../model/data/SiteConfig";

export interface MyState {
    title: string | null;
    ui: {
        sidebar: {
            open: boolean;
        };
    };
    user?: User;
    site: SiteConfig;
}

const initState: MyState = {
    title: null,
    ui: {
        sidebar: {
            open: false,
        },
    },
    site: {
        siteName: "Link",
        siteUrl: "http://localhost:8080/",
        enableTouristShorten: false,
    },
};

const reducer: Reducer<MyState> = (state: MyState = initState, action) => {
    switch (action.type) {
        case SET_TITLE:
            window.document.title = `${action.title} - ${state.site.siteName}`;
            return {
                ...state,
                title: action.title,
            };
        case SET_SIDEBAR_OPEN:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    sidebar: {
                        ...state.ui.sidebar,
                        open: action.open,
                    },
                },
            };
        case SET_USER_LOGIN:
            return {
                ...state,
                user: action.user,
            };
        case SET_SITE_CONFIG:
            return {
                ...state,
                site: action.site,
            };
        default:
            return state;
    }
};

export default reducer;
