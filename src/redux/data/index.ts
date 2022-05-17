import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../../model/data/User";
import SiteConfig from "../../model/data/SiteConfig";
import Cookie from "js-cookie";
import dayjs from "dayjs";

interface DataState {
    user: User | null;
    site: SiteConfig & {
        isSet: boolean;
    };
    userHash: Record<number, User>;
}

const initSiteConfig = Cookie.get("siteConfig");

const initialState: DataState = {
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

const data = createSlice({
    name: "viewUpdate",
    initialState,
    reducers: {
        setUserLogin(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            if (action.payload !== null) {
                state.userHash[action.payload.id] = action.payload;
            }
        },
        setSiteConfig(state, action: PayloadAction<SiteConfig>) {
            Cookie.set("siteConfig", JSON.stringify(action.payload), {
                expires: dayjs().add(2, "hour").toDate(),
            });

            state.site = {
                ...action.payload,
                isSet: true,
            };
        },
        addUserHash(state, action: PayloadAction<User>) {
            state.userHash[action.payload.id] = action.payload;
        },
    },
});

export const { setSiteConfig, setUserLogin, addUserHash } = data.actions;
export default data.reducer;
