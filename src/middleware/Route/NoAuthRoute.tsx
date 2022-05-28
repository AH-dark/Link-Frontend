import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useGetUserQuery } from "../../service/localApi";

const NoAuthRoute: React.FC<RouteProps> = (props) => {
    const data = useGetUserQuery().data;
    const isLogin = data === null;

    return <>{!isLogin ? <Route {...props}>{props.children}</Route> : <Redirect to="/" />}</>;
};

export default NoAuthRoute;
