import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import "antd/dist/antd.min.css";
import "./App.css";
import LinkDetail from "./page/LinkDetail";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={"/link/:key"} element={<LinkDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
