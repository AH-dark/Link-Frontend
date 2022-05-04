import { Reducer } from "redux";
import { SET_SIDEBAR_OPEN, SET_SITE_CONFIG, SET_TITLE, ADD_USER_HASH, SET_USER_LOGIN } from "./action";
import User from "../model/data/User";
import SiteConfig from "../model/data/SiteConfig";
import Cookie from "js-cookie";

export interface MyState {
    title: string | null;
    ui: {
        sidebar: {
            open: boolean;
        };
    };
    user: User | null;
    site: SiteConfig & {
        isSet: boolean;
    };
    userHash: {
        [K: number]: User;
    };
}

const initSiteConfig = Cookie.get("siteConfig");

const initState: MyState = {
    title: null,
    ui: {
        sidebar: {
            open: false,
        },
    },
    user: null,
    site:
        typeof initSiteConfig !== "undefined"
            ? {
                  ...(JSON.parse(initSiteConfig) as SiteConfig),
                  isSet: true,
              }
            : {
                  siteName: "Link",
                  siteUrl: "http://localhost/",
                  enableTouristShorten: false,
                  isSet: false,
              },
    userHash: {},
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
                userHash:
                    action.user !== null
                        ? {
                              ...state.userHash,
                              [action.user.i]: action.user,
                          }
                        : state.userHash,
            };
        case SET_SITE_CONFIG:
            return {
                ...state,
                site: action.site,
            };
        case ADD_USER_HASH:
            return {
                ...state,
                userHash: {
                    ...state.userHash,
                    [action.user.id]: action.user,
                },
            };
        default:
            return state;
    }
};

export default reducer;
