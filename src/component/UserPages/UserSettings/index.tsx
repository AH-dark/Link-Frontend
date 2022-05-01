import React, { FC, useEffect, useState } from "react";
import styles from "./userSettings.module.scss";
import { useSelector } from "react-redux";
import { MyState } from "../../../redux/reducer";
import User, { UserPutData } from "../../../model/data/User";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, Form, Input, message, Typography } from "antd";
import { GetAvatar } from "../../../utils/avatar";
import { useForm } from "antd/es/form/Form";
import { putUser } from "../../../middleware/API/user";

const { Text, Title } = Typography;
const { TextArea, Password } = Input;

interface FormData extends UserPutData {
    email?: string;
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
        password: "",
        id: user?.id || 0,
    });

    const handleSummit = (value: FormData) => {
        let tmp = value;
        if (tmp.password === "") {
            tmp.password = undefined;
        }

        putUser(tmp).then((r) => {
            if (r !== null) {
                setData({
                    ...value,
                    id: r.id,
                    name: r.name,
                    email: r.email,
                    description: r.description || "",
                    password: "",
                });
                message.success("更新成功");
            }
        });
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
                                <Password />
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
        </div>
    );
};

export default UserSettings;
