import React, { FC, useState } from "react";
import { Grid, Layout, Menu } from "antd";
import styles from "./ui.module.scss";
import { useStore } from "react-redux";
import { MyState } from "../../redux/reducer";
import { HomeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import type { MenuInfo } from "rc-menu/lib/interface";

const { Sider } = Layout;
const { Item } = Menu;
const { useBreakpoint } = Grid;

const SideBar: FC = () => {
    const store = useStore<MyState>();
    const [open, setOpen] = useState(store.getState().ui.sidebar.open);
    store.subscribe(() => {
        const state = store.getState();
        setOpen(state.ui.sidebar.open);
    });

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
            </Menu>
        </Sider>
    );
};

export default SideBar;
