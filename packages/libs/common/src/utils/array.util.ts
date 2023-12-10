export function chunkArray(array: Array<any>, size: number) {
  if (!array.length) return [];
  if (array.length < size) return [array];
  return array.reduce((result, entry) => {
    result.length > 0 || result.push([]);
    result[result.length - 1].length === size
      ? result.push([entry])
      : result[result.length - 1].push(entry);
    return result;
  }, []);
}

/**
 * Finds and replaces an element of the given array with the given replacement, either by providing a condition or
 * property key used to compare an element with the replacement e.g. an id property.
 *
 * @param arr
 * @param replacement
 * @param condition
 * @param pushIfNotExist
 */
export function findAndReplace<T>(
  arr: T[],
  replacement: T,
  condition: keyof T | ((element: T) => boolean),
  pushIfNotExist = false,
): boolean {
  const check =
    typeof condition === 'function'
      ? condition
      : (element: T) => element[condition as keyof T] === replacement[condition as keyof T];
  const index = arr.findIndex(check);
  if (index !== -1) {
    arr[index] = replacement;
    return true;
  } else if (pushIfNotExist) {
    arr.push(replacement);
  }

  return false;
}

/**
 * Finds and removes an element from an array based on a condition or function.
 *
 * @param arr - The array to search and remove elements from.
 * @param toRemove - The element or function that specifies what to remove.
 * @param condition - Optional. The condition or function used to match elements for removal.
 * @returns `true` if an element was found and removed, `false` otherwise.
 */
export function findAndRemove<T>(
  arr: T[],
  toRemove: T | ((element: T) => boolean),
  condition?: keyof T | ((element: T) => boolean),
): boolean {
  const check =
    typeof toRemove === 'function'
      ? (toRemove as (element: T) => boolean)
      : typeof condition === 'function'
      ? (condition as (element: T) => boolean)
      : (element: T) => element[condition as keyof T] === toRemove[condition as keyof T];

  const index = arr.findIndex(check);

  if (index !== -1) {
    arr.splice(index, 1);
    return true;
  }

  return false;
}

/**
 * Checks if two arrays have any common elements.
 *
 * @param {Array} arr1 - The first array.
 * @param {Array} arr2 - The second array.
 * @param {Function} [compare] - Optional comparison function.
 * @returns {boolean} - True if there is at least one common element, false otherwise.
 */
export function hasIntersection<T>(
  arr1: T[],
  arr2: T[],
  compare?: (a: T, b: T) => boolean,
): boolean {
  if (!arr1?.length || !arr2?.length) return false;

  if (compare) {
    // Use the provided comparison function
    return arr1.some((a1) => arr2.some((a2) => compare(a1, a2)));
  } else {
    // Default to reference/value comparison
    const set1 = new Set(arr1);
    return arr2.some((element) => set1.has(element));
  }
}

/**
 * Returns an array of elements that are present in both arr1 and arr2.
 *
 * @param {Array} arr1 - The first array to compare.
 * @param {Array} arr2 - The second array to compare.
 * @param {Function} [compare] - An optional comparison function used to determine equality.
 *                               If not provided, reference/value comparison will be used.
 * @returns {Array} - An array of elements present in both arr1 and arr2.
 */
export function getIntersection<T>(arr1: T[], arr2: T[], compare?: (a: T, b: T) => boolean): T[] {
  if (!arr1?.length || !arr2?.length) return [];

  const set1 = new Set(arr1);
  const intersection = arr2.filter((element) => {
    if (compare) {
      // Use the provided comparison function
      return arr1.some((e) => compare(e, element));
    } else {
      // Default to reference/value comparison
      return set1.has(element);
    }
  });

  return intersection;
}
