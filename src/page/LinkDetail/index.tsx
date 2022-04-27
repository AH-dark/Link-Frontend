import React, { FC, useEffect, useState } from "react";
import UI from "../../component/UI";
import styles from "./link.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import ShortLink from "../../model/data/ShortLink";
import { Avatar, Badge, Button, Card, Image, List, message, Skeleton, Spin, Typography } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import User from "../../model/data/User";
import { GetAvatar } from "../../utils/avatar";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../../redux/action";
import { MyState } from "../../redux/reducer";
import SiteConfig from "../../model/data/SiteConfig";
import { getShortLink } from "../../middleware/API/shortLink";
import { getUser } from "../../middleware/API/user";
import { CopyOutlined, UserOutlined } from "@ant-design/icons";
import ClipboardJS from "clipboard";

const { Title, Text } = Typography;

const LinkDetail: FC = () => {
    const params = useParams();
    const key = params.key;
    const [linkData, setLinkData] = useState<ShortLink>({
        key: key || "",
        origin: "",
        userId: 0,
        view: 0,
        create_time: new Date(),
    });
    const [userData, setUserData] = useState<User>();
    const [load, setLoad] = useState(true);

    const navigate = useNavigate();

    const siteConfig = useSelector<MyState, SiteConfig>((state) => state.site);

    useEffect(() => {
        if (typeof key !== "undefined") {
            getShortLink(key).then((r) => {
                if (r !== null) {
                    console.log("[API]", "Get short link data success:", r);
                    setLinkData(r);
                    if (r.userId > 0) {
                        getUser(r.userId)
                            .then((r) => {
                                if (r !== null) {
                                    setUserData(r);
                                }
                            })
                            .then(() => {
                                setLoad(false);
                            });
                    } else {
                        setLoad(false);
                    }
                }
            });
        } else {
            message.error("Param Key missed.");
        }
    }, [key]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setTitle("Link " + key));
    }, []);

    if (load) {
        return (
            <UI className={styles.root}>
                <div className={styles.main}>
                    <Spin size={"large"} style={{ marginBottom: "2em" }} />
                    <Title level={2}>{"Loading..."}</Title>
                </div>
            </UI>
        );
    }

    const url: URL = new URL(siteConfig.siteUrl);

    const copyFromText = (text: string) => (e: React.MouseEvent) => {
        const clipboard = new ClipboardJS(e.currentTarget, {
            text: () => {
                return text;
            },
        });

        clipboard.on("success", () => {
            message.success("内容已复制到剪贴板");
        });
        clipboard.on("error", (err) => {
            console.error(err);
            message.error("无法复制到剪贴板");
        });
    };

    let creatorButtonArray: React.ReactNode[] = [];
    if (typeof userData !== "undefined") {
        creatorButtonArray.push(
            <Button
                icon={<UserOutlined />}
                size={"middle"}
                shape={"circle"}
                onClick={() => {
                    navigate("/user/" + userData.id);
                }}
            />
        );
    }

    const dataSource: Array<{ name: string; key: string; value: React.ReactNode; buttons?: React.ReactNode[] }> = [
        {
            name: "Shorten Url",
            key: "url",
            value: <Text ellipsis={true}>{`${url.origin}/go/${linkData.key}`}</Text>,
            buttons: [
                <Button
                    icon={<CopyOutlined />}
                    size={"middle"}
                    shape={"circle"}
                    onClick={copyFromText(`${url.origin}/go/${linkData.key}`)}
                />,
            ],
        },
        {
            name: "Origin Url",
            key: "origin",
            value: <Text ellipsis={true}>{linkData.origin}</Text>,
            buttons: [
                <Button
                    icon={<CopyOutlined />}
                    size={"middle"}
                    shape={"circle"}
                    onClick={copyFromText(linkData.origin)}
                />,
            ],
        },
        {
            name: "Creator",
            key: "creator",
            value:
                typeof userData !== "undefined" ? (
                    <span>
                        <Avatar src={GetAvatar(userData.email, 32)} size={"small"} style={{ marginRight: 8 }} />
                        <Text ellipsis={true}>{userData.name}</Text>
                    </span>
                ) : (
                    "Tourists"
                ),
            buttons: creatorButtonArray,
        },
        {
            name: "Create Time",
            key: "time",
            value: dayjs(linkData.create_time).locale("zh-cn").format("YYYY/MM/DD HH:mm:ss"),
        },
    ];

    return (
        <UI className={styles.root}>
            <div className={styles.main}>
                <div className={styles.details}>
                    <Image
                        src={"https://api.ahdark.com/release/screenshot?url=" + encodeURI(linkData.origin)}
                        className={styles.preview}
                        placeholder={true}
                    />
                    <Card className={styles.card}>
                        <List
                            itemLayout={"horizontal"}
                            dataSource={dataSource}
                            renderItem={(item) => {
                                return (
                                    <List.Item actions={item.buttons} key={item.key}>
                                        <Skeleton
                                            active
                                            title={false}
                                            avatar={false}
                                            paragraph={{ rows: 1 }}
                                            loading={load}
                                        >
                                            <List.Item.Meta
                                                title={<Title level={5}>{item.name}</Title>}
                                                description={<Text ellipsis={true}>{item.value}</Text>}
                                            />
                                        </Skeleton>
                                    </List.Item>
                                );
                            }}
                            className={styles.list}
                        />
                    </Card>
                </div>
                <Badge className={styles["go-button-badge"]} count={linkData.view} title={"View: " + linkData.view}>
                    <Button
                        type={"primary"}
                        block
                        href={url.origin + "/go/" + linkData.key}
                        rel={"noopener"}
                        target={"_self"}
                        className={styles["go-button"]}
                    >
                        {"Go"}
                    </Button>
                </Badge>
            </div>
        </UI>
    );
};

export default LinkDetail;
