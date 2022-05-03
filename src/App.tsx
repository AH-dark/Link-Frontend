import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "antd/dist/antd.min.css";
import "./App.css";
import User from "./model/data/User";
import { useDispatch, useSelector } from "react-redux";
import { setSiteConfig, setUserLogin } from "./redux/action";
import SiteConfig from "./model/data/SiteConfig";
import { MyState } from "./redux/reducer";
import Cookie from "js-cookie";
import { getSiteConfig } from "./middleware/API/siteConfig";
import { getUser } from "./middleware/API/user";
import UserPages from "./component/UserPages";

const Admin = React.lazy(() => import("./component/Admin"));

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
            <React.Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path={"/*"} element={<UserPages />} />
                    <Route path={"/admin/*"} element={<Admin />} />
                </Routes>
            </React.Suspense>
        </BrowserRouter>
    );
}

export default App;
