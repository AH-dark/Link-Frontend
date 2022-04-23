export default interface ShortLink extends ShortLinkBasic {
    view: number;
    create_time: Date;
}

export interface ShortLinkBasic {
    key: string;
    origin: string;
    userId: number;
}
