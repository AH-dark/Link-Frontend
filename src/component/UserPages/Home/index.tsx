import React, { FC, useEffect, useState } from "react";
import { Grid, Input, message, Typography } from "antd";
import styles from "./home.module.scss";
import { ShortLinkBasic } from "../../../model/data/ShortLink";
import { generateShortLink } from "../../../middleware/API/shortLink";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { setTitle } from "../../../redux/viewUpdate";

const { Title } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

const Index: FC = () => {
    const siteName = useAppSelector((state) => state.data.site.siteName);
    const user = useAppSelector((state) => state.data.user);

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setTitle("Home"));
    }, []);

    const [data, setData] = useState<ShortLinkBasic>({
        key: "",
        origin: "",
        userId: 0,
    });

    const [isLoad, setLoad] = useState(false);

    const history = useHistory();

    const handleSubmit = () => {
        if (!RegExp("^https?://([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$").test(data.origin)) {
            message.warning("Please enter a valid URL.");
            return;
        }

        setLoad(true);
        generateShortLink(data.origin, undefined, user !== null ? user.id : 0)
            .then((r) => {
                if (r !== null) {
                    message.success(
                        `Generating success: ${window.location.protocol}//${window.location.hostname}/go/${r.key}`
                    );
                    history.push("/link/" + r.key);
                }
            })
            .then(() => {
                setLoad(false);
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
                loading={isLoad}
            />
        </div>
    );
};

export default Index;
