import React, { FC } from "react";
import { Avatar, Button, Menu, message, Popover } from "antd";
import { GetAvatar } from "utils/avatar";
import { LoginOutlined, LogoutOutlined, SettingOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./ui.module.scss";
import "./LoginMenu.scss";
import { useHistory } from "react-router-dom";
import { useGetUserQuery, useLogoutMutation } from "service/localApi";

const MenuContent: FC = () => {
    const history = useHistory();
    const [logout] = useLogoutMutation();

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
        logout()
            .unwrap()
            .then((r) => {
                if (typeof r !== "undefined") {
                    message.success("Successfully logged out, looking forward to your next visit.");
                    console.log("Logout success.");
                    history.push("/login");
                }
            })
            .catch((err) => {
                message.error(err.message);
                console.log(err.message);
            });
    };

    const user = useGetUserQuery().data;

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
    const user = useGetUserQuery().data;
    const isLogin = typeof user !== "undefined";

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
