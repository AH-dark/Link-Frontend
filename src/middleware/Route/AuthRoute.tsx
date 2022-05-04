import React from "react";
import { useSelector } from "react-redux";
import { MyState } from "../../redux/reducer";
import { Redirect, Route, RouteProps } from "react-router-dom";

const AuthRoute: React.FC<RouteProps> = (props) => {
    const isLogin = useSelector((state: MyState) => state.user !== null);

    return <>{isLogin ? <Route {...props}>{props.children}</Route> : <Redirect to="/login" />}</>;
};

export default AuthRoute;
