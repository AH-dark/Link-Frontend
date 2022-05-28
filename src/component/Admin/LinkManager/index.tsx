import React, { FC, useEffect, useMemo, useState } from "react";
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
import { useSnackbar } from "notistack";
import ShortLink from "../../../model/data/ShortLink";
import LinkRow from "./LinkRow";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import classNames from "classnames";
import TableSort from "../../../model/tableSort";
import { useAppDispatch } from "../../../redux/hook";
import { setTitle } from "../../../redux/viewUpdate";
import { useDeleteShortLinkMutation, useGetAllShortLinkQuery } from "../../../service/rootApi";

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

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        dispatch(setTitle("Link Manage - Control Panel"));
    });

    const { isError, isFetching, isLoading, data, refetch } = useGetAllShortLinkQuery({
        page: page,
        limit: limit,
    });
    const linkDataList = useMemo<ShortLink[]>(() => {
        if (typeof data !== "undefined") {
            return data.data;
        } else {
            return [];
        }
    }, [data]);
    const total = useMemo<number>(() => {
        if (typeof data !== "undefined") {
            return data.total;
        } else {
            return 0;
        }
    }, [data]);

    const [orderBy, setOrderBy] = useState<TableSort<ShortLink>>({
        key: "createTime",
        sort: "desc",
    });

    const [deleteShortLink, {}] = useDeleteShortLinkMutation();

    const handleDeleteLink = (key: string) => () => {
        deleteShortLink(key)
            .unwrap()
            .then((r) => {
                if (typeof r !== "undefined") {
                    enqueueSnackbar("Deleted success.");
                    refetch();
                } else {
                    enqueueSnackbar(`Deleted failed, unknown error.`);
                }
            })
            .catch((err) => {
                enqueueSnackbar(err.message);
            });
    };

    if (isError) {
        return <>Error.</>;
    }

    return (
        <Stack spacing={2}>
            <Box>
                <Button variant={"contained"} startIcon={<RefreshRoundedIcon />} onClick={() => refetch()}>
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
                                        active={orderBy.key === "userId"}
                                        direction={orderBy.sort}
                                        onClick={() =>
                                            setOrderBy({
                                                key: "userId",
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
                                        active={orderBy.key === "createTime"}
                                        direction={orderBy.sort}
                                        onClick={() =>
                                            setOrderBy({
                                                key: "createTime",
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
                            {!isLoading && !isFetching && typeof data !== "undefined" && (
                                <LinkRow data={linkDataList} handleDeleteLink={handleDeleteLink} orderBy={orderBy} />
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

export default LinkManager;
