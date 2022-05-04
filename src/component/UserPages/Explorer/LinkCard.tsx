import React from "react";
import styles from "./explorer.module.scss";
import { Badge, Button, Card, List, Typography } from "antd";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { MyState } from "../../../redux/reducer";
import { useHistory } from "react-router-dom";

const { Text } = Typography;

const LinkCard: React.FC<{
    linkKey: string;
    origin: string;
    userId: number;
    view: number;
}> = ({ linkKey, origin, userId, view }) => {
    const userDataHash = useSelector((state: MyState) => state.userHash);

    const history = useHistory();

    const handleInfoIcon = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        history.push("/link/" + linkKey);
    };

    const handleUserIcon = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        history.push("/user/" + userId);
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
                title={userDataHash[userId].name}
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
            href={"/link/" + linkKey}
            target={"_self"}
            title={linkKey}
            onClick={handleInfoIcon}
            rel={"info"}
        />
    );

    const creatorName = userId !== undefined && userId !== 0 ? userDataHash[userId].name : "Tourist";

    return (
        <Badge count={"View: " + view} className={styles.badge} size={"small"}>
            <Card className={styles.card}>
                <List.Item className={styles.listItem} actions={actions}>
                    <List.Item.Meta
                        title={"Key: " + linkKey}
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
};

export default LinkCard;
