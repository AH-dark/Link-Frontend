import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./siteConfigManager.module.scss";
import { Box, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import SiteConfig from "model/data/SiteConfig";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { setTitle } from "redux/viewUpdate";
import { useAppDispatch } from "redux/hook";
import { useGetSiteConfigQuery, usePutSiteConfigMutation } from "service/rootApi";
import { useGetSiteConfigQuery as useUserGetSiteConfigQuery } from "service/localApi";

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

    const { data: SiteConfigInitData, isLoading: isGetting, refetch } = useGetSiteConfigQuery();
    const { refetch: userSideSiteConfigRefetch } = useUserGetSiteConfigQuery();
    const [putSiteConfig, { isLoading: isSiteConfigUpdating }] = usePutSiteConfigMutation();
    const [siteConfig, setSiteConfig] = useState<SiteConfig>({} as SiteConfig);

    useEffect(() => {
        if (typeof SiteConfigInitData !== "undefined" && !isGetting) {
            setSiteConfig(SiteConfigInitData);
        }
    }, [SiteConfigInitData, isGetting]);

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
        putSiteConfig(siteConfig)
            .unwrap()
            .then((r) => {
                if (typeof r !== "undefined") {
                    setSiteConfig(r);
                    enqueueSnackbar("Submit success.", {
                        variant: "success",
                    });
                    refetch();
                    userSideSiteConfigRefetch();
                }
            })
            .catch((err) => {
                console.error(err.message);
                enqueueSnackbar("Backend error.", {
                    variant: "error",
                });
            });
    };

    if (typeof siteConfig === null || isGetting || isSiteConfigUpdating) {
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
                        value={String(siteConfig.enableTouristShorten)}
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
                <LoadingButton
                    variant={"contained"}
                    type={"submit"}
                    loading={isSiteConfigUpdating}
                    className={styles.button}
                >
                    {"Submit"}
                </LoadingButton>
            </Box>
        </Box>
    );
};

export default SiteConfigManager;
