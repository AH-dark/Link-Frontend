import React, { FC } from "react";
import { Layout, Typography } from "antd";
import styles from "./ui.module.scss";
import classNames from "classnames";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const UI: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
    return (
        <Layout className={styles.root}>
            <Header className={styles.header}>
                <NavBar />
            </Header>
            <Layout className={styles.main}>
                <SideBar />
                <Layout className={styles.context}>
                    <Content className={classNames(styles.main, props.className)}>{props.children}</Content>
                    <Footer className={styles.footer}>
                        <Text>
                            {"Copyright © 2022 "}
                            <a href={"https://ahdark.com"} rel={"self noreferrer"} target={"_blank"}>
                                {"AHdark"}
                            </a>
                            {" All Right Reserved."}
                        </Text>
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default UI;
