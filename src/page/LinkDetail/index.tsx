import React, { FC, useEffect, useState } from "react";
import UI from "../../component/UI";
import styles from "./link.module.scss";
import { useParams } from "react-router-dom";
import ShortLink from "../../model/data/ShortLink";
import API from "../../middleware/API";
import { ApiResponse } from "../../model/ApiResponse";
import { Avatar, Spin, Table, Typography } from "antd";
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
        user_id: 0,
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
        }).then((res) => {
            if (res.status === 200) {
                console.log("[API]", "Get data success:", res.data.data);
                setLinkData(res.data.data);
                if (res.data.data.user_id > 0) {
                    API.get<ApiResponse<User>>("/user", {
                        params: {
                            id: res.data.data.user_id,
                        },
                        responseType: "json",
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                setUserData(res.data.data);
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
                <Table dataSource={dataSource} className={styles.table} pagination={{ position: [] }}>
                    <Column dataIndex="name" key="name" title={"Attributes"} />
                    <Column dataIndex="value" key="value" title={"Value"} />
                </Table>
            </div>
        </UI>
    );
};

export default LinkDetail;
