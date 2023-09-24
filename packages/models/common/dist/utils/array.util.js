"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkArray = void 0;
function chunkArray(array, size) {
    if (!array.length)
        return [];
    if (array.length < size)
        return [array];
    return array.reduce((result, entry) => {
        result.length > 0 || result.push([]);
        result[result.length - 1].length === size
            ? result.push([entry])
            : result[result.length - 1].push(entry);
        return result;
    }, []);
}
exports.chunkArray = chunkArray;