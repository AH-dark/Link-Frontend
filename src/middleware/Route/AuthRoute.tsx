import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useGetUserQuery } from "../../service/localApi";

const AuthRoute: React.FC<RouteProps> = (props) => {
    const data = useGetUserQuery().data;
    const isLogin = data !== null && typeof data !== "undefined";

    return <>{isLogin ? <Route {...props}>{props.children}</Route> : <Redirect to="/login" />}</>;
};

export default AuthRoute;
