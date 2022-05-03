import React, { useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import LinkIcon from "@mui/icons-material/LinkRounded";
import { useNavigate } from "react-router-dom";

const ListItems: React.FC = () => {
    const navigate = useNavigate();
    const [selected, setSelect] = useState("");
    const handleRedirect = (e: React.MouseEvent) => {
        navigate(e.currentTarget.id);
        setSelect(e.currentTarget.id);
    };

    return (
        <React.Fragment>
            <ListItemButton onClick={handleRedirect} id={"/admin/dashboard"} selected={selected === "/admin/dashboard"}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={handleRedirect} id={"/admin/user"} selected={selected === "/admin/user"}>
                <ListItemIcon>
                    <GroupRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
            </ListItemButton>
            <ListItemButton onClick={handleRedirect} id={"/admin/link"} selected={selected === "/admin/link"}>
                <ListItemIcon>
                    <LinkIcon />
                </ListItemIcon>
                <ListItemText primary="Links" />
            </ListItemButton>
        </React.Fragment>
    );
};

export default ListItems;
