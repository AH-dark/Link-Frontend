import React from "react";
import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";
import UI from "./UI";
import { AuthRoute, CommonRoute, NoAuthRoute } from "../../middleware/Route";
import { Switch, useLocation } from "react-router-dom";

const Home = React.lazy(() => import("./Home"));
const Login = React.lazy(() => import("./Login"));
const Generate = React.lazy(() => import("./Generate"));
const LinkDetail = React.lazy(() => import("./LinkDetail"));
const Explorer = React.lazy(() => import("./Explorer"));
const UserInfo = React.lazy(() => import("./UserInfo"));
const UserSettings = React.lazy(() => import("./UserSettings"));
const NoMatch = React.lazy(() => import("./NoMatch"));

const UserPages: React.FC = () => {
    const location = useLocation();

    return (
        <ConfigProvider direction="ltr" locale={zhCN}>
            <UI>
                <React.Suspense>
                    <Switch location={location}>
                        <CommonRoute exact path={"/"}>
                            <Home />
                        </CommonRoute>

                        <NoAuthRoute path={"/login"}>
                            <Login />
                        </NoAuthRoute>

                        <AuthRoute path={"/generate"}>
                            <Generate />
                        </AuthRoute>
                        <CommonRoute path={"/link/:key"}>
                            <LinkDetail />
                        </CommonRoute>
                        <CommonRoute path={"/explorer"}>
                            <Explorer />
                        </CommonRoute>

                        <AuthRoute path={"/me"}>
                            <UserInfo />
                        </AuthRoute>
                        <CommonRoute path={"/user/:userId"}>
                            <UserInfo />
                        </CommonRoute>

                        <AuthRoute path={"/settings"}>
                            <UserSettings />
                        </AuthRoute>

                        <CommonRoute path={"/*"}>
                            <NoMatch />
                        </CommonRoute>
                    </Switch>
                </React.Suspense>
            </UI>
        </ConfigProvider>
    );
};

export default UserPages;
