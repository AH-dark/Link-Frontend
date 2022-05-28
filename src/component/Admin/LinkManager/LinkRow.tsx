import React, { MouseEventHandler } from "react";
import ShortLink from "../../../model/data/ShortLink";
import { Avatar, Box, IconButton, TableCell, TableRow, Typography } from "@mui/material";
import { GetAvatar } from "../../../utils/avatar";
import dayjs from "dayjs";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useHistory } from "react-router-dom";
import TableSort from "../../../model/tableSort";
import compare from "../../../utils/compare";
import { useGetUserQuery } from "../../../service/rootApi";

const Row: React.FC<{ data: ShortLink; handleDeleteLink: (key: string) => MouseEventHandler<HTMLButtonElement> }> = (
    props
) => {
    const item = props.data;
    const { data: user, isLoading } = useGetUserQuery({ id: item.userId });
    const history = useHistory();

    return (
        <TableRow
            key={item.key}
            sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "& td.MuiTableCell-body": {
                    pt: 1,
                    pb: 1,
                },
            }}
        >
            <TableCell>{item.key}</TableCell>
            <TableCell>{item.origin}</TableCell>
            <TableCell>
                {item.userId > 0 && !isLoading && typeof user !== "undefined" ? (
                    <Box display={"flex"} flexDirection={"row"} maxHeight={28} alignItems={"center"}>
                        <Avatar src={GetAvatar(user.email, 36)} sx={{ height: 20, width: 20 }} />
                        <Typography variant={"body2"} component={"span"} sx={{ ml: 1 }}>
                            {user.name}
                        </Typography>
                    </Box>
                ) : (
                    <Box display={"flex"} flexDirection={"row"} maxHeight={28} alignItems={"center"}>
                        <Avatar sx={{ height: 20, width: 20 }} />
                        <Typography variant={"body2"} component={"span"} sx={{ ml: 1 }}>
                            {"Tourest"}
                        </Typography>
                    </Box>
                )}
            </TableCell>
            <TableCell>{item.view}</TableCell>
            <TableCell>{dayjs(item.createTime).format("YYYY/MM/DD HH:mm:ss")}</TableCell>
            <TableCell>
                <IconButton
                    size={"small"}
                    onClick={() => {
                        history.push("/admin/link/edit/" + item.key);
                    }}
                >
                    <EditRoundedIcon />
                </IconButton>
                <IconButton size={"small"} onClick={props.handleDeleteLink(item.key)}>
                    <DeleteRoundedIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

const LinkRow: React.FC<
    React.HTMLAttributes<HTMLDivElement> & {
        data: Array<ShortLink>;
        handleDeleteLink: (key: string) => MouseEventHandler<HTMLButtonElement>;
        orderBy: TableSort<ShortLink>;
    }
> = (props) => (
    <>
        {props.data
            .concat([])
            .sort((a, b) => {
                switch (props.orderBy.key) {
                    case "key":
                    default:
                        if (props.orderBy.sort === "asc") {
                            return compare(a.key, b.key);
                        } else {
                            return compare(b.key, a.key);
                        }
                    case "userId":
                        if (props.orderBy.sort === "asc") {
                            return compare(a.userId, b.userId);
                        } else {
                            return compare(b.userId, a.userId);
                        }
                    case "view":
                        if (props.orderBy.sort === "asc") {
                            return compare(a.view, b.view);
                        } else {
                            return compare(b.view, a.view);
                        }
                    case "createTime":
                        if (props.orderBy.sort === "asc") {
                            return compare(a.createTime, b.createTime);
                        } else {
                            return compare(b.createTime, a.createTime);
                        }
                }
            })
            .map((item, index) => (
                <Row data={item} key={index} handleDeleteLink={props.handleDeleteLink} />
            ))}
    </>
);

export default LinkRow;
