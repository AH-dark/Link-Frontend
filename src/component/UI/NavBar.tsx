import React, { FC } from "react";
import styles from "./ui.module.scss";
import { Avatar, Button, Image, Typography } from "antd";
import { useDispatch, useStore } from "react-redux";
import { MyState } from "../../redux/reducer";
import { LoginOutlined, MenuOutlined } from "@ant-design/icons";
import { setSidebarOpen } from "../../redux/action";
import { GetAvatar } from "../../middleware/Avatar";

const { Title } = Typography;

const NavBar: FC = () => {
    const store = useStore<MyState>();
    const state = store.getState();
    const title = state.title;

    const dispatch = useDispatch();

    const handleMenuClick = () => {
        const state = store.getState();
        dispatch(setSidebarOpen(!state.ui.sidebar.open));
    };

    const isLogin = state.user !== undefined;

    return (
        <div className={styles.container}>
            <div className={styles.leftArea}>
                <Button
                    type={"text"}
                    shape="circle"
                    icon={<MenuOutlined />}
                    size={"large"}
                    className={styles.icon}
                    onClick={handleMenuClick}
                />
                <Title className={styles.title}>{title || "Link"}</Title>
            </div>
            <div className={styles.rightArea}>
                {isLogin && state.user !== undefined ? (
                    <Avatar src={<Image src={GetAvatar(state.user.email, 32)} style={{ width: 32 }} />} />
                ) : (
                    <Button
                        type={"text"}
                        shape={"circle"}
                        icon={<LoginOutlined />}
                        size={"large"}
                        className={styles.icon}
                    />
                )}
            </div>
        </div>
    );
};

export default NavBar;
