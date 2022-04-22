import React, { FC, useEffect, useState } from "react";
import UI from "../../component/UI";
import styles from "./login.module.scss";
import { Button, Checkbox, Form, Input, message, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import API from "../../middleware/API";
import LoginData from "../../model/data/LoginData";
import ApiResponse from "../../model/ApiResponse";
import User from "../../model/data/User";
import { useDispatch, useSelector } from "react-redux";
import { setUserLogin } from "../../redux/action";
import { MyState } from "../../redux/reducer";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login: FC = () => {
    const navigate = useNavigate();

    const userData = useSelector<MyState, User | undefined>((state) => state.user);

    useEffect(() => {
        if (typeof userData !== "undefined") {
            message.warning("您已经登录");
            navigate("/");
        }
    });

    const [load, setLoad] = useState(false);

    const dispatch = useDispatch();

    const onFinish = (values: LoginData) => {
        console.log("Received values of login form: ", values);
        setLoad(true);
        API.post<ApiResponse<User>>("/login", values, {
            responseType: "json",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        dispatch(setUserLogin(res.data.data));
                        localStorage.setItem("loginInfo", res.data.data.name);
                        message.success("登录成功");
                        console.log("Login success.");
                        navigate("/");
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
                            <Button type="primary" htmlType="submit" className={styles.loginButton} disabled={load}>
                                Log in
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
        </UI>
    );
};

export default Login;
