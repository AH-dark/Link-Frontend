export type ApiResponse<T = undefined> = {
    code: number;
    message: string;
    data: T;
    exceptions?: string;
};
