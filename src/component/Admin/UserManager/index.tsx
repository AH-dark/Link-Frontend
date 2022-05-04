import React, { FC, useEffect, useState } from "react";
import {
    Box,
    Button,
    IconButton,
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
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../redux/action";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/AddRounded";
import API from "../../../middleware/API";
import ApiResponse from "../../../model/ApiResponse";
import LimitData from "../../../model/ApiResponse/LimitData";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        },
        dataRow: {
            "&:last-child td, &:last-child th": { border: 0 },
            "& td.MuiTableCell-body": {
                paddingTop: theme.spacing(1),
                paddingBottom: theme.spacing(1),
            },
        },
        pagination: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
    })
);

const UserManager: FC = () => {
    const classes = useStyles();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [userDatas, setUserDatas] = useState<Array<User>>([]);
    const [load, setLoad] = useState(false);

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        dispatch(setTitle("User Manage - Control Panel"));
    });

    useEffect(() => {
        setLoad(true);
        API.get<ApiResponse<LimitData<Array<User>>>>("/root/user/all", {
            responseType: "json",
            params: {
                page: page,
                limit: limit,
            },
        })
            .then((r) => {
                if (r.status === 200 && r.data.code === 200) {
                    setTotal(r.data.data.total);
                    setUserDatas(r.data.data.data);
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
            })
            .then(() => {
                setLoad(false);
            });
    }, [page, limit]);

    const [orderBy, setOrderBy] = useState<{
        key: string;
        sort: "desc" | "asc";
    }>({
        key: "id",
        sort: "asc",
    });

    const history = useHistory();

    return (
        <Stack spacing={2}>
            <Box>
                <Button
                    variant={"contained"}
                    onClick={() => {
                        history.push("/admin/user/create");
                    }}
                    startIcon={<AddIcon />}
                >
                    {"Add User"}
                </Button>
            </Box>
            <Paper className={classes.root}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow style={{ height: 48 }}>
                                <TableCell style={{ minWidth: 48 }}>
                                    <TableSortLabel
                                        active={orderBy.key === "id"}
                                        direction={orderBy.sort}
                                        onClick={() =>
                                            setOrderBy({ key: "id", sort: orderBy.sort === "asc" ? "desc" : "asc" })
                                        }
                                    >
                                        {"# ID"}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell style={{ minWidth: 120 }}>
                                    <TableSortLabel
                                        active={orderBy.key === "name"}
                                        direction={orderBy.sort}
                                        onClick={() =>
                                            setOrderBy({
                                                key: "name",
                                                sort: orderBy.sort === "asc" ? "desc" : "asc",
                                            })
                                        }
                                    >
                                        {"昵称"}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell style={{ minWidth: 170 }}>
                                    <TableSortLabel
                                        active={orderBy.key === "email"}
                                        direction={orderBy.sort}
                                        onClick={() =>
                                            setOrderBy({
                                                key: "email",
                                                sort: orderBy.sort === "asc" ? "desc" : "asc",
                                            })
                                        }
                                    >
                                        {"Email"}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell style={{ minWidth: 70 }}>{"用户类型"}</TableCell>
                                <TableCell style={{ minWidth: 50 }}>{"状态"}</TableCell>
                                <TableCell style={{ minWidth: 100 }}>操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {load ? (
                                <></>
                            ) : (
                                userDatas.map((userData) => (
                                    <TableRow key={userData.id} className={classes.dataRow}>
                                        <TableCell>{userData.id}</TableCell>
                                        <TableCell>{userData.name}</TableCell>
                                        <TableCell>{userData.email}</TableCell>
                                        <TableCell>{userData.role === 1 ? "管理员" : "普通用户"}</TableCell>
                                        <TableCell>{userData.available ? "活跃" : "禁用"}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                size={"small"}
                                                onClick={() => {
                                                    history.push("/admin/user/edit/" + userData.id);
                                                }}
                                            >
                                                <EditRoundedIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
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

export default UserManager;
