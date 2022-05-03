import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectIndex: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/admin/dashboard");
    });

    return <></>;
};

export default RedirectIndex;
