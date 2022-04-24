export interface ShortLinkBasic {
    key?: string;
    origin: string;
    userId: number;
}

export default interface ShortLink extends ShortLinkBasic {
    key: string;
    view: number;
    create_time: Date;
}
