import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <>
        {/* Redux */}
        <Provider store={store}>
            <ConfigProvider direction="ltr" locale={zhCN}>
                <App />
            </ConfigProvider>
        </Provider>
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
