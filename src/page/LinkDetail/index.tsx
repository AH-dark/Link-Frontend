import React, { FC, useEffect, useState } from "react";
import UI from "../../component/UI";
import styles from "./link.module.scss";
import { useParams } from "react-router-dom";
import ShortLink from "../../model/data/ShortLink";
import API from "../../middleware/API";
import ApiResponse from "../../model/ApiResponse";
import { Avatar, Button, Image, message, Spin, Table, Typography } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import User from "../../model/data/User";
import { GetAvatar } from "../../middleware/Avatar";
import { useDispatch } from "react-redux";
import { setTitle } from "../../redux/action";

const { Title, Text } = Typography;
const { Column } = Table;

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

    useEffect(() => {
        API.get<ApiResponse<ShortLink>>("/shortLink", {
            params: {
                key: key,
            },
            responseType: "json",
        })
            .then((res) => {
                if (res.status === 200 && res.data.code === 200) {
                    console.log("[API]", "Get short link data success:", res.data.data);
                    setLinkData(res.data.data);
                    if (res.data.data.userId > 0) {
                        API.get<ApiResponse<User>>("/user", {
                            params: {
                                id: res.data.data.userId,
                            },
                            responseType: "json",
                        })
                            .then((res) => {
                                if (res.status === 200) {
                                    console.log("[API]", "Get user data success:", res.data.data);
                                    setUserData(res.data.data);
                                }
                            })
                            .then(() => {
                                setLoad(false);
                            });
                    } else {
                        setLoad(false);
                    }
                } else {
                    message.error(`Error ${res.data.code}: ${res.data.message}`);
                }
            })
            .catch((err) => {
                message.error(err.response.data.message || err.message);
                console.log(err.message);
            });
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

    const dataSource: Array<{ name: string; value: React.ReactNode }> = [
        {
            name: "Shorten Url",
            value: `${window.location.protocol}//${window.location.hostname}/go/${linkData.key}`,
        },
        {
            name: "Origin Url",
            value: linkData.origin,
        },
        {
            name: "Creator",
            value:
                typeof userData !== "undefined" ? (
                    <span>
                        <Avatar src={GetAvatar(userData.email, 32)} size={"small"} style={{ marginRight: 8 }} />
                        <Text>{userData.name}</Text>
                    </span>
                ) : (
                    "Tourists"
                ),
        },
        {
            name: "Create Time",
            value: dayjs(linkData.create_time).locale("zh-cn").format("YYYY/MM/DD HH:mm:ss"),
        },
    ];

    return (
        <UI className={styles.root}>
            <div className={styles.main}>
                <Image
                    src={"https://api.ahdark.com/release/screenshot?url=" + encodeURI(linkData.origin)}
                    preview={false}
                    className={styles.preview}
                    fallback="data:image/png;base64,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"
                />
                <Table dataSource={dataSource} className={styles.table} pagination={{ position: [] }}>
                    <Column dataIndex="name" key="name" title={"Attributes"} />
                    <Column dataIndex="value" key="value" title={"Value"} />
                </Table>
                <Button
                    type={"primary"}
                    block
                    style={{ marginTop: 12 }}
                    href={"/go/" + linkData.key}
                    rel={"noopener"}
                    target={"_self"}
                >
                    {"Go"}
                </Button>
            </div>
        </UI>
    );
};

export default LinkDetail;
