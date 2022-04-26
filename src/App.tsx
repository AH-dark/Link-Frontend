import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import "antd/dist/antd.min.css";
import "./App.css";
import LinkDetail from "./page/LinkDetail";
import Login from "./page/Login";
import API from "./middleware/API";
import ApiResponse from "./model/ApiResponse";
import User from "./model/data/User";
import { useDispatch, useSelector } from "react-redux";
import { setSiteConfig, setUserLogin } from "./redux/action";
import { message } from "antd";
import SiteConfig from "./model/data/SiteConfig";
import NoMatch from "./page/NoMatch";
import Generate from "./page/Generate";
import { MyState } from "./redux/reducer";

function App() {
    const dispatch = useDispatch();

    const user = useSelector<MyState, User | undefined>((state) => state.user);
    const siteConfig = useSelector<MyState, SiteConfig | undefined>((state) => state.site);

    const [load, setLoad] = useState(true);

    useEffect(() => {
        const getUser = API.get<ApiResponse<User>>("/user", {
            responseType: "json",
        })
            .then((res) => {
                if (res.status === 200) {
                    switch (res.data.code) {
                        case 200:
                            dispatch(setUserLogin(res.data.data));
                            console.info("Login success.");
                            break;
                        case 2001:
                            console.info("尚未登录");
                            break;
                    }
                    return true;
                } else {
                    return false;
                }
            })
            .catch((err) => {
                message.error(err.response.data.message || err.message);
                console.log(err.message);
                return false;
            });

        const getSiteConfig = API.get<ApiResponse<SiteConfig>>("/siteConfig", {
            responseType: "json",
        })
            .then((res) => {
                if (res.status === 200 && res.data.code === 200) {
                    dispatch(setSiteConfig(res.data.data));
                    return true;
                } else {
                    message.error(`Get site config error: ${res.data.message}`);
                    console.log(`Get site config error: ${res.data.message}`);
                    return false;
                }
            })
            .catch((err) => {
                const message = err.response.data.message || err.message;
                message.error(`Get site config error: ${message}`);
                console.log(`Get site config error: ${message}`);
                return false;
            });

        let events: Promise<boolean>[] = [];
        if (typeof user === "undefined") {
            events.push(getUser);
        }
        if (typeof siteConfig === "undefined") {
            events.push(getSiteConfig);
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
                <Route path={"*"} element={<NoMatch />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
