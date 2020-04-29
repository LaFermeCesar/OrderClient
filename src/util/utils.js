export const pad = (num, size) => {
    let s = String(num);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

export const toOrderNumber = (orderID) => {
    return pad(parseInt(orderID.slice(0, 4), 36), 8)
}