import React, { useEffect, useMemo, useState } from "react";
import styles from "./editor.module.scss";
import { Box, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { DesktopDateTimePicker } from "@mui/x-date-pickers";
import { useSnackbar } from "notistack";
import { useHistory, useParams } from "react-router-dom";
import ShortLink, { ShortLinkBasic } from "../../../model/data/ShortLink";
import { useAppDispatch } from "../../../redux/hook";
import { setTitle } from "../../../redux/viewUpdate";
import { useGetShortLinkQuery, usePostShortLinkMutation, usePutShortLinkMutation } from "../../../service/rootApi";
import User from "../../../model/data/User";
import { useGetUserQuery } from "../../../service/localApi";

const Editor: React.FC = () => {
    const currentUser = useGetUserQuery().data as User;

    const history = useHistory();
    const { key } = useParams<{ key?: string }>();

    const isCreate = useMemo<boolean>(() => {
        if (typeof key === "undefined") {
            return true;
        }
        console.log("[Editor]", `Editing link ${key}`);
        return false;
    }, [key]);

    const {
        isLoading,
        isFetching,
        data: shortLinkData,
        refetch,
    } = useGetShortLinkQuery(!isCreate && typeof key !== "undefined" ? key : "");
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

    useEffect(() => {
        if (!isCreate && !isLoading && typeof shortLinkData !== "undefined") {
            setData(shortLinkData);
            setOriginData(shortLinkData);
        }
    }, [isCreate, isLoading, shortLinkData]);

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle("Link Editor - Control Panel"));
    }, []);

    const handleFormChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setData({ ...data, [name]: e.target.value });
    };

    const [putShortLink, { isLoading: isPutting }] = usePutShortLinkMutation();
    const [postShortLink, { isLoading: isCreating }] = usePostShortLinkMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isCreate) {
            putShortLink(data)
                .unwrap()
                .then((r) => {
                    if (typeof r !== "undefined") {
                        enqueueSnackbar("Set data success.", {
                            key: "success",
                            variant: "success",
                        });
                        refetch();
                        history.goBack();
                    } else {
                        enqueueSnackbar("Unknown error.", {
                            variant: "error",
                        });
                    }
                })
                .catch((err) => {
                    enqueueSnackbar("Error " + err, {
                        variant: "error",
                    });
                });
        } else {
            let tmp: ShortLinkBasic = data;
            tmp.userId = currentUser?.id || 0;
            postShortLink(tmp)
                .unwrap()
                .then((r) => {
                    if (typeof r !== "undefined") {
                        enqueueSnackbar("Add user success.", {
                            key: "success",
                            variant: "success",
                        });
                        refetch();
                        history.goBack();
                    } else {
                        enqueueSnackbar("Unknown error.", {
                            variant: "error",
                        });
                    }
                })
                .catch((err) => {
                    enqueueSnackbar("Error " + err, {
                        variant: "error",
                    });
                });
        }
    };

    if (isLoading || isFetching) {
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
                    <Button type={"submit"} variant="contained" fullWidth disabled={isPutting || isCreating}>
                        {"Submit"}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default Editor;
