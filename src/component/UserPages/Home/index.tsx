import React, { FC, useEffect, useState } from "react";
import { Grid, Input, message, Typography } from "antd";
import styles from "./home.module.scss";
import { ShortLinkBasic } from "model/data/ShortLink";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "redux/hook";
import { setTitle } from "redux/viewUpdate";
import { useGetSiteConfigQuery, useGetUserQuery, usePostShortLinkMutation } from "service/localApi";

const { Title } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

const Index: FC = () => {
    const { siteName } = useGetSiteConfigQuery().data || { siteName: "Link" };
    const user = useGetUserQuery().data;

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setTitle("Home"));
    }, []);

    const [data, setData] = useState<ShortLinkBasic>({
        key: "",
        origin: "",
        userId: 0,
    });

    const history = useHistory();

    const [generateLink, { isLoading }] = usePostShortLinkMutation();

    const handleSubmit = () => {
        if (!RegExp("^https?://([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$").test(data.origin)) {
            message.warning("Please enter a valid URL.");
            return;
        }
        generateLink({
            origin: data.origin,
            key: undefined,
            userId: user !== null && typeof user !== "undefined" ? user.id : 0,
        })
            .unwrap()
            .then((r) => {
                if (typeof r !== "undefined") {
                    message.success("Generate success.");
                    history.push("/link/" + r.key);
                }
            });
    };

    const breakpoint = useBreakpoint();
    const isSmallDevice = breakpoint.sm;

    return (
        <div className={styles.main}>
            <Title>{siteName}</Title>
            <Search
                placeholder="Enter your url"
                allowClear
                enterButton="Shorten"
                size="large"
                onSearch={handleSubmit}
                style={{ width: isSmallDevice ? 480 : "90%" }}
                onChange={(e) => {
                    setData({
                        ...data,
                        origin: e.target.value,
                    });
                }}
                value={data.origin}
                loading={isLoading}
            />
        </div>
    );
};

export default Index;
