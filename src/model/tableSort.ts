export default interface TableSort<T = any> {
    key: keyof T;
    sort: "desc" | "asc";
}
