import React, { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {
    Avatar,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Theme,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import StatData from "../../../model/data/StatData";
import API from "../../../middleware/API";
import ApiResponse from "../../../model/ApiResponse";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/styles";
import dayjs from "dayjs";
import { Link as LinkIcon, People as PeopleIcon, NumbersRounded as NumbersRoundedIcon } from "@mui/icons-material";
import * as Color from "@mui/material/colors";
import { setTitle } from "../../../redux/action";
import { useDispatch } from "react-redux";

type LineDataType = Array<{
    name: string;
    link: number;
    user: number;
}>;

const Dashboard: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    const theme = useTheme<Theme>();
    const xs = useMediaQuery(theme.breakpoints.down("xs"));
    const sm = useMediaQuery(theme.breakpoints.between("xs", "sm"));
    const md = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const lg = useMediaQuery(theme.breakpoints.between("md", "lg"));
    const xl = useMediaQuery(theme.breakpoints.between("lg", "xl"));
    const xxl = useMediaQuery(theme.breakpoints.up("xl"));

    const displayGraph = useMediaQuery(theme.breakpoints.up("sm"));

    const size = useMemo<number>(() => {
        switch (true) {
            case xs:
                return 3;
            case sm:
                return 5;
            case md:
            default:
                return 7;
            case lg:
            case xl:
            case xxl:
                return 9;
        }
    }, [xs, sm, md, lg, xl, xxl]);

    const [data, setData] = useState<StatData>();
    const lineData: LineDataType = useMemo(() => {
        let arr: LineDataType = [];
        if (typeof data !== "undefined") {
            for (let i = size - 1; i >= 0; i--) {
                arr.push({
                    name: dayjs().add(-i, "day").format("M月D日").toString(),
                    link: data.newShortLinkData[i],
                    user: data.newUserData[i],
                });
            }
        }
        return arr;
    }, [data]);

    const fetchLineData = () => {
        setLoading(true);
        API.get<ApiResponse<StatData>>("/root/stat", {
            params: {
                day: size,
            },
        })
            .then((res) => {
                if (res.status === 200 && res.data.code === 200) {
                    setData(res.data.data);
                } else {
                    enqueueSnackbar(res.data.message);
                }
            })
            .catch((err) => {
                enqueueSnackbar(err.message);
            })
            .then(() => {
                setLoading(false);
            });
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setTitle("Dashboard - Control Panel"));
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLineData();
    }, [size]);

    const aspect = useMemo<number>(() => {
        switch (true) {
            case xs:
            case sm:
                return 1;
            case md:
                return 1.8;
            case lg:
                return 2.2;
            case xl:
            default:
                return 2.6;
            case xxl:
                return 3;
        }
    }, [window.innerWidth]);

    if (loading || typeof data === "undefined") {
        return <></>;
    }

    return (
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: "inherit",
                        alignItems: "center",
                    }}
                >
                    <Typography variant={"h6"} component={"h2"}>
                        {"Summary Graph"}
                    </Typography>
                    <Box
                        sx={{
                            mt: 3,
                            padding: 1,
                            overflow: "hidden",
                            width: !displayGraph ? "100%" : undefined,
                        }}
                    >
                        {displayGraph ? (
                            <ResponsiveContainer width={"100%"} height={300} aspect={aspect}>
                                <LineChart data={lineData} height={300} width={1200}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={"0.8rem"} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line name={"链接"} type="monotone" dataKey="link" stroke={Color.blue[600]} />
                                    <Line name={"用户"} type="monotone" dataKey="user" stroke={Color.orange[500]} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <List
                                sx={{
                                    width: "100%",
                                }}
                            >
                                {lineData.map((item) => (
                                    <ListItem disablePadding>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <NumbersRoundedIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`链接：${item.link} / 用户：${item.user}`}
                                            secondary={item.name}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
                <Paper
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        heigh: 240,
                    }}
                >
                    <Typography variant={"h6"} component={"h2"}>
                        {"Stat"}
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: Color.blue[600] }}>
                                    <LinkIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={data.totalShortLink} secondary="链接" />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: Color.orange[500] }}>
                                    <PeopleIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={data.totalUser} secondary="用户" />
                        </ListItem>
                    </List>
                </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>{"Others"}</Paper>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
