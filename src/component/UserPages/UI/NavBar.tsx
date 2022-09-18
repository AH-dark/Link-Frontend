import React, { FC } from "react";
import styles from "./ui.module.scss";
import { Button, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import LoginMenu from "./LoginMenu";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hook";
import { setSidebarOpen } from "redux/viewUpdate";

const { Title } = Typography;

const NavBar: FC = () => {
    const open = useAppSelector((state) => state.viewUpdate.sidebar.open);
    const title = useAppSelector((state) => state.viewUpdate.title);

    const dispatch = useAppDispatch();
    const history = useHistory();

    const handleMenuClick = () => {
        dispatch(setSidebarOpen(!open));
    };

    const handleTitleClick = () => {
        history.push("/");
    };

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
                <Title className={styles.title} onClick={handleTitleClick}>
                    {title || "Link"}
                </Title>
            </div>
            <div className={styles.rightArea}>
                <LoginMenu />
            </div>
        </div>
    );
};

export default NavBar;
