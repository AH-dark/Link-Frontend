export default interface LimitData<D> {
    limit: number;
    offset: number;
    total: number;
    data: D;
}
