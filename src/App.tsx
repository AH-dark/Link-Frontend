import React from "react";
import "./App.css";
import UserPages from "./component/UserPages";
import { AuthRoute, CommonRoute } from "./middleware/Route";
import { Switch } from "react-router-dom";
import { useAppSelector } from "./redux/hook";
import { useGetSiteConfigQuery, useGetUserQuery } from "./service/localApi";

const Admin = React.lazy(() => import("./component/Admin"));

const App: React.FC = () => {
    const { isLoading: loadingUser } = useGetUserQuery();
    const { data: siteConfig, isLoading: loadingSideConfig } = useGetSiteConfigQuery();

    const siteName = typeof siteConfig !== "undefined" ? siteConfig.siteName : "Link";

    window.document.title = useAppSelector((state) =>
        state.viewUpdate.title === null ? siteName : state.viewUpdate.title + " - " + siteName
    );

    if (loadingUser || loadingSideConfig) {
        return <>{"Loading..."}</>;
    }

    return (
        <React.Suspense>
            <Switch>
                <AuthRoute path={"/admin"}>
                    <Admin />
                </AuthRoute>
                <CommonRoute path={"/"}>
                    <UserPages />
                </CommonRoute>
            </Switch>
        </React.Suspense>
    );
};

export default App;
