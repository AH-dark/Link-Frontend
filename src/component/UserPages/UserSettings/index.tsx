import React, { FC, useEffect, useState } from "react";
import styles from "./userSettings.module.scss";
import { useSelector } from "react-redux";
import { MyState } from "../../../redux/reducer";
import User, { UserPutData } from "../../../model/data/User";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, Form, Input, message, Modal, Typography } from "antd";
import { GetAvatar } from "../../../utils/avatar";
import { useForm } from "antd/es/form/Form";
import { putUser } from "../../../middleware/API/user";

const { Text, Title } = Typography;
const { TextArea, Password } = Input;

interface FormData extends UserPutData {
    email?: string;
    password?: undefined;
}

interface PasswordData {
    password: string;
    confirm: string;
}

const UserSettings: FC = () => {
    const user = useSelector<MyState, User | undefined>((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof user === "undefined") {
            message.warning("您还未登录");
            navigate("/login");
        }
    }, []);

    const [form] = useForm<FormData>();
    const [data, setData] = useState<FormData>({
        name: user?.name || "",
        email: user?.email || "",
        description: user?.description || "",
        id: user?.id || 0,
    });

    const handleSummit = (value: FormData) => {
        putUser(value).then((r) => {
            if (r !== null) {
                let d = {
                    ...value,
                    id: r.id,
                    name: r.name,
                    email: r.email,
                    description: r.description || "",
                };
                setData(d);
                message.success("更新成功");
                form.setFieldsValue(d);
            }
        });
    };

    const [passwordChangerOpen, setPasswordChangerOpen] = useState(false);
    const [passwordForm] = useForm<PasswordData>();

    const handlePasswordChangerOpen = () => {
        setPasswordChangerOpen(true);
    };

    const handlePasswordChangerClose = () => {
        setPasswordChangerOpen(false);
    };

    const handlePasswordChangerConfirm = () => {
        handlePasswordChangerClose();
        passwordForm.submit();
    };

    const handlePasswordChangerFinish = (e: PasswordData) => {
        if (e.password.length <= 6) {
            message.error("密码过短");
            return;
        }
        if (e.password !== e.confirm) {
            message.error("两次输入密码不相同");
            return;
        }

        putUser({
            id: user?.id || 0,
            password: e.password,
        })
            .then((r) => {
                if (r !== null) {
                    message.success("密码修改成功");
                }
            })
            .then(() => {
                passwordForm.resetFields();
            });

        return true;
    };

    if (typeof user === "undefined") {
        return <></>;
    }

    return (
        <div className={styles.main}>
            <Card className={styles.card}>
                <div className={styles.body}>
                    <Title level={1} className={styles.title}>
                        {"Settings"}
                    </Title>
                    <div className={styles.leftArea}>
                        <Avatar src={GetAvatar(user.email, 96)} size={96} />
                        <Typography className={styles.typo}>
                            <Title level={3} className={styles.userName}>
                                {user.name}
                            </Title>
                            <Text type={"secondary"} ellipsis={true}>
                                {user.description}
                            </Text>
                        </Typography>
                    </div>
                    <div className={styles.rightArea}>
                        <Title level={1} className={styles.title}>
                            {"Settings"}
                        </Title>
                        <Form
                            className={styles.form}
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                            onFinish={handleSummit}
                        >
                            <Form.Item key={"name"} name={"name"} label={"Name"}>
                                <Input value={data.name} defaultValue={data.name} />
                            </Form.Item>
                            <Form.Item key={"email"} name={"email"} label={"Email"}>
                                <Input value={data.email} defaultValue={data.email} disabled />
                            </Form.Item>
                            <Form.Item key={"password"} name={"password"} label={"Password (leave blank if no change)"}>
                                <Button type={"default"} htmlType={"button"} onClick={handlePasswordChangerOpen}>
                                    {"Change Password"}
                                </Button>
                            </Form.Item>
                            <Form.Item key={"description"} name={"description"} label={"Description"}>
                                <TextArea value={data.description} defaultValue={data.description} rows={4} />
                            </Form.Item>
                            <Button type={"primary"} htmlType={"submit"}>
                                {"Submit"}
                            </Button>
                        </Form>
                    </div>
                </div>
            </Card>
            <Modal
                title={"Change Password"}
                visible={passwordChangerOpen}
                onCancel={handlePasswordChangerClose}
                onOk={handlePasswordChangerConfirm}
                className={styles.modal}
            >
                <Form form={passwordForm} onFinish={handlePasswordChangerFinish}>
                    <Form.Item key={"password"} name={"password"} label={"Password"}>
                        <Password visibilityToggle={false} />
                    </Form.Item>
                    <Form.Item key={"confirm"} name={"confirm"} label={"Confirm"}>
                        <Password visibilityToggle={false} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserSettings;
