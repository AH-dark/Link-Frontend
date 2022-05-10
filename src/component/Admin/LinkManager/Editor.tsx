import React, { useEffect, useMemo, useState } from "react";
import styles from "./editor.module.scss";
import { Box, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import User from "../../../model/data/User";
import { useDispatch, useSelector } from "react-redux";
import { MyState } from "../../../redux/reducer";
import { DesktopDateTimePicker } from "@mui/x-date-pickers";
import { useSnackbar } from "notistack";
import API from "../../../middleware/API";
import ApiResponse from "../../../model/ApiResponse";
import { useHistory, useParams } from "react-router-dom";
import ShortLink, { ShortLinkBasic } from "../../../model/data/ShortLink";
import { setTitle } from "../../../redux/action";

const Editor: React.FC = () => {
    const currentUser = useSelector<MyState, User | null>((state) => state.user);

    const history = useHistory();
    const { key } = useParams<{ key?: string }>();

    const [originData, setOriginData] = useState<ShortLink>({
        key: "",
        origin: "",
        userId: 0,
        view: 0,
        createTime: new Date(),
    });
    const [data, setData] = useState<ShortLink>({
        key: "",
        origin: "",
        userId: 0,
        view: 0,
        createTime: new Date(),
    });
    const [load, setLoad] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTitle("Link Editor - Control Panel"));
    }, []);

    const isCreate = useMemo<boolean>(() => {
        if (typeof key === "undefined") {
            return true;
        }
        console.log("[Editor]", `Editing link ${key}`);
        return false;
    }, [key]);

    useEffect(() => {
        if (!isCreate) {
            setLoad(true);
            API.get<ApiResponse<ShortLink>>("/root/link", {
                params: {
                    key: key,
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
    }, [key, isCreate]);

    const handleFormChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setData({ ...data, [name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isCreate) {
            API.put<ApiResponse<ShortLink>>("/root/link", data)
                .then((r) => {
                    if (r.status === 200 && r.data.code === 200) {
                        setData(r.data.data);
                        setOriginData(r.data.data);
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
            let tmp: ShortLinkBasic = data;
            tmp.userId = currentUser?.id || 0;
            API.post<ApiResponse<ShortLink>>("/root/link", tmp)
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
                {isCreate ? "Edit " + originData.key : "Create short link"}
            </Typography>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Box className={styles.row}>
                    <TextField
                        key={"key"}
                        onChange={handleFormChange("key")}
                        type={"text"}
                        label={"Key"}
                        variant="standard"
                        fullWidth
                        required
                        value={data.key}
                    />
                </Box>
                <Box className={styles.row}>
                    <TextField
                        key={"origin"}
                        onChange={handleFormChange("origin")}
                        type={"url"}
                        label={"Origin"}
                        variant="standard"
                        fullWidth
                        required
                        value={data.origin}
                    />
                </Box>
                <Box className={styles.row}>
                    <TextField
                        key={"view"}
                        onChange={handleFormChange("view")}
                        type={"number"}
                        label={"View"}
                        variant="standard"
                        fullWidth
                        required
                        value={data.view}
                    />
                </Box>
                {!isCreate && (
                    <>
                        <Box className={styles.row}>
                            <TextField
                                key={"userId"}
                                onChange={handleFormChange("userId")}
                                type={"number"}
                                label={"Creator Id"}
                                variant="standard"
                                fullWidth
                                value={data.userId}
                            />
                        </Box>
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
