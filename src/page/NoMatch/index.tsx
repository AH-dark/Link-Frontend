import React, { FC } from "react";
import UI from "../../component/UI";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NoMatch: FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    };

    return (
        <UI>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Button type="primary" onClick={handleClick}>
                        Back Home
                    </Button>
                }
            />
        </UI>
    );
};

export default NoMatch;
