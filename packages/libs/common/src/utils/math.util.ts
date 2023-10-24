/**
 * Merges an array of percentages by calculating their average.
 *
 * This function sums up all the percentage values in the array and then
 * divides the sum by the length of the array to obtain the average percentage.
 *
 * @param percentages - An array of percentage values to be merged.
 * @returns The average percentage value of the input array.
 *
 * @example
 *
 * const mergedValue = mergePercentages([50, 60, 70]);  // returns 60
 * const anotherMergedValue = mergePercentages([80, 90]); // returns 85
 */
export function mergePercentages(percentages: number[]): number {
  const sum = percentages.reduce((acc, curr) => acc + curr, 0);
  return sum / percentages.length;
}

/**
 * Clamps a number between the specified minimum and maximum values.
 *
 * @param value - The number to clamp.
 * @param min - The lower boundary to clamp the number to.
 * @param max - The upper boundary to clamp the number to.
 * @returns The clamped number. If the input number is below the minimum,
 *          the function returns the minimum. If it's above the maximum,
 *          it returns the maximum. Otherwise, it returns the input number.
 *
 * @example
 *
 * const restrictedValue = clamp(15, 10, 20);  // returns 15
 * const belowMinValue = clamp(5, 10, 20);     // returns 10
 * const aboveMaxValue = clamp(25, 10, 20);    // returns 20
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
