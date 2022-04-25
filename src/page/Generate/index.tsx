import React, { FC, useEffect, useState } from "react";
import UI from "../../component/UI";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../../redux/action";
import styles from "./generate.module.scss";
import { Alert, Avatar, Button, Col, Form, Input, message, Row, Typography } from "antd";
import { InfoCircleOutlined, LinkOutlined, TagOutlined, UserOutlined } from "@ant-design/icons";
import { MyState } from "../../redux/reducer";
import User from "../../model/data/User";
import { GetAvatar } from "../../utils/avatar";
import API from "../../middleware/API";
import ApiResponse from "../../model/ApiResponse";
import ShortLink, { ShortLinkBasic } from "../../model/data/ShortLink";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const { Title } = Typography;

const Generate: FC = () => {
    const dispatch = useDispatch();
    dispatch(setTitle("Generate"));

    const navigate = useNavigate();

    const user = useSelector<MyState, User | undefined>((state) => state.user);
    const isUserAvailable = typeof user !== "undefined" && user.available;

    useEffect(() => {
        if (!isUserAvailable) {
            message.error("Permission Denied.");
            navigate("/");
        }
    }, []);

    const [form] = Form.useForm<{
        origin: string;
        key: string;
    }>();
    const origin = Form.useWatch<string>("origin", form);
    const key = Form.useWatch<string>("key", form);

    const [load, setLoad] = useState(false);

    const submit = () => {
        if (!RegExp("^https?://([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$").test(origin)) {
            message.warning("Please enter a valid URL.");
            return;
        }
        if (key.length <= 3) {
            message.warning("Please enter a longer Key");
            return;
        }

        setLoad(true);
        API.post<ApiResponse<ShortLink>, AxiosResponse<ApiResponse<ShortLink>, ShortLinkBasic>, ShortLinkBasic>(
            "/shortLink",
            {
                key: key,
                origin: origin,
                userId: user?.id || 0,
            },
            {
                responseType: "json",
            }
        )
            .then((res) => {
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        message.success(
                            `Generating success: ${window.location.protocol}//${window.location.hostname}/go/${res.data.data.key}`
                        );
                        setTimeout(() => {
                            navigate("/link/" + res.data.data.key);
                        }, 1500);
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

    return (
        <UI className={styles.root}>
            <div className={styles.main}>
                <Title>{"Generate"}</Title>
                <Alert
                    type={"info"}
                    message={"Notice"}
                    description={"在本页面生成短链接支持自定义后缀。"}
                    className={styles.alert}
                    showIcon
                    closable
                />
                <Form className={styles.form} form={form} layout="vertical" autoComplete="off">
                    <Col>
                        <Form.Item
                            name={"origin"}
                            style={{
                                marginBottom: 16,
                            }}
                        >
                            <Input
                                size={"large"}
                                placeholder={"Link"}
                                prefix={<LinkOutlined style={{ marginRight: 4 }} />}
                                allowClear
                            />
                        </Form.Item>
                        <Row
                            justify={"space-between"}
                            align={"middle"}
                            style={{
                                marginBottom: 16,
                            }}
                        >
                            <Col
                                span={12}
                                style={{
                                    paddingRight: 4,
                                }}
                            >
                                <Form.Item name={"key"} style={{ marginBottom: 4 }}>
                                    <Input
                                        size={"large"}
                                        placeholder={"Key"}
                                        prefix={<TagOutlined style={{ marginRight: 4 }} />}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col
                                span={12}
                                style={{
                                    paddingLeft: 4,
                                }}
                            >
                                <div style={{ marginBottom: 4 }}>
                                    <Input
                                        size={"large"}
                                        placeholder={"Creator"}
                                        prefix={
                                            isUserAvailable ? (
                                                <Avatar
                                                    src={GetAvatar(user?.email)}
                                                    size={"small"}
                                                    style={{ marginRight: 4 }}
                                                />
                                            ) : (
                                                <UserOutlined style={{ marginRight: 4 }} />
                                            )
                                        }
                                        disabled={true}
                                        value={user?.name}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Button
                                type={"primary"}
                                htmlType={"submit"}
                                size={"large"}
                                style={{
                                    height: "100%",
                                    width: "100%",
                                }}
                                disabled={!isUserAvailable || load}
                                onClick={submit}
                            >
                                {"Submit"}
                            </Button>
                        </Row>
                    </Col>
                </Form>
            </div>
        </UI>
    );
};

export default Generate;
