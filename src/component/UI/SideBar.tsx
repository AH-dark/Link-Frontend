import React, { FC, useState } from "react";
import { Grid, Layout, Menu } from "antd";
import styles from "./ui.module.scss";
import { useSelector } from "react-redux";
import { MyState } from "../../redux/reducer";
import { GlobalOutlined, HomeOutlined, LinkOutlined, LoginOutlined, ToolOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import type { MenuInfo } from "rc-menu/lib/interface";
import User from "../../model/data/User";

const { Sider } = Layout;
const { Item } = Menu;
const { useBreakpoint } = Grid;

const SideBar: FC = () => {
    const open = useSelector<MyState, boolean>((state) => state.ui.sidebar.open);
    const userData = useSelector<MyState, User | undefined>((state) => state.user);

    const breakpoint = useBreakpoint();
    const isMobileSize = !breakpoint.md;

    const location = useLocation();
    const navigate = useNavigate();

    const [selected, setSelected] = useState([location.pathname]);
    const handleSelect = (e: MenuInfo) => {
        e.domEvent.preventDefault();
        setSelected(e.keyPath);
        navigate(e.key);
    };

    return (
        <Sider width={isMobileSize ? "100vw" : 240} className={styles.sider} collapsed={!open} collapsedWidth={0}>
            <Menu theme={"light"} className={styles.menu} selectedKeys={selected} onClick={handleSelect}>
                <Item key="/" icon={<HomeOutlined />} className={styles.menuItem}>
                    {"Home"}
                </Item>
                <Item key="/explorer" icon={<GlobalOutlined />} className={styles.menuItem}>
                    {"Explorer"}
                </Item>
                {typeof userData === "undefined" ? (
                    <Item key="/login" icon={<LoginOutlined />} className={styles.menuItem}>
                        {"Login"}
                    </Item>
                ) : (
                    <>
                        <Item key="/generate" icon={<LinkOutlined />} className={styles.menuItem}>
                            {"Generate"}
                        </Item>
                        <Item key="/settings" icon={<ToolOutlined />} className={styles.menuItem}>
                            {"Settings"}
                        </Item>
                    </>
                )}
            </Menu>
        </Sider>
    );
};

export default SideBar;
