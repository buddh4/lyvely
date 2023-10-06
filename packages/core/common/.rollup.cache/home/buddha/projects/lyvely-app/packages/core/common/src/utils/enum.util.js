export function getNumberEnumValues(obj) {
    return Object.keys(obj)
        .filter((value) => isNaN(Number(value)) === false)
        .map((key) => parseInt(key));
}
export function getNumberEnumKeys(obj) {
    return Object.values(obj).filter((value) => typeof value === 'string');
}
export function getStringEnumValues(obj) {
    return Object.values(obj).filter((value) => typeof value === 'string');
}
export function getStringEnumKeys(obj) {
    return Object.keys(obj).filter((value) => typeof value === 'string');
}
