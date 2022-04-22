export default interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
    exceptions?: string;
}
