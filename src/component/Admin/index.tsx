import React, { FC } from "react";
import Layout from "./Layout";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { AuthRoute } from "../../middleware/Route";
import { Redirect, Switch } from "react-router-dom";

const Dashboard = React.lazy(() => import("./Dashboard"));
const UserManager = React.lazy(() => import("./UserManager"));
const UserEditor = React.lazy(() => import("./UserManager/Editor"));
const LinkManager = React.lazy(() => import("./LinkManager"));

const theme = createTheme();

const Admin: FC = () => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                    <Layout>
                        <Switch>
                            <Redirect path={"/admin"} to={"/admin/dashboard"} exact />
                            <AuthRoute path={"/admin/dashboard"} exact>
                                <Dashboard />
                            </AuthRoute>

                            <AuthRoute path={"/admin/user"} exact>
                                <UserManager />
                            </AuthRoute>
                            <AuthRoute path={"/admin/user/edit/:id"} exact>
                                <UserEditor />
                            </AuthRoute>
                            <AuthRoute path={"/admin/user/create"} exact>
                                <UserEditor />
                            </AuthRoute>

                            <AuthRoute path={"/admin/link"} exact>
                                <LinkManager />
                            </AuthRoute>
                        </Switch>
                    </Layout>
                </SnackbarProvider>
            </ThemeProvider>
        </LocalizationProvider>
    );
};

export default Admin;
