import React, { FC } from "react";
import User from "../../../model/data/User";
import { Avatar, Button, Menu, message, Popover } from "antd";
import { GetAvatar } from "../../../utils/avatar";
import { LoginOutlined, LogoutOutlined, SettingOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./ui.module.scss";
import "./LoginMenu.scss";
import API from "../../../middleware/API";
import ApiResponse from "../../../model/ApiResponse";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { setUserLogin } from "../../../redux/data";

const MenuContent: FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();

    const handleSettings = () => {
        history.push("/settings");
    };

    const handleControlPanel = () => {
        history.push("/admin");
    };

    const handleMe = () => {
        history.push("/me");
    };

    const handleLogOut = () => {
        API.post<ApiResponse<User>>("/logout")
            .then((res) => {
                if (res.status === 200 && res.data.code === 200) {
                    message.success("Successfully logged out, looking forward to your next visit.");
                    console.log("Logout success.");
                    dispatch(setUserLogin(null));
                    history.push("/login");
                } else {
                    message.error(`Error ${res.data.code}: ${res.data.message}`);
                }
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message || err.message);
                console.log(err.message);
            });
    };

    const user = useAppSelector((state) => state.data.user);

    return (
        <Menu mode={"inline"} selectable={false} inlineIndent={8} style={{ border: "none" }}>
            <Menu.Item key={"me"} icon={<UserOutlined />} onClick={handleMe}>
                {"Me"}
            </Menu.Item>
            <Menu.Item key={"settings"} icon={<ToolOutlined />} onClick={handleSettings}>
                {"Settings"}
            </Menu.Item>
            {user?.available && (
                <Menu.Item key={"control"} icon={<SettingOutlined />} onClick={handleControlPanel}>
                    {"Control Panel"}
                </Menu.Item>
            )}
            <Menu.Item key={"logout"} icon={<LogoutOutlined />} onClick={handleLogOut}>
                {"Log Out"}
            </Menu.Item>
        </Menu>
    );
};

const LoginMenu: FC = () => {
    const user = useAppSelector((state) => state.data.user);
    const isLogin = user !== null;

    const history = useHistory();

    const handleLoginClick: React.MouseEventHandler<HTMLElement> = (e) => {
        e.preventDefault();
        history.push("/login");
    };

    if (isLogin) {
        return (
            <Popover
                className={styles.popover}
                content={<MenuContent />}
                trigger={"hover"}
                arrowPointAtCenter={true}
                placement={"bottomRight"}
                id={"user-popover"}
            >
                <Avatar src={GetAvatar(user.email, 32)} srcSet={GetAvatar(user.email, 32)} draggable={false} />
            </Popover>
        );
    } else {
        return (
            <Button
                type={"text"}
                shape={"circle"}
                icon={<LoginOutlined />}
                size={"large"}
                className={styles.icon}
                onClick={handleLoginClick}
                href={"/login"}
            />
        );
    }
};

export default LoginMenu;
