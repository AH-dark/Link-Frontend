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
import User from "../../../model/data/User";
import { useDispatch, useSelector } from "react-redux";
import { MyState } from "../../../redux/reducer";
import { DesktopDateTimePicker } from "@mui/x-date-pickers";
import { useSnackbar } from "notistack";
import { setUserLogin } from "../../../redux/action";
import API from "../../../middleware/API";
import ApiResponse from "../../../model/ApiResponse";
import { useHistory, useLocation } from "react-router-dom";

const Editor: React.FC = () => {
    const currentUser = useSelector<MyState, User | null>((state) => state.user);

    const { search } = useLocation();
    const history = useHistory();
    const id = useMemo(() => {
        return new URLSearchParams(search).get("id");
    }, [search]);

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
        registerIP: "0.0.0.0",
        available: false,
        createTime: new Date(),
        loginTime: new Date(),
    });
    const [load, setLoad] = useState(false);
    const [dataError, setDataError] = useState({
        email: false,
        registerIP: false,
    });

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const isCreate = useMemo<boolean>(() => {
        if (id === null) {
            return true;
        }
        const userId: number = parseInt(id);
        if (isNaN(userId)) {
            return true;
        }
        console.log("[Editor]", `Editing user ${userId}`);
        return userId <= 0;
    }, [id]);

    useEffect(() => {
        if (!isCreate) {
            setLoad(true);
            API.get<ApiResponse<User>>("/root/user", {
                params: {
                    id: parseInt(id as string),
                },
                responseType: "json",
            })
                .then((r) => {
                    if (r.status === 200 && r.data.code === 200) {
                        setData(r.data.data);
                        setOriginData(r.data.data);
                        setLoad(false);
                    } else {
                        enqueueSnackbar(`Error ${r.data.code}: ${r.data.message}`);
                    }
                })
                .catch((err) => {
                    enqueueSnackbar(`Error ${err.data.code}: ${err.data.message}`);
                });
        }
    }, [id, isCreate]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isCreate) {
            API.put<ApiResponse<User>>("/root/user", data)
                .then((r) => {
                    if (r.status === 200 && r.data.code === 200) {
                        setData(r.data.data);
                        setOriginData(r.data.data);
                        if (r.data.data.id === currentUser?.id) {
                            dispatch(setUserLogin(r.data.data));
                        }
                        enqueueSnackbar("Set data success.", {
                            key: "success",
                        });
                        history.goBack();
                    } else {
                        enqueueSnackbar(`Error ${r.data.code}: ${r.data.message}`);
                    }
                })
                .catch((err) => {
                    enqueueSnackbar(`Error ${err.data.code}: ${err.data.message}`);
                });
        } else {
            let tmp: any = data;
            tmp.id = undefined;
            tmp.createTime = undefined;
            tmp.loginTime = undefined;
            API.post<ApiResponse<User>>("/root/user", tmp)
                .then((r) => {
                    if (r.status === 200 && r.data.code === 200) {
                        setData(r.data.data);
                        setOriginData(r.data.data);
                        enqueueSnackbar("Add user success.", {
                            key: "success",
                        });
                        window.history.back();
                    } else {
                        enqueueSnackbar(`Error ${r.data.code}: ${r.data.message}`);
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

    if (load) {
        return <CircularProgress />;
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
