import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./siteConfigManager.module.scss";
import { Box, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import SiteConfig from "../../../model/data/SiteConfig";
import API from "../../../middleware/API";
import ApiResponse from "../../../model/ApiResponse";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { setTitle } from "../../../redux/viewUpdate";
import { setSiteConfig as setReduxSiteConfig } from "../../../redux/data";
import { useAppDispatch } from "../../../redux/hook";

const FormItem: React.FC<{
    name: string;
    type?: string;
    helperText?: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    value: string;
}> = (props) => {
    return (
        <FormControl variant={"standard"} fullWidth className={styles.formControl} defaultValue={props.value}>
            <InputLabel>{props.name}</InputLabel>
            <Input type={props.type || "text"} onChange={props.onChange} value={props.value} />
            {typeof props.helperText !== "undefined" && <FormHelperText>{props.helperText}</FormHelperText>}
        </FormControl>
    );
};

const SiteConfigManager: React.FC = () => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [siteConfig, setSiteConfig] = useState<SiteConfig>({
        siteName: "",
        siteUrl: "",
        enableTouristShorten: false,
    });
    const [load, setLoad] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const getSiteConfig = () => {
        setLoad(true);
        API.get<ApiResponse<SiteConfig>>("/root/siteConfig")
            .then((res) => {
                if (res.status === 200 && res.data.code === 200) {
                    setSiteConfig(res.data.data);
                } else {
                    enqueueSnackbar(res.data.message);
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
    };

    useEffect(() => {
        getSiteConfig();
    }, []);

    useEffect(() => {
        dispatch(setTitle("Site Config Manage - Control Panel"));
    });

    const handleChange = (name: string) => (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSiteConfig({
            ...siteConfig,
            [name]: e.target.value,
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        API.put<ApiResponse<SiteConfig>>("/root/siteConfig", siteConfig)
            .then((res) => {
                if (res.status === 200 && res.data.code === 200) {
                    setSiteConfig(res.data.data);
                    dispatch(setReduxSiteConfig(res.data.data));
                    enqueueSnackbar("Submit success.");
                } else {
                    enqueueSnackbar("Backend error.");
                }
            })
            .catch((err) => {
                enqueueSnackbar(err.message);
            })
            .then(() => {
                setSubmitting(false);
            });
    };

    if (typeof siteConfig === null || load) {
        return <></>;
    }

    return (
        <Box className={styles.root}>
            <Typography variant={"h5"} component={"h1"} className={styles.title}>
                {"Site Config"}
            </Typography>
            <Box component={"form"} className={styles.form} onSubmit={handleSubmit}>
                <FormItem
                    name={"Site Name"}
                    type={"text"}
                    onChange={handleChange("siteName")}
                    value={siteConfig.siteName}
                />
                <FormItem
                    name={"Site Url"}
                    type={"url"}
                    helperText={"Please enter full URL."}
                    onChange={handleChange("siteUrl")}
                    value={siteConfig.siteUrl}
                />
                <FormControl
                    variant={"standard"}
                    fullWidth
                    className={styles.formControl}
                    defaultValue={siteConfig.enableTouristShorten ? "Enable" : "Disable"}
                >
                    <InputLabel>{"Tourist Shorten"}</InputLabel>
                    <Select
                        value={siteConfig.enableTouristShorten}
                        onChange={(e) => {
                            setSiteConfig({
                                ...siteConfig,
                                enableTouristShorten: e.target.value == "true",
                            });
                        }}
                    >
                        <MenuItem value={"true"}>Enable</MenuItem>
                        <MenuItem value={"false"}>Disable</MenuItem>
                    </Select>
                </FormControl>
                <LoadingButton variant={"contained"} type={"submit"} loading={submitting} className={styles.button}>
                    {"Submit"}
                </LoadingButton>
            </Box>
        </Box>
    );
};

export default SiteConfigManager;
