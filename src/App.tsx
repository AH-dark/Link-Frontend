import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import "antd/dist/antd.min.css";
import "./App.css";
import LinkDetail from "./page/LinkDetail";
import Login from "./page/Login";
import API from "./middleware/API";
import ApiResponse from "./model/ApiResponse";
import User from "./model/data/User";
import { useDispatch } from "react-redux";
import { setUserLogin } from "./redux/action";
import { message } from "antd";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        API.get<ApiResponse<User>>("/user", {
            responseType: "json",
        })
            .then((res) => {
                if (res.status === 200) {
                    switch (res.data.code) {
                        case 200:
                            dispatch(setUserLogin(res.data.data));
                            message.success("登录成功");
                            console.log("Login success.");
                            return;
                        case 2001:
                            message.warning("尚未登录");
                            return;
                        default:
                            return;
                    }
                }
            })
            .catch((err) => {
                message.error(err.response.data.message || err.message);
                console.log(err.message);
            });
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/link/:key"} element={<LinkDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
