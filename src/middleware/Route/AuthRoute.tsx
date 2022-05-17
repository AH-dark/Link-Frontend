import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAppSelector } from "../../redux/hook";

const AuthRoute: React.FC<RouteProps> = (props) => {
    const isLogin = useAppSelector((state) => state.data.user !== null);

    return <>{isLogin ? <Route {...props}>{props.children}</Route> : <Redirect to="/login" />}</>;
};

export default AuthRoute;
