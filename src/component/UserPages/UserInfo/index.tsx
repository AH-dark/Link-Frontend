import React, { FC, useMemo, useState } from "react";
import { Button, Card, Image, List, message, Pagination, Spin, Typography } from "antd";
import { GetAvatar } from "../../../utils/avatar";
import styles from "./userInfo.module.scss";
import { MailOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";
import CardItem from "./CardItem";
import { useGetShortLinkByUserQuery, useGetSiteConfigQuery, useGetUserQuery } from "../../../service/localApi";
import SiteConfig from "../../../model/data/SiteConfig";

const { Meta } = Card;
const { Title, Text } = Typography;

const min = (a: number, b: number) => {
    return a < b ? a : b;
};

const UserInfo: FC<{
    userId?: number;
}> = (props) => {
    const paramUserId = useParams<{ userId?: string }>().userId;
    const sessionUser = useGetUserQuery().data;
    const userId = useMemo<number | null>(() => {
        if (typeof paramUserId !== "undefined" && !isNaN(parseInt(paramUserId))) {
            return parseInt(paramUserId);
        } else if (typeof props.userId !== "undefined") {
            return props.userId;
        } else if (typeof sessionUser !== "undefined") {
            return sessionUser.id;
        } else {
            return null;
        }
    }, [paramUserId, props.userId, sessionUser]);

    const history = useHistory();

    if (userId === null) {
        message.error("无法获取 User ID").then(() => {
            history.goBack();
        });
    }

    const { data: userData, isLoading: load } = useGetUserQuery({ id: userId || undefined });
    const { data: userLinkData, isLoading: listLoad } = useGetShortLinkByUserQuery(userId || 0);

    const [page, setPage] = useState(1);

    const siteConfig = useGetSiteConfigQuery().data as SiteConfig;
    const url: URL = new URL(siteConfig.siteUrl);

    if (load) {
        return <Spin size={"large"} />;
    }

    if (typeof userData === "undefined" || typeof userLinkData === "undefined") {
        return <>{"Error."}</>;
    }

    return (
        <div className={styles.main}>
            <Card
                className={styles.infoCard}
                actions={[
                    <Button
                        shape={"circle"}
                        icon={<MailOutlined />}
                        title={"Mail to " + userData.name}
                        href={"mailto:" + userData.email}
                        target={"_top"}
                        rel={"mail"}
                    />,
                ]}
                loading={load}
            >
                <Meta
                    avatar={
                        <Image
                            src={GetAvatar(userData.email)}
                            preview={false}
                            placeholder={true}
                            alt={`avatar of ${userData.name}.`}
                            style={{
                                borderRadius: "50%",
                            }}
                        />
                    }
                    title={
                        <Title level={2} style={{ marginBottom: 8 }}>
                            {userData.name}
                        </Title>
                    }
                    description={<Text type={"secondary"}>{userData.description}</Text>}
                    className={styles.meta}
                />
            </Card>
            <Card className={styles.listCard}>
                <List
                    className={styles.list}
                    itemLayout="horizontal"
                    dataSource={userLinkData.slice((page - 1) * 5, min(page * 5, userLinkData.length))}
                    renderItem={(item) => <CardItem data={item} baseUrl={url} load={listLoad} />}
                />
            </Card>
            <div className={styles.paginationDiv}>
                <Pagination
                    defaultCurrent={1}
                    total={userLinkData.length}
                    current={page}
                    pageSize={5}
                    onChange={(page) => {
                        setPage(page);
                    }}
                    className={styles.pagination}
                />
            </div>
        </div>
    );
};

export default UserInfo;
