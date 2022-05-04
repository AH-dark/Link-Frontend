import React, { FC } from "react";
import styles from "./ui.module.scss";
import { Button, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { MyState } from "../../../redux/reducer";
import { MenuOutlined } from "@ant-design/icons";
import { setSidebarOpen } from "../../../redux/action";
import LoginMenu from "./LoginMenu";
import { useHistory } from "react-router-dom";

const { Title } = Typography;

const NavBar: FC = () => {
    const open = useSelector<MyState, boolean>((state) => state.ui.sidebar.open);
    const title = useSelector<MyState, string | null>((state) => state.title);

    const dispatch = useDispatch();
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
