export function mergePercentages(percentages: number[]): number {
  const sum = percentages.reduce((acc, curr) => acc + curr, 0);
  return sum / percentages.length;
}
