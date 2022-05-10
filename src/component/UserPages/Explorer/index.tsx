import React, { FC, useEffect, useState } from "react";
import styles from "./explorer.module.scss";
import ShortLink from "../../../model/data/ShortLink";
import { getLatestShortLink } from "../../../middleware/API/shortLink";
import { List, message, Spin } from "antd";
import User from "../../../model/data/User";
import { getUser } from "../../../middleware/API/user";
import { useDispatch, useSelector } from "react-redux";
import { MyState } from "../../../redux/reducer";
import { addUserHash } from "../../../redux/action";

const LinkCard = React.lazy(() => import("./LinkCard"));

type UserHash = Record<number, boolean>;

const Explorer: FC = () => {
    const [data, setData] = useState<ShortLink[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const userDataHash = useSelector<MyState, { [K: number]: User }>((state) => state.userHash);

    useEffect(() => {
        const height = window.innerHeight;
        let column = ~~((height - 64 - 78) / 112) - 1;
        if (window.innerWidth >= 780) {
            column *= 2;
        }
        column = column >= 5 ? column : 5;
        console.log("Will request " + column + " data.");
        getLatestShortLink(column, page).then((r) => {
            if (r !== null) {
                setData(r);
                let arr: Promise<boolean>[] = [];
                let userHashTemp: UserHash = {};
                for (let k in userDataHash) {
                    userHashTemp[k] = true;
                }
                for (let k in r) {
                    const shortLink: ShortLink = r[k];
                    const userId = shortLink.userId;
                    if (userId && userId > 0 && !userHashTemp[userId]) {
                        userHashTemp[userId] = true;
                        arr.push(
                            getUser(userId).then((r) => {
                                if (r !== null) {
                                    dispatch(addUserHash(r));
                                    return true;
                                } else {
                                    return false;
                                }
                            })
                        );
                    }
                }
                Promise.all(arr).then((r) => {
                    setLoading(false);
                    const successNum = r.filter(Boolean).length;
                    console.log(
                        "Get all user data success.\n",
                        `Success: ${successNum}/${r.length}\n`,
                        `Error: ${r.length - successNum}/${r.length}`
                    );
                });
            } else {
                message.error("Error when get data.");
            }
        });
    }, [page]);

    if (loading) {
        return <Spin size={"large"} />;
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
