const compare = (a: any, b: any) => {
    switch (true) {
        default:
        case a < b:
            return -1;
        case a === b:
            return 0;
        case a > b:
            return 1;
    }
};

export default compare;
