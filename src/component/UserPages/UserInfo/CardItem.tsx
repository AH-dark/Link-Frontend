import React from "react";
import ClipboardJS from "clipboard";
import { Button, List, message, Skeleton, Typography } from "antd";
import { ArrowRightOutlined, CopyOutlined, InfoCircleOutlined } from "@ant-design/icons";
import styles from "./userInfo.module.scss";
import ShortLink from "../../../model/data/ShortLink";
import { useHistory } from "react-router-dom";

const { Text } = Typography;

const CardItem: React.FC<{ data: ShortLink; baseUrl: URL; load: boolean }> = (props) => {
    const history = useHistory();
    const fullKeyUrl = `${props.baseUrl.origin}/go/${props.data.key}`;

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

    const infoUrl = "/link/" + props.data.key;

    const handleInfoClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        history.push(infoUrl);
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
                    href={props.data.origin}
                    target={"_blank"}
                    size={"middle"}
                    rel={"nofollow noopener ugc"}
                    type={"text"}
                    onClick={handleRedirectClick}
                />,
            ]}
            className={styles.item}
        >
            <Skeleton active avatar={false} paragraph={{ rows: 1 }} loading={props.load}>
                <List.Item.Meta
                    title={"Key: " + props.data.key}
                    description={
                        <Text copyable={false} className={styles.text} ellipsis={true}>
                            {props.data.origin}
                        </Text>
                    }
                />
            </Skeleton>
        </List.Item>
    );
};

export default CardItem;
