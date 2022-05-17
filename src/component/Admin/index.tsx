import React, { FC } from "react";
import Layout from "./Layout";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { AuthRoute } from "../../middleware/Route";
import { Redirect, Switch } from "react-router-dom";
import SiteConfigManager from "./SiteConfigManager";

const Dashboard = React.lazy(() => import("./Dashboard"));
const UserManager = React.lazy(() => import("./UserManager"));
const UserEditor = React.lazy(() => import("./UserManager/Editor"));
const LinkManager = React.lazy(() => import("./LinkManager"));
const LinkEditor = React.lazy(() => import("./LinkManager/Editor"));

const theme = createTheme();

const Admin: FC = () => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <Layout>
                    <React.Suspense>
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
                            <AuthRoute path={"/admin/link/create"} exact>
                                <LinkEditor />
                            </AuthRoute>
                            <AuthRoute path={"/admin/link/edit/:key"} exact>
                                <LinkEditor />
                            </AuthRoute>

                            <AuthRoute path={"/admin/site"} exact>
                                <SiteConfigManager />
                            </AuthRoute>
                        </Switch>
                    </React.Suspense>
                </Layout>
            </SnackbarProvider>
        </ThemeProvider>
    </LocalizationProvider>
);

export default Admin;
