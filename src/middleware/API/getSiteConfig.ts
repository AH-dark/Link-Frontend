import API from "./index";
import ApiResponse from "../../model/ApiResponse";
import SiteConfig from "../../model/data/SiteConfig";
import { message } from "antd";

const getSiteConfig: () => Promise<SiteConfig | null> = async () => {
    const res = await API.get<ApiResponse<SiteConfig>>("/siteConfig", {
        responseType: "json",
    });

    if (res.status === 200 && res.data.code === 200) {
        return res.data.data;
    } else {
        message.error(`Get site config error: ${res.data.message}`);
        console.log(`Get site config error: ${res.data.message}`);
        return null;
    }
};

export default getSiteConfig;
