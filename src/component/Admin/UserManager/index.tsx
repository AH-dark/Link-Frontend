import React, { FC, useEffect, useMemo, useState } from "react";
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
import AddIcon from "@mui/icons-material/AddRounded";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import compare from "../../../utils/compare";
import TableSort from "../../../model/tableSort";
import { useAppDispatch } from "../../../redux/hook";
import { setTitle } from "../../../redux/viewUpdate";
import { useGetAllUserQuery } from "../../../service/rootApi";

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
    const { isLoading, data: data } = useGetAllUserQuery({ page: page, limit: limit });
    const total = useMemo<number>(() => {
        if (typeof data !== "undefined") {
            return data.total;
        } else {
            return 0;
        }
    }, [data]);
    const userData = useMemo(() => data?.data || [], [data]);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle("User Manage - Control Panel"));
    });

    const [orderBy, setOrderBy] = useState<TableSort<User>>({
        key: "id",
        sort: "desc",
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
                            {!isLoading &&
                                userData
                                    .concat([])
                                    .sort((a, b) => {
                                        switch (orderBy.key) {
                                            case "id":
                                            default:
                                                if (orderBy.sort === "asc") {
                                                    return compare(a.id, b.id);
                                                } else {
                                                    return compare(b.id, a.id);
                                                }
                                            case "name":
                                                if (orderBy.sort === "asc") {
                                                    return compare(a.name, b.name);
                                                } else {
                                                    return compare(b.name, a.name);
                                                }
                                            case "email":
                                                if (orderBy.sort === "asc") {
                                                    return compare(a.email, b.email);
                                                } else {
                                                    return compare(b.email, a.email);
                                                }
                                        }
                                    })
                                    .map((userData) => (
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
                                    ))}
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
