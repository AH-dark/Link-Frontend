import React, { FC, useEffect } from "react";
import styles from "./login.module.scss";
import { Button, Checkbox, Form, Input, message, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import LoginData from "../../../model/data/LoginData";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hook";
import { setTitle } from "../../../redux/viewUpdate";
import { useGetUserQuery, useLoginMutation } from "../../../service/localApi";

const { Title } = Typography;

const Login: FC = () => {
    const history = useHistory();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle("Login"));
    }, []);

    const userQuery = useGetUserQuery();
    const [login, { isLoading }] = useLoginMutation();

    const onFinish = (values: LoginData) => {
        login(values)
            .unwrap()
            .then((r) => {
                if (typeof r !== "undefined") {
                    userQuery.refetch();
                    message.success("登录成功");
                    console.log("Login success.");
                    history.push("/");
                }
            })
            .catch((err) => {
                message.error(err.message);
                console.log(err);
            });
    };

    return (
        <div className={styles.main}>
            <Title>{"Login"}</Title>
            <Form className={styles.login} initialValues={{ remember: true }} onFinish={onFinish}>
                <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
                    <Input prefix={<MailOutlined style={{ marginRight: 2 }} />} type="email" placeholder="Email" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
                    <Input
                        prefix={<LockOutlined style={{ marginRight: 2 }} />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item className={styles.tools}>
                    <Form.Item name="remember" valuePropName="checked" noStyle className={styles.rememberMe}>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className={styles.forgot} href={"/forgot"}>
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <div className={styles.buttonArea}>
                        <Button type="primary" htmlType="submit" className={styles.loginButton} disabled={isLoading}>
                            {"Log in"}
                        </Button>
                        {/*
                             <span style={{ marginTop: 6 }}>
                             Or <a href="/register">register now!</a>
                             </span>
                             */}
                        <span style={{ marginTop: 6 }}>Register is disabled, please contact managers.</span>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
