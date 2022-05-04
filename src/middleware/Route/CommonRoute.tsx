import React from "react";
import { Route, RouteProps } from "react-router-dom";

const CommonRoute: React.FC<RouteProps> = (props) => {
    return <Route {...props}>{props.children}</Route>;
};

export default CommonRoute;
