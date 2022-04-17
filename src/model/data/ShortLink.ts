type ShortLink = {
    key: string;
    origin: string;
    user_id: number;
    view: number;
    create_time: Date;
};

export type ShortLinkPost = {
    key: string;
    origin: string;
    user_id: number;
};

export default ShortLink;
