import React, { FC, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, Paper, Stack } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import ShortLink from "model/data/ShortLink";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useAppDispatch } from "redux/hook";
import { setTitle } from "redux/viewUpdate";
import { useGetUserQuery } from "service/localApi";
import { useDeleteShortLinkMutation, useGetAllShortLinkQuery } from "service/rootApi";
import { makeStyles } from "styles/hooks";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const useStyles = makeStyles()((theme) => ({
    root: {
        padding: theme.spacing(2),
        height: "100%",
    },
    pagination: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
}));

const LinkManager: FC = () => {
    const { classes } = useStyles();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const dispatch = useAppDispatch();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        dispatch(setTitle("Link Manage - Control Panel"));
    });

    const { error, data, refetch } = useGetAllShortLinkQuery({
        page: page,
        limit: limit,
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

    const UserNameCell: React.FC<{ params: GridRenderCellParams }> = ({ params }) => {
        const { data } = useGetUserQuery({ id: params.value });
        return <>{data?.name}</>;
    };

    const column = useMemo<GridColDef<ShortLink>[]>(
        () => [
            {
                field: "key",
                headerName: "Key",
                width: 120,
                type: "string",
            },
            {
                field: "origin",
                headerName: "Origin",
                minWidth: 240,
                sortable: false,
                type: "string",
            },
            {
                field: "userId",
                headerName: "Creator",
                sortable: false,
                renderCell: (params) => (params.value == 0 ? "Tourist" : <UserNameCell params={params} />),
            },
            {
                field: "view",
                headerName: "View",
                type: "number",
                width: 90,
            },
            {
                field: "createTime",
                headerName: "Create Time",
                type: "dateTime",
                valueFormatter: (params) => dayjs(params.value).format("YYYY-MM-DD HH:mm:ss"),
                width: 180,
            },
            {
                field: "action",
                headerName: "Actions",
                type: "actions",
                getActions: (params: GridRowParams) => [
                    <GridActionsCellItem
                        label={"Delete"}
                        onClick={handleDeleteLink(params.id as string)}
                        icon={<DeleteRoundedIcon />}
                    />,
                    <GridActionsCellItem
                        label={"Edit"}
                        onClick={() => {
                            history.push("/admin/link/edit/" + params.id);
                        }}
                        icon={<EditRoundedIcon />}
                    />,
                ],
            },
        ],
        []
    );

    return (
        <Stack spacing={2} sx={{ height: "100%" }}>
            <Box>
                <Button variant={"contained"} startIcon={<RefreshRoundedIcon />} onClick={() => refetch()}>
                    {"Refresh"}
                </Button>
            </Box>
            <Paper className={classes.root}>
                <DataGrid
                    columns={column}
                    rows={data?.data || []}
                    getRowId={(i) => i.key}
                    error={error}
                    page={page - 1}
                    onPageChange={(n) => setPage(n + 1)}
                    pageSize={data?.limit}
                    onPageSizeChange={(n) => setLimit(n)}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    rowCount={data?.total || 0}
                    paginationMode={"server"}
                />
            </Paper>
        </Stack>
    );
};

export default LinkManager;
