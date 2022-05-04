import React, { FC, useEffect, useState } from "react";
import {
    Box,
    Button,
    Pagination,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Theme,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import User from "../../../model/data/User";
import { useDispatch, useSelector } from "react-redux";
import { setTitle, addUserHash } from "../../../redux/action";
import { useSnackbar } from "notistack";
import ShortLink from "../../../model/data/ShortLink";
import API from "../../../middleware/API";
import ApiResponse from "../../../model/ApiResponse";
import LimitData from "../../../model/ApiResponse/LimitData";
import { MyState } from "../../../redux/reducer";
import LinkRow from "./LinkRow";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import classNames from "classnames";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        },
        pagination: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
    })
);

const LinkManager: FC = () => {
    const classes = useStyles();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [linkDataList, setLinkDataList] = useState<Array<ShortLink>>([]);
    const userDataHash = useSelector<MyState, Record<number, User>>((state) => state.userHash);
    const [load, setLoad] = useState(false);

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        dispatch(setTitle("Link Manage - Control Panel"));
    });

    const loadList = () => {
        setLoad(true);

        let hashBool: Record<number, boolean> = {};
        for (let userDataHashKey in userDataHash) {
            hashBool[userDataHashKey] = true;
        }

        let taskArr: Promise<void>[] = [];

        API.get<ApiResponse<LimitData<Array<ShortLink>>>>("/root/link/all", {
            responseType: "json",
            params: {
                page: page,
                limit: limit,
            },
        })
            .then((r) => {
                if (r !== null) {
                    setTotal(r.data.data.total);
                    setLinkDataList(r.data.data.data);
                    r.data.data.data.map((link) => {
                        const userId = link.userId;
                        if (userId > 0 && typeof hashBool[userId] === "undefined") {
                            hashBool[userId] = true;
                            taskArr.push(
                                API.get<ApiResponse<User>>("/root/user", {
                                    params: {
                                        id: userId,
                                    },
                                    responseType: "json",
                                })
                                    .then((r) => {
                                        if (r.status === 200 && r.data.code === 200) {
                                            dispatch(addUserHash(r.data.data));
                                        }
                                    })
                                    .catch((err) => {
                                        enqueueSnackbar(
                                            typeof err.response.data !== "undefined"
                                                ? `Error ${err.response.data.code}: ${err.response.data.message}`
                                                : err.message
                                        );
                                    })
                            );
                        }
                    });
                }
            })
            .catch((err) => {
                enqueueSnackbar(
                    typeof err.response.data !== "undefined"
                        ? `Error ${err.response.data.code}: ${err.response.data.message}`
                        : err.message
                );
            })
            .then(() => {
                Promise.all(taskArr).then(() => {
                    setLoad(false);
                });
            });
    };

    useEffect(() => {
        loadList();
    }, [page, limit]);

    const [orderBy, setOrderBy] = useState<{
        key: string;
        sort: "desc" | "asc";
    }>({
        key: "create_time",
        sort: "desc",
    });

    const handleDeleteLink = (key: string) => () => {
        API.delete<ApiResponse>("/root/link", {
            params: {
                key: key,
            },
        })
            .then((r) => {
                if (r.status === 200 && r.data.code === 200) {
                    enqueueSnackbar("Deleted success.");
                    loadList();
                } else {
                    enqueueSnackbar(`Error ${r.data.code}: ${r.data.message}`);
                }
            })
            .catch((err) => {
                enqueueSnackbar(
                    typeof err.data !== "undefined" ? `Error ${err.data.code}: ${err.data.message}` : err.message
                );
            });
    };

    return (
        <Stack spacing={2}>
            <Box>
                <Button variant={"contained"} startIcon={<RefreshRoundedIcon />} onClick={() => loadList()}>
                    {"Refresh"}
                </Button>
            </Box>
            <Paper className={classes.root}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow style={{ height: 48 }}>
                                <TableCell style={{ minWidth: 60 }}>
                                    <TableSortLabel
                                        active={orderBy.key === "key"}
                                        direction={orderBy.sort}
                                        onClick={() =>
                                            setOrderBy({ key: "key", sort: orderBy.sort === "asc" ? "desc" : "asc" })
                                        }
                                    >
                                        {"Key"}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell style={{ minWidth: 120 }}>{"Origin"}</TableCell>
                                <TableCell style={{ minWidth: 170 }}>
                                    <TableSortLabel
                                        active={orderBy.key === "creator"}
                                        direction={orderBy.sort}
                                        onClick={() =>
                                            setOrderBy({
                                                key: "creator",
                                                sort: orderBy.sort === "asc" ? "desc" : "asc",
                                            })
                                        }
                                    >
                                        {"Creator"}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell style={{ minWidth: 170 }}>
                                    <TableSortLabel
                                        active={orderBy.key === "view"}
                                        direction={orderBy.sort}
                                        onClick={() =>
                                            setOrderBy({
                                                key: "view",
                                                sort: orderBy.sort === "asc" ? "desc" : "asc",
                                            })
                                        }
                                    >
                                        {"View"}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell style={{ minWidth: 170 }}>
                                    <TableSortLabel
                                        active={orderBy.key === "create_time"}
                                        direction={orderBy.sort}
                                        onClick={() =>
                                            setOrderBy({
                                                key: "create_time",
                                                sort: orderBy.sort === "asc" ? "desc" : "asc",
                                            })
                                        }
                                    >
                                        {"Create Time"}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell style={{ minWidth: 100 }}>操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {load ? <></> : <LinkRow data={linkDataList} handleDeleteLink={handleDeleteLink} />}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper className={classNames(classes.root, classes.pagination)}>
                <Pagination
                    count={Math.trunc(total / limit) + (total % limit !== 0 ? 1 : 0)}
                    page={page}
                    onChange={(event, page) => {
                        setPage(page);
                    }}
                />
            </Paper>
        </Stack>
    );
};

export default LinkManager;
