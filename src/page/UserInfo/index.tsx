import React, { FC, useEffect, useState } from "react";
import UI from "../../component/UI";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MyState } from "../../redux/reducer";
import User from "../../model/data/User";
import { Button, Card, Image, List, message, Skeleton, Spin, Typography } from "antd";
import { getUser } from "../../middleware/API/user";
import { GetAvatar } from "../../utils/avatar";
import styles from "./userInfo.module.scss";
import { getShortLinkByUser } from "../../middleware/API/shortLink";
import ShortLink from "../../model/data/ShortLink";
import { ArrowRightOutlined, CopyOutlined, InfoCircleOutlined } from "@ant-design/icons";
import SiteConfig from "../../model/data/SiteConfig";
import ClipboardJS from "clipboard";

const { Meta } = Card;
const { Title, Text } = Typography;

const UserInfo: FC<{
    userId?: number;
}> = (props) => {
    const paramUserId = useParams().userId;
    const sessionUser = useSelector<MyState, User | undefined>((state) => state.user);
    const userId = Number(paramUserId) || props.userId || sessionUser?.id;

    const navigate = useNavigate();

    if (typeof userId === "undefined") {
        message.error("无法获取 User ID").then(() => {
            window.history.back();
        });
    }

    const [load, setLoad] = useState(true);
    const [listLoad, setListLoad] = useState(true);
    const [user, setUser] = useState<User>();
    const [userLinkData, setUserLinkData] = useState<ShortLink[]>();

    useEffect(() => {
        if (typeof userId !== "undefined") {
            getUser(userId).then((r) => {
                if (r !== null) {
                    setUser(r);
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
                    message.error("获取用户信息时错误");
                }
            });
        }
    }, []);

    const siteConfig = useSelector<MyState, SiteConfig>((state) => state.site);
    const url: URL = new URL(siteConfig.siteUrl);

    if (load) {
        return (
            <UI>
                <Spin size={"large"} />
            </UI>
        );
    }

    if (typeof user === "undefined" || typeof userLinkData === "undefined") {
        return <UI>{"Error."}</UI>;
    }

    return (
        <UI className={styles.root}>
            <div>
                <Card className={styles.infoCard}>
                    <Meta
                        avatar={
                            <Image
                                src={GetAvatar(user.email)}
                                preview={false}
                                placeholder={true}
                                alt={`avatar of ${user.name}.`}
                                style={{
                                    borderRadius: "50%",
                                }}
                            />
                        }
                        title={
                            <Title level={2} style={{ marginBottom: 8 }}>
                                {user.name}
                            </Title>
                        }
                        description={<Text type={"secondary"}>{user.description}</Text>}
                        className={styles.meta}
                    />
                </Card>
                <Card className={styles.listCard}>
                    <List
                        className={styles.list}
                        itemLayout="horizontal"
                        loadMore={listLoad}
                        dataSource={userLinkData}
                        renderItem={(item) => {
                            const fullKeyUrl = `${url.origin}/go/${item.key}`;

                            const handleCopyClick = (e: React.MouseEvent<HTMLDivElement>) => {
                                const clipboard = new ClipboardJS(e.currentTarget, {
                                    text: () => {
                                        return fullKeyUrl;
                                    },
                                });

                                clipboard.on("success", () => {
                                    message.success("内容已复制到剪贴板");
                                });
                                clipboard.on("error", () => {
                                    message.error("无法复制到剪贴板");
                                });
                            };

                            const infoUrl = "/link/" + item.key;

                            const handleInfoClick = (e: React.MouseEvent<HTMLDivElement>) => {
                                e.preventDefault();
                                navigate(infoUrl);
                            };

                            const handleRedirectClick = (e: React.MouseEvent<HTMLDivElement>) => {
                                e.preventDefault();
                                window.open(fullKeyUrl);
                            };

                            return (
                                <List.Item
                                    actions={[
                                        <Button
                                            shape={"circle"}
                                            title={"Copy"}
                                            icon={<CopyOutlined />}
                                            size={"middle"}
                                            rel={"copy"}
                                            onClick={handleCopyClick}
                                            type={"text"}
                                        />,
                                        <Button
                                            shape={"circle"}
                                            title={"Info"}
                                            icon={<InfoCircleOutlined />}
                                            size={"middle"}
                                            rel={"self"}
                                            href={infoUrl}
                                            onClick={handleInfoClick}
                                            type={"text"}
                                        />,
                                        <Button
                                            shape={"circle"}
                                            title={"Go"}
                                            icon={<ArrowRightOutlined />}
                                            href={item.origin}
                                            target={"_blank"}
                                            size={"middle"}
                                            rel={"nofollow noopener ugc"}
                                            type={"text"}
                                            onClick={handleRedirectClick}
                                        />,
                                    ]}
                                    className={styles.item}
                                >
                                    <Skeleton active avatar={false} paragraph={{ rows: 1 }} loading={listLoad}>
                                        <List.Item.Meta
                                            title={
                                                <Title
                                                    level={5}
                                                    style={{ marginBottom: 0 }}
                                                    copyable={false}
                                                    ellipsis={true}
                                                >
                                                    {"Key: " + item.key}
                                                </Title>
                                            }
                                            description={
                                                <Text copyable={false} italic className={styles.text} ellipsis={true}>
                                                    {item.origin}
                                                </Text>
                                            }
                                        />
                                    </Skeleton>
                                </List.Item>
                            );
                        }}
                    />
                </Card>
            </div>
        </UI>
    );
};

export default UserInfo;
