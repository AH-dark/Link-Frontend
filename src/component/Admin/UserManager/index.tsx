import React, { FC, useEffect, useMemo, useState } from "react";
import { Box, Button, Paper, Stack } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { makeStyles } from "styles/hooks";
import User from "model/data/User";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AddIcon from "@mui/icons-material/AddRounded";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "redux/hook";
import { setTitle } from "redux/viewUpdate";
import { useGetAllUserQuery } from "service/rootApi";

const useStyles = makeStyles()((theme) => ({
    root: {
        padding: theme.spacing(2),
        height: "100%",
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
}));

const UserManager: FC = () => {
    const { classes } = useStyles();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { data, error } = useGetAllUserQuery({ page: page, limit: limit });

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle("User Manage - Control Panel"));
    });

    const history = useHistory();

    const columns = useMemo<GridColDef<User>[]>(
        () => [
            {
                field: "id",
                headerName: "# ID",
                width: 80,
            },
            {
                field: "name",
                headerName: "Name",
                sortable: false,
                width: 160,
            },
            {
                field: "email",
                headerName: "Email",
                sortable: false,
                width: 240,
            },
            {
                field: "role",
                headerName: "Role",
                width: 120,
                valueFormatter: (params) => (params.value === 0 ? "User" : "Manager"),
            },
            {
                field: "available",
                headerName: "Status",
                width: 120,
                valueFormatter: (params) => (params.value ? "Active" : "Disable"),
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                getActions: (params: GridRowParams) => [
                    <GridActionsCellItem
                        label={"Edit"}
                        onClick={() => {
                            history.push("/admin/user/edit/" + params.id);
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
                <DataGrid
                    columns={columns}
                    rows={data?.data || []}
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

export default UserManager;
