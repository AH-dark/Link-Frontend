import React from "react";
import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";
import UI from "../UI";
import { Route, Routes } from "react-router-dom";

const Home = React.lazy(() => import("./Home"));
const Login = React.lazy(() => import("./Login"));
const Generate = React.lazy(() => import("./Generate"));
const LinkDetail = React.lazy(() => import("./LinkDetail"));
const Explorer = React.lazy(() => import("./Explorer"));
const UserInfo = React.lazy(() => import("./UserInfo"));
const UserSettings = React.lazy(() => import("./UserSettings"));
const NoMatch = React.lazy(() => import("./NoMatch"));

const UserPages: React.FC = () => {
    return (
        <ConfigProvider direction="ltr" locale={zhCN}>
            <UI>
                <React.Suspense fallback={<div>{"Loading..."}</div>}>
                    <Routes>
                        {/* Basic */}
                        <Route path={"/"} element={<Home />} />
                        <Route path={"/login"} element={<Login />} />

                        {/* Short Link */}
                        <Route path={"/generate"} element={<Generate />} />
                        <Route path={"/link/:key"} element={<LinkDetail />} />
                        <Route path={"/explorer"} element={<Explorer />} />

                        {/* User Explorer */}
                        <Route path={"/me"} element={<UserInfo />} />
                        <Route path={"/user"} element={<UserInfo />} />
                        <Route path={"/user/:userId"} element={<UserInfo />} />

                        {/* User Self Manage */}
                        <Route path={"/settings"} element={<UserSettings />} />

                        {/* 404 */}
                        <Route path={"*"} element={<NoMatch />} />
                    </Routes>
                </React.Suspense>
            </UI>
        </ConfigProvider>
    );
};

export default UserPages;
