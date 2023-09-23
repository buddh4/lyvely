"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringEnumKeys = exports.getStringEnumValues = exports.getNumberEnumKeys = exports.getNumberEnumValues = void 0;
function getNumberEnumValues(obj) {
    return Object.keys(obj)
        .filter((value) => isNaN(Number(value)) === false)
        .map((key) => parseInt(key));
}
exports.getNumberEnumValues = getNumberEnumValues;
function getNumberEnumKeys(obj) {
    return Object.values(obj).filter((value) => typeof value === 'string');
}
exports.getNumberEnumKeys = getNumberEnumKeys;
function getStringEnumValues(obj) {
    return Object.values(obj).filter((value) => typeof value === 'string');
}
exports.getStringEnumValues = getStringEnumValues;
function getStringEnumKeys(obj) {
    return Object.keys(obj).filter((value) => typeof value === 'string');
}
exports.getStringEnumKeys = getStringEnumKeys;
