"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergePercentages = void 0;
function mergePercentages(percentages) {
    const sum = percentages.reduce((acc, curr) => acc + curr, 0);
    return sum / percentages.length;
}
exports.mergePercentages = mergePercentages;
