import React, { FC } from "react";
import styles from "./ui.module.scss";
import { Avatar, Button, Typography } from "antd";
import { useDispatch, useSelector, useStore } from "react-redux";
import { MyState } from "../../redux/reducer";
import { LoginOutlined, MenuOutlined } from "@ant-design/icons";
import { setSidebarOpen } from "../../redux/action";
import { GetAvatar } from "../../utils/avatar";
import User from "../../model/data/User";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const NavBar: FC = () => {
    const store = useStore<MyState>();
    const title = useSelector<MyState, string | null>((state) => state.title);
    const userData = useSelector<MyState, User | undefined>((state) => state.user);

    const dispatch = useDispatch();

    const handleMenuClick = () => {
        const state = store.getState();
        dispatch(setSidebarOpen(!state.ui.sidebar.open));
    };

    const navigate = useNavigate();

    const handleLoginClick: React.MouseEventHandler<HTMLElement> = (e) => {
        e.preventDefault();
        navigate("/login");
    };

    const isLogin = userData !== undefined;

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
                {isLogin ? (
                    <Avatar src={GetAvatar(userData.email, 32)} />
                ) : (
                    <Button
                        type={"text"}
                        shape={"circle"}
                        icon={<LoginOutlined />}
                        size={"large"}
                        className={styles.icon}
                        onClick={handleLoginClick}
                        href={"/login"}
                    />
                )}
            </div>
        </div>
    );
};

export default NavBar;
