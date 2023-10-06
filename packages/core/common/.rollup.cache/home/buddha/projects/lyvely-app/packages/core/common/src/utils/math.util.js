export function mergePercentages(percentages) {
    const sum = percentages.reduce((acc, curr) => acc + curr, 0);
    return sum / percentages.length;
}
