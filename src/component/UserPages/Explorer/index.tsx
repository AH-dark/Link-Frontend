import React, { FC, useEffect, useState } from "react";
import styles from "./explorer.module.scss";
import ShortLink from "../../../model/data/ShortLink";
import { getLatestShortLink } from "../../../middleware/API/shortLink";
import { Badge, Button, Card, List, message, Spin, Typography } from "antd";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import User from "../../../model/data/User";
import { getUser } from "../../../middleware/API/user";

const { Text } = Typography;

interface UserHashList {
    [K: number]: User;
}

interface UserHash {
    [K: number]: boolean;
}

const Explorer: FC = () => {
    const [data, setData] = useState<ShortLink[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [userHash, setUserHash] = useState<UserHashList>({});
    const addUserHash = (id: number, user: User) => {
        setUserHash({
            ...userHash,
            [id]: user,
        });
    };

    useEffect(() => {
        const height = window.innerHeight;
        let column = ~~((height - 64 - 78) / 112) - 1;
        if (window.innerWidth >= 780) {
            column *= 2;
        }
        column = column >= 5 ? column : 5;
        console.log("Will request " + column + " data.");
        getLatestShortLink(column, page).then((r) => {
            if (r !== null) {
                setData(r);
                let arr: Promise<boolean>[] = [];
                let userHashTemp: UserHash = {};
                for (let k in userHash) {
                    userHashTemp[k] = true;
                }
                for (let k in r) {
                    const shortLink: ShortLink = r[k];
                    const userId = shortLink.userId;
                    if (userId && userId > 0 && !userHashTemp[userId]) {
                        userHashTemp[userId] = true;
                        arr.push(
                            getUser(userId).then((r) => {
                                if (r !== null) {
                                    addUserHash(userId, r);
                                    return true;
                                } else {
                                    return false;
                                }
                            })
                        );
                    }
                }
                Promise.all(arr).then((r) => {
                    setLoading(false);
                    const successNum = r.filter(Boolean).length;
                    console.log(
                        "Get all user data success.\n",
                        `Success: ${successNum}/${r.length}\n`,
                        `Error: ${r.length - successNum}/${r.length}`
                    );
                });
            } else {
                message.error("Error when get data.");
            }
        });
    }, [page]);

    if (loading) {
        return <Spin size={"large"} />;
    }

    return (
        <div className={styles.main}>
            <List
                className={styles.list}
                dataSource={data}
                renderItem={({ key, origin, userId, view }) => {
                    const handleInfoIcon = (e: React.MouseEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        navigate("/link/" + key);
                    };

                    const handleUserIcon = (e: React.MouseEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        navigate("/user/" + userId);
                    };

                    let actions: React.ReactNode[] = [];

                    if (userId !== undefined && userId !== 0) {
                        actions.push(
                            <Button
                                type={"text"}
                                shape={"circle"}
                                icon={<UserOutlined />}
                                size={"middle"}
                                href={"/user/" + userId}
                                target={"_self"}
                                title={userHash[userId].name}
                                onClick={handleUserIcon}
                                rel={"author"}
                            />
                        );
                    }

                    actions.push(
                        <Button
                            type={"text"}
                            shape={"circle"}
                            icon={<InfoCircleOutlined />}
                            size={"middle"}
                            href={"/link/" + key}
                            target={"_self"}
                            title={key}
                            onClick={handleInfoIcon}
                            rel={"info"}
                        />
                    );

                    const creatorName = userId !== undefined && userId !== 0 ? userHash[userId].name : "Tourist";

                    return (
                        <Badge count={"View: " + view} className={styles.badge} size={"small"}>
                            <Card className={styles.card}>
                                <List.Item className={styles.listItem} actions={actions}>
                                    <List.Item.Meta
                                        title={"Key: " + key}
                                        className={styles.meta}
                                        description={
                                            <>
                                                <Text type={"secondary"} ellipsis>
                                                    {origin}
                                                </Text>
                                                <br />
                                                <Text type={"secondary"} ellipsis>
                                                    {"Created by " + creatorName}
                                                </Text>
                                            </>
                                        }
                                    />
                                </List.Item>
                            </Card>
                        </Badge>
                    );
                }}
            />
        </div>
    );
};

export default Explorer;
