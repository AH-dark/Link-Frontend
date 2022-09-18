import React, { useEffect, useMemo, useState } from "react";
import styles from "./editor.module.scss";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import User from "model/data/User";
import { DesktopDateTimePicker } from "@mui/x-date-pickers";
import { useSnackbar } from "notistack";
import { useHistory, useParams } from "react-router-dom";
import { useCreateUserMutation, useGetUserQuery, usePutUserMutation } from "service/rootApi";
import { useGetUserQuery as useGetUserQueryOnUserPermission } from "service/localApi";

const Editor: React.FC = () => {
    const { data: currentUser, refetch, isLoading: isGettingCurrentUser } = useGetUserQueryOnUserPermission();

    const history = useHistory();
    const { id } = useParams<{ id?: string }>();

    const isCreate = useMemo<boolean>(() => {
        if (typeof id === "undefined") {
            return true;
        }
        const userId: number = parseInt(id);
        if (isNaN(userId)) {
            return true;
        }
        console.log("[Editor]", `Editing user ${userId}`);
        return userId <= 0;
    }, [id]);

    const {
        isLoading: isGettingUser,
        data: userData,
        isError,
    } = useGetUserQuery({ id: typeof id !== "undefined" && !isNaN(parseInt(id)) ? parseInt(id) : 0 });
    const [originData, setOriginData] = useState<User>({
        id: -1,
        name: "",
        email: "",
        password: "",
        description: "",
        role: 0,
        registerIP: "",
        available: false,
        createTime: new Date(),
        loginTime: new Date(),
    });
    const [data, setData] = useState<User>({
        id: -1,
        name: "",
        email: "",
        password: "",
        description: "",
        role: 0,
        registerIP: "",
        available: false,
        createTime: new Date(),
        loginTime: new Date(),
    });

    useEffect(() => {
        if (typeof userData !== "undefined" && !isGettingUser && !isCreate) {
            setOriginData(userData);
            setData(userData);
        }
    }, [userData, isGettingUser, isCreate]);

    const [dataError, setDataError] = useState({
        email: false,
        registerIP: false,
    });

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!RegExp("^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$").test(data.email) && data.email !== "") {
            setDataError({
                ...dataError,
                email: true,
            });
        } else {
            setDataError({
                ...dataError,
                email: false,
            });
        }
    }, [data.email]);

    useEffect(() => {
        if (
            !RegExp("^((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}$").test(
                data.registerIP
            ) &&
            data.registerIP !== ""
        ) {
            setDataError({
                ...dataError,
                registerIP: true,
            });
        } else {
            setDataError({
                ...dataError,
                registerIP: false,
            });
        }
    }, [data.registerIP]);

    const handleFormChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setData({ ...data, [name]: e.target.value });
    };

    const [putUser] = usePutUserMutation();
    const [createUser] = useCreateUserMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isCreate) {
            putUser(data)
                .unwrap()
                .then((r) => {
                    if (typeof r !== "undefined") {
                        setData(r);
                        setOriginData(r);
                        if (r.id === currentUser?.id) {
                            refetch();
                        }
                        enqueueSnackbar("Set data success.", {
                            variant: "success",
                        });
                        history.goBack();
                    } else {
                        enqueueSnackbar("Updated failed, unknown error.", {
                            variant: "error",
                        });
                    }
                })
                .catch((err) => {
                    enqueueSnackbar(`Error ${err.data.code}: ${err.data.message}`, {
                        variant: "error",
                    });
                });
        } else {
            let tmp: any = data;
            tmp.id = undefined;
            tmp.createTime = undefined;
            tmp.loginTime = undefined;
            createUser(tmp)
                .unwrap()
                .then((r) => {
                    if (typeof r !== "undefined") {
                        setData(r);
                        setOriginData(r);
                        enqueueSnackbar("Add user success.", {
                            variant: "success",
                        });
                        window.history.back();
                    } else {
                        enqueueSnackbar("Created failed, unknown error.");
                    }
                })
                .catch((err) => {
                    enqueueSnackbar(
                        typeof err.response.data !== "undefined"
                            ? `Error ${err.response.data.code}: ${err.response.data.message}`
                            : err.message
                    );
                });
        }
    };

    if (isGettingCurrentUser || isGettingUser) {
        return <CircularProgress />;
    }

    if (isError) {
        return <>Error.</>;
    }

    return (
        <Paper className={styles.root}>
            <Typography variant={"h5"} component={"h2"} className={styles.title}>
                {id ? "Edit " + originData.name : "Create user"}
            </Typography>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Box className={styles.row}>
                    <TextField
                        key={"name"}
                        onChange={handleFormChange("name")}
                        type={"name"}
                        label={"Name"}
                        variant="standard"
                        fullWidth
                        required
                        value={data.name}
                    />
                </Box>
                <Box className={styles.row}>
                    <TextField
                        key={"email"}
                        onChange={handleFormChange("email")}
                        type={"email"}
                        label={"Email"}
                        variant="standard"
                        fullWidth
                        required
                        value={data.email}
                        error={dataError.email}
                    />
                </Box>
                <Box className={styles.row}>
                    <TextField
                        key={"password"}
                        onChange={handleFormChange("password")}
                        type={"password"}
                        label={"Password"}
                        variant="standard"
                        fullWidth
                        required={!id}
                        helperText={"Leave blank if not modify"}
                    />
                </Box>
                <Box className={styles.row}>
                    <TextField
                        key={"description"}
                        onChange={handleFormChange("description")}
                        type={"text"}
                        variant="standard"
                        value={data.description}
                        required={false}
                        multiline
                        minRows={4}
                        label={"Description"}
                        fullWidth
                    />
                </Box>
                <Box className={styles.row}>
                    <FormControl fullWidth variant="standard">
                        <InputLabel sx={{ margin: 0 }}>Role</InputLabel>
                        <Select
                            key={"role"}
                            value={data.role === 0 ? "User" : "Manager"}
                            label="Role"
                            onChange={(e) => {
                                switch (e.target.value) {
                                    case "User":
                                        setData({
                                            ...data,
                                            role: 0,
                                        });
                                        break;
                                    case "Manager":
                                        setData({
                                            ...data,
                                            role: 1,
                                        });
                                        break;
                                }
                            }}
                            disabled={data.id === currentUser?.id}
                            fullWidth
                            labelId={"Role"}
                            required={!id}
                        >
                            <MenuItem value={"User"}>User</MenuItem>
                            <MenuItem value={"Manager"}>Manager</MenuItem>
                        </Select>
                        {data.id === currentUser?.id && <FormHelperText>Could not edit self setting</FormHelperText>}
                    </FormControl>
                </Box>
                <Box className={styles.row}>
                    <FormControl fullWidth variant="standard">
                        <InputLabel sx={{ margin: 0 }}>Available</InputLabel>
                        <Select
                            key={"Available"}
                            value={data.available ? "true" : "false"}
                            label="Available"
                            onChange={(e) => {
                                switch (e.target.value) {
                                    case "true":
                                        setData({
                                            ...data,
                                            available: true,
                                        });
                                        break;
                                    case "false":
                                        setData({
                                            ...data,
                                            available: false,
                                        });
                                        break;
                                }
                            }}
                            disabled={data.id === currentUser?.id}
                            fullWidth
                            labelId={"Available"}
                            required={!id}
                        >
                            <MenuItem value={"true"}>Active</MenuItem>
                            <MenuItem value={"false"}>Inactive</MenuItem>
                        </Select>
                        {data.id === currentUser?.id && <FormHelperText>Could not edit self setting</FormHelperText>}
                    </FormControl>
                </Box>
                <Box className={styles.row}>
                    <TextField
                        key={"registerIP"}
                        onChange={handleFormChange("registerIP")}
                        type={"text"}
                        label={"Register IP"}
                        variant="standard"
                        fullWidth
                        value={data.registerIP}
                        error={dataError.registerIP}
                    />
                </Box>
                {!isCreate && (
                    <>
                        <Box className={styles.row}>
                            <DesktopDateTimePicker
                                renderInput={(props) => (
                                    <TextField type={"date"} variant={"standard"} fullWidth {...props} />
                                )}
                                label="Create Time"
                                value={data.createTime}
                                onChange={(newValue) => {
                                    if (newValue !== null) {
                                        setData({
                                            ...data,
                                            createTime: newValue,
                                        });
                                    }
                                }}
                                hideTabs
                                disableFuture
                                inputFormat="YYYY/MM/DD HH:mm:ss"
                            />
                        </Box>
                        <Box className={styles.row}>
                            <DesktopDateTimePicker
                                renderInput={(props) => (
                                    <TextField type={"date"} variant={"standard"} fullWidth {...props} />
                                )}
                                label="Login Time"
                                value={data.loginTime}
                                onChange={(newValue) => {
                                    if (newValue !== null) {
                                        setData({
                                            ...data,
                                            loginTime: newValue,
                                        });
                                    }
                                }}
                                hideTabs
                                disableFuture
                                inputFormat="YYYY/MM/DD HH:mm:ss"
                            />
                        </Box>
                    </>
                )}
                <Box className={styles.row}>
                    <Button type={"submit"} variant="contained" fullWidth>
                        {"Submit"}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default Editor;
