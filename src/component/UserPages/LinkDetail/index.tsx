import React, { FC, useEffect, useMemo } from "react";
import styles from "./link.module.scss";
import ShortLink from "../../../model/data/ShortLink";
import { Avatar, Badge, Button, Card, Image, List, message, Skeleton, Spin, Typography } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { GetAvatar } from "../../../utils/avatar";
import { CopyOutlined, UserOutlined } from "@ant-design/icons";
import ClipboardJS from "clipboard";
import { useHistory, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hook";
import { setTitle } from "../../../redux/viewUpdate";
import { useGetShortLinkQuery, useGetSiteConfigQuery, useGetUserQuery } from "../../../service/localApi";

const { Title, Text } = Typography;

const LinkDetail: FC = () => {
    const { key } = useParams<{ key: string }>();
    const { data: linkData, isLoading: isShortLinkLoading, isError: isShortLinkError } = useGetShortLinkQuery(key);
    const {
        data: userData,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useGetUserQuery({ id: linkData ? linkData.userId : 0 }, {});

    const history = useHistory();

    const imageUrl = useMemo<string>(() => {
        if (typeof linkData === "undefined") {
            return "";
        }

        let url: string = linkData.origin;
        if (url.indexOf("://") !== -1) {
            url = url.slice(url.indexOf("://") + "://".length);
        }
        return "https://screenshot.ahdark.com/" + url;
    }, [linkData]);

    const { data: siteConfig } = useGetSiteConfigQuery();

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setTitle("Link " + key));
    }, [key]);

    const url: URL = useMemo<URL>(
        () => (typeof siteConfig !== "undefined" ? new URL(siteConfig.siteUrl) : new URL(window.location.href)),
        [siteConfig]
    );

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

    const creatorButton = useMemo<JSX.Element>(
        () =>
            typeof userData !== "undefined" ? (
                <Button
                    icon={<UserOutlined />}
                    size={"middle"}
                    shape={"circle"}
                    onClick={() => {
                        history.push("/user/" + userData.id);
                    }}
                />
            ) : (
                <></>
            ),
        [userData]
    );

    const dataSource = useMemo<
        Array<{ name: string; key: string; value: React.ReactNode; buttons?: React.ReactNode[] }>
    >(() => {
        if (typeof linkData === "undefined") {
            return [];
        }

        return [
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
                        <>
                            <Avatar src={GetAvatar(userData.email, 32)} size={"small"} style={{ marginRight: 8 }} />
                            <Text ellipsis={true}>{userData.name}</Text>
                        </>
                    ) : (
                        "Tourists"
                    ),
                buttons: [creatorButton],
            },
            {
                name: "Create Time",
                key: "time",
                value: dayjs(linkData.createTime).format("YYYY/MM/DD HH:mm:ss"),
            },
        ];
    }, [linkData, userData]);

    if (isShortLinkLoading || isShortLinkError || isUserLoading || isUserError) {
        return (
            <div className={styles.main}>
                <Spin size={"large"} style={{ marginBottom: "2em" }} />
                <Title level={2}>{"Loading..."}</Title>
            </div>
        );
    }

    return (
        <div className={styles.main}>
            <div className={styles.details}>
                <Image
                    src={imageUrl}
                    className={styles.preview}
                    placeholder={true}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                />
                <Card className={styles.card}>
                    <List
                        itemLayout={"horizontal"}
                        dataSource={dataSource}
                        renderItem={(item) => {
                            return (
                                <List.Item actions={item.buttons} key={item.key} className={styles.listItem}>
                                    <Skeleton
                                        active
                                        title={false}
                                        avatar={false}
                                        paragraph={{ rows: 1 }}
                                        loading={isShortLinkLoading}
                                    >
                                        <List.Item.Meta
                                            title={item.name}
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
            <Badge
                className={styles["go-button-badge"]}
                count={(linkData as ShortLink).view}
                title={"View: " + (linkData as ShortLink).view}
            >
                <Button
                    type={"primary"}
                    block
                    href={url.origin + "/go/" + (linkData as ShortLink).key}
                    rel={"noopener"}
                    target={"_self"}
                    className={styles["go-button"]}
                >
                    {"Go"}
                </Button>
            </Badge>
        </div>
    );
};

export default LinkDetail;
