import React, { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MyState } from "../../../redux/reducer";
import User from "../../../model/data/User";
import { Button, Card, Image, List, message, Pagination, Spin, Typography } from "antd";
import { getUser } from "../../../middleware/API/user";
import { GetAvatar } from "../../../utils/avatar";
import styles from "./userInfo.module.scss";
import { getShortLinkByUser } from "../../../middleware/API/shortLink";
import ShortLink from "../../../model/data/ShortLink";
import { MailOutlined } from "@ant-design/icons";
import SiteConfig from "../../../model/data/SiteConfig";
import { addUserHash } from "../../../redux/action";
import { useHistory, useLocation } from "react-router-dom";
import CardItem from "./CardItem";

const { Meta } = Card;
const { Title, Text } = Typography;

const min = (a: number, b: number) => {
    return a < b ? a : b;
};

const UserInfo: FC<{
    userId?: number;
}> = (props) => {
    const { search } = useLocation();
    const paramUserId = useMemo(() => {
        return new URLSearchParams(search).get("userId");
    }, [search]);
    const sessionUser = useSelector<MyState, User | null>((state) => state.user);
    const userId = Number(paramUserId) || props.userId || sessionUser?.id;

    const history = useHistory();

    if (typeof userId === "undefined") {
        message.error("无法获取 User ID").then(() => {
            history.goBack();
        });
    }

    const [load, setLoad] = useState(true);
    const [listLoad, setListLoad] = useState(true);

    const [userData, setUserData] = useState<User>();
    const [userLinkData, setUserLinkData] = useState<ShortLink[]>([]);

    const [page, setPage] = useState(1);

    const dispatch = useDispatch();
    const userDataHash = useSelector<MyState, { [K: number]: User }>((state) => state.userHash);

    useEffect(() => {
        if (typeof userId !== "undefined") {
            if (userDataHash[userId]) {
                setUserData(userDataHash[userId]);
                setLoad(false);
                getShortLinkByUser(userId).then((r) => {
                    if (r !== null) {
                        setUserLinkData(r);
                        setListLoad(false);
                    } else {
                        message.error("获取用户链接列表时错误");
                    }
                });
            } else {
                getUser(userId).then((r) => {
                    if (r !== null) {
                        setUserData(r);
                        setLoad(false);
                        dispatch(addUserHash(r));
                        getShortLinkByUser(userId).then((r) => {
                            if (r !== null) {
                                setUserLinkData(r);
                                setListLoad(false);
                            } else {
                                message.error("获取用户链接列表时错误");
                            }
                        });
                    } else {
                        message.error("获取用户信息时错误");
                    }
                });
            }
        }
    }, [userId]);

    const siteConfig = useSelector<MyState, SiteConfig>((state) => state.site);
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
