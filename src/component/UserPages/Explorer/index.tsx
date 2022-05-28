import React, { FC, useEffect, useState } from "react";
import styles from "./explorer.module.scss";
import { List, Spin } from "antd";
import { useGetLatestShortLinkQuery } from "../../../service/localApi";
import { useAppDispatch } from "../../../redux/hook";
import { setTitle } from "../../../redux/viewUpdate";

const LinkCard = React.lazy(() => import("./LinkCard"));

const Explorer: FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTitle("Explorer"));
    }, [dispatch]);

    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useGetLatestShortLinkQuery({ page, size: 10 });

    if (isLoading) {
        return <Spin size={"large"} />;
    } else if (isError) {
        return <>Error.</>;
    }

    return (
        <div className={styles.main}>
            <React.Suspense fallback={<Spin size={"large"} />}>
                <List
                    className={styles.list}
                    dataSource={data}
                    renderItem={({ key, origin, userId, view }) => (
                        <LinkCard linkKey={key} origin={origin} userId={userId} view={view} />
                    )}
                />
            </React.Suspense>
        </div>
    );
};

export default Explorer;
