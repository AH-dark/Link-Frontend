import React, { FC, useEffect, useState } from "react";
import UI from "../../component/UI";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../../redux/action";
import { Grid, Input, message, Typography } from "antd";
import { MyState } from "../../redux/reducer";
import styles from "./home.module.scss";
import API from "../../middleware/API";
import ShortLink, { ShortLinkBasic } from "../../model/data/ShortLink";
import ApiResponse from "../../model/ApiResponse";
import { useNavigate } from "react-router-dom";
import User from "../../model/data/User";

const { Title } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

const Index: FC = () => {
    const siteName = useSelector<MyState, string>((state) => state.site.siteName);
    const user = useSelector<MyState, User | undefined>((state) => state.user);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setTitle("Home"));
    }, []);

    const [data, setData] = useState<ShortLinkBasic>({
        key: "",
        origin: "",
        userId: 0,
    });

    const [isLoad, setLoad] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!RegExp("^https?://([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$").test(data.origin)) {
            message.warning("Please enter a valid URL.");
            return;
        }

        setLoad(true);
        let send = data;
        send.userId = send.userId === 0 && typeof user !== "undefined" ? user.id : send.userId;

        API.post<ApiResponse<ShortLink>>("/shortLink", send, {
            responseType: "json",
        })
            .then((res) => {
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        message.success(
                            `Generating success: ${window.location.protocol}//${window.location.hostname}/go/${res.data.data.key}`
                        );
                        navigate("/link/" + res.data.data.key);
                    } else {
                        message.error(`Error ${res.data.code}: ${res.data.message}`);
                    }
                }
            })
            .catch((err) => {
                message.error(err.response.data.message || err.message);
                console.log(err.message);
            })
            .then(() => {
                setLoad(false);
            });
    };

    const breakpoint = useBreakpoint();
    const isSmallDevice = breakpoint.sm;

    return (
        <UI className={styles.root}>
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
        </UI>
    );
};

export default Index;
