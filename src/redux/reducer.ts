import { Reducer } from "redux";
import { SET_SIDEBAR_OPEN, SET_TITLE } from "./action";
import User from "../model/data/User";
import SiteInfo from "../model/data/SiteInfo";

export interface MyState {
    title: string | null;
    ui: {
        sidebar: {
            open: boolean;
        };
    };
    user?: User;
    site: SiteInfo;
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
        isPublic: true,
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
        default:
            return state;
    }
};

export default reducer;
