import React, { FC, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { MyState } from "../../redux/reducer";
import User from "../../model/data/User";
import { message } from "antd";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";

const RedirectIndex = React.lazy(() => import("./RedirectIndex"));
const Dashboard = React.lazy(() => import("./Dashboard"));
const UserManager = React.lazy(() => import("./UserManager"));
const UserEditor = React.lazy(() => import("./UserManager/Editor"));
const LinkManager = React.lazy(() => import("./LinkManager"));

const theme = createTheme();

const Admin: FC = () => {
    const navigate = useNavigate();
    const user = useSelector<MyState, User | undefined>((state) => state.user);

    useEffect(() => {
        if (typeof user === "undefined") {
            message.warning("您还未登录");
            navigate("/login");
        }
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                    <Layout>
                        <React.Suspense fallback={<div>{"Loading..."}</div>}>
                            <Routes>
                                <Route index element={<RedirectIndex />} />
                                <Route path={"/dashboard"} element={<Dashboard />} />

                                <Route path={"/user"} element={<UserManager />} />
                                <Route path={"/user/edit/:id"} element={<UserEditor />} />
                                <Route path={"/user/create"} element={<UserEditor />} />

                                <Route path={"/link"} element={<LinkManager />} />
                            </Routes>
                        </React.Suspense>
                    </Layout>
                </SnackbarProvider>
            </ThemeProvider>
        </LocalizationProvider>
    );
};

export default Admin;
