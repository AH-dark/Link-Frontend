import React, { MouseEventHandler } from "react";
import ShortLink from "../../../model/data/ShortLink";
import { Avatar, Box, IconButton, TableCell, TableRow, Theme, Typography } from "@mui/material";
import { GetAvatar } from "../../../utils/avatar";
import dayjs from "dayjs";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { createStyles, makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { MyState } from "../../../redux/reducer";
import User from "../../../model/data/User";
import { useHistory } from "react-router-dom";
import TableSort from "../../../model/tableSort";
import compare from "../../../utils/compare";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dataRow: {
            "&:last-child td, &:last-child th": { border: 0 },
            "& td.MuiTableCell-body": {
                paddingTop: theme.spacing(1),
                paddingBottom: theme.spacing(1),
            },
        },
    })
);

const LinkRow: React.FC<
    React.HTMLAttributes<HTMLDivElement> & {
        data: Array<ShortLink>;
        handleDeleteLink: (key: string) => MouseEventHandler<HTMLButtonElement>;
        orderBy: TableSort<ShortLink>;
    }
> = (props) => {
    const classes = useStyles();
    const userDataHash = useSelector<MyState, { [K: number]: User }>((state) => state.userHash);
    const history = useHistory();

    return (
        <>
            {props.data
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
                .map((item) => (
                    <TableRow key={item.key} className={classes.dataRow}>
                        <TableCell>{item.key}</TableCell>
                        <TableCell>{item.origin}</TableCell>
                        <TableCell>
                            {item.userId > 0 ? (
                                <Box display={"flex"} flexDirection={"row"} maxHeight={28} alignItems={"center"}>
                                    <Avatar
                                        src={GetAvatar(userDataHash[item.userId].email, 36)}
                                        sx={{ height: 20, width: 20 }}
                                    />
                                    <Typography variant={"body2"} component={"span"} sx={{ ml: 1 }}>
                                        {userDataHash[item.userId].name}
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
                ))}
        </>
    );
};

export default LinkRow;
