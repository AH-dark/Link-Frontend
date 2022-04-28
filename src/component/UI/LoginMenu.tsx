import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MyState } from "../../redux/reducer";
import User from "../../model/data/User";
import { Avatar, Button, Menu, message, Popover } from "antd";
import { GetAvatar } from "../../utils/avatar";
import { LoginOutlined, LogoutOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./ui.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoginMenu.scss";
import API from "../../middleware/API";
import ApiResponse from "../../model/ApiResponse";
import { setUserLogin } from "../../redux/action";

const MenuContent: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleSettings = () => {
        navigate("/settings");
    };

    const handleMe = () => {
        navigate("/me");
    };

    const handleLogOut = () => {
        API.post<ApiResponse<User>>("/logout")
            .then((res) => {
                if (res.status === 200 && res.data.code === 200) {
                    message.success("Successfully logged out, looking forward to your next visit.");
                    console.log("Logout success.");
                    console.log("Last login info:", res.data.data);
                    dispatch(setUserLogin(undefined));
                    navigate("/login");
                } else {
                    message.error(`Error ${res.data.code}: ${res.data.message}`);
                }
            })
            .catch((err) => {
                message.error(err.response.data.message || err.message);
                console.log(err.message);
            });
    };

    return (
        <Menu mode={"inline"} selectable={false} inlineIndent={8} style={{ border: "none" }}>
            {location.pathname !== "/me" && (
                <Menu.Item key={"me"} icon={<UserOutlined />} onClick={handleMe}>
                    {"Me"}
                </Menu.Item>
            )}
            {location.pathname !== "/settings" && (
                <Menu.Item key={"settings"} icon={<ToolOutlined />} onClick={handleSettings}>
                    {"Settings"}
                </Menu.Item>
            )}
            <Menu.Item key={"logout"} icon={<LogoutOutlined />} onClick={handleLogOut}>
                {"Log Out"}
            </Menu.Item>
        </Menu>
    );
};

const LoginMenu: FC = () => {
    const user = useSelector<MyState, User | undefined>((state) => state.user);
    const isLogin = typeof user !== "undefined";

    const navigate = useNavigate();

    const handleLoginClick: React.MouseEventHandler<HTMLElement> = (e) => {
        e.preventDefault();
        navigate("/login");
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
