import axios from "axios";
import { message } from "antd";

const baseUrl: string = "/api/";

const getBaseUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://" + window.location.hostname + ":8080/api/";
    }
    return baseUrl;
};

const instance = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    responseType: "json",
});

instance.interceptors.response.use(
    (response) => {
        console.log("[API]", response.config.method, response.config.url, response.status);
        return response;
    },
    (err) => {
        if (err.response) {
            message.error("Error: " + err.response.data.message);
        } else {
            message.error(err.message);
        }
        return err;
    }
);

export default instance;
