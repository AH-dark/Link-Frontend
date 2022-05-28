import React, { FC, useState } from "react";
import { Grid, Layout, Menu } from "antd";
import styles from "./ui.module.scss";
import { GlobalOutlined, HomeOutlined, LinkOutlined, LoginOutlined, ToolOutlined } from "@ant-design/icons";
import type { MenuInfo } from "rc-menu/lib/interface";
import { useHistory, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../redux/hook";
import { useGetUserQuery } from "../../../service/localApi";

const { Sider } = Layout;
const { Item } = Menu;
const { useBreakpoint } = Grid;

const SideBar: FC = () => {
    const open = useAppSelector((state) => state.viewUpdate.sidebar.open);
    const userData = useGetUserQuery().data;

    const breakpoint = useBreakpoint();
    const isMobileSize = !breakpoint.md;

    const location = useLocation();
    const history = useHistory();

    const [selected, setSelected] = useState([location.pathname]);
    const handleSelect = (e: MenuInfo) => {
        e.domEvent.preventDefault();
        setSelected(e.keyPath);
        history.push(e.key, { replace: false });
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
