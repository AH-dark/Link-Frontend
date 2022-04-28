import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import "antd/dist/antd.min.css";
import "./App.css";
import LinkDetail from "./page/LinkDetail";
import Login from "./page/Login";
import User from "./model/data/User";
import { useDispatch, useSelector } from "react-redux";
import { setSiteConfig, setUserLogin } from "./redux/action";
import SiteConfig from "./model/data/SiteConfig";
import NoMatch from "./page/NoMatch";
import Generate from "./page/Generate";
import { MyState } from "./redux/reducer";
import Cookie from "js-cookie";
import { getSiteConfig } from "./middleware/API/siteConfig";
import { getUser } from "./middleware/API/user";
import UserInfo from "./page/UserInfo";
import Explorer from "./page/Explorer";

function App() {
    const dispatch = useDispatch();

    const user = useSelector<MyState, User | undefined>((state) => state.user);
    const siteConfig = useSelector<
        MyState,
        SiteConfig & {
            isSet: boolean;
        }
    >((state) => state.site);

    const [load, setLoad] = useState(true);

    useEffect(() => {
        const siteConfigStr = Cookie.get("siteConfig");

        let events: Promise<boolean>[] = [];
        if (typeof user === "undefined") {
            events.push(
                getUser().then((r) => {
                    if (r !== null) {
                        dispatch(setUserLogin(r));
                        console.info("Login success.");
                    }
                    return true;
                })
            );
        }
        if (!siteConfig.isSet) {
            if (typeof siteConfigStr === "undefined") {
                events.push(
                    getSiteConfig().then((r) => {
                        if (r === null) {
                            return false;
                        } else {
                            dispatch(setSiteConfig(r));
                            return true;
                        }
                    })
                );
            } else {
                const siteConfig = JSON.parse(siteConfigStr) as SiteConfig;
                dispatch(setSiteConfig(siteConfig));
            }
        }

        Promise.all(events).then((r) => {
            for (let i = 0; i < r.length; i++) {
                if (r[i] !== true) {
                    return;
                }
            }
            setLoad(false);
            return;
        });
    }, []);

    if (load) {
        return <>{"Loading..."}</>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={"/login"} element={<Login />} />

                <Route path={"/generate"} element={<Generate />} />
                <Route path={"/link/:key"} element={<LinkDetail />} />

                <Route path={"/me"} element={<UserInfo />} />
                <Route path={"/user"} element={<UserInfo />} />
                <Route path={"/user/:userId"} element={<UserInfo />} />

                <Route path={"/explorer"} element={<Explorer />} />

                <Route path={"*"} element={<NoMatch />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
