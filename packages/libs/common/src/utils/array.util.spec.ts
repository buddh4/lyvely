import {
  chunkArray,
  findAndRemove,
  findAndReplace,
  getIntersection,
  hasIntersection,
} from './array.util';

describe('array util', () => {
  describe('findAndReplace', () => {
    it('should replace an element based on a property condition', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Doe' },
      ];

      const condition = 'id';
      const replacement = { id: 2, name: 'Updated Jane' };

      const replaced = findAndReplace(array, replacement, condition);

      expect(replaced).toBe(true);
      expect(array).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Updated Jane' }, // Element with id 2 was replaced
        { id: 3, name: 'Doe' },
      ]);
    });

    it('should replace an element based on a custom function condition', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Doe' },
      ];

      const condition = (element: any) => element.id === 3;
      const replacement = { id: 3, name: 'Updated Doe' };

      const replaced = findAndReplace(array, replacement, condition);

      expect(replaced).toBe(true);
      expect(array).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Updated Doe' }, // Element matching the custom condition was replaced
      ]);
    });

    it('should return false when no element is replaced', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Doe' },
      ];

      const condition = 'id';
      const replacement = { id: 4, name: 'New Person' }; // Element not present in the array

      const replaced = findAndReplace(array, replacement, condition);

      expect(replaced).toBe(false);
      expect(array).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Doe' },
      ]);
    });
  });

  describe('findAndRemove', () => {
    it('should remove an element based on a property condition', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Doe' },
      ];

      const condition = 'id';
      const toRemove = { id: 2, name: 'Jane' };

      const removed = findAndRemove(array, toRemove, condition);

      expect(removed).toBe(true);
      expect(array).toEqual([
        { id: 1, name: 'John' },
        { id: 3, name: 'Doe' },
      ]);
    });

    it('should remove an element based on a custom function condition', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Doe' },
      ];

      const condition = (element: any) => element.id === 2;
      const toRemove = { id: 2, name: 'Jane' };

      const removed = findAndRemove(array, toRemove, condition);

      expect(removed).toBe(true);
      expect(array).toEqual([
        { id: 1, name: 'John' },
        { id: 3, name: 'Doe' },
      ]);
    });

    it('should return false when no element is removed', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Doe' },
      ];

      const condition = 'id';
      const toRemove = { id: 4, name: 'DoesNotExist' }; // Element not present in the array

      const removed = findAndRemove(array, toRemove, condition);

      expect(removed).toBe(false);
      expect(array).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Doe' },
      ]);
    });
  });

  describe('getIntersection function', () => {
    it('returns empty array when one of the input arrays is empty', () => {
      const array1: string[] = ['a', 'b', 'c'];
      const array2: string[] = [];
      const result = getIntersection(array1, array2);
      expect(result).toEqual([]);
    });

    it('returns correct intersection for two string arrays', () => {
      const array1: string[] = ['a', 'b', 'c'];
      const array2: string[] = ['b', 'c', 'd'];
      const result = getIntersection(array1, array2);
      expect(result).toEqual(['b', 'c']);
    });

    it('returns correct intersection for two number arrays', () => {
      const array1: number[] = [1, 2, 3];
      const array2: number[] = [2, 3, 4];
      const result = getIntersection(array1, array2);
      expect(result).toEqual([2, 3]);
    });

    it('returns correct intersection with comparison function', () => {
      const array1: any[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      const array2: any[] = [{ id: 'a' }, { id: 'c' }, { id: 'x' }];

      const result = getIntersection(array1, array2, (a: any, b: any) => a.id === b.id);
      expect(result).toEqual([{ id: 'a' }, { id: 'c' }]);
    });
  });

  describe('hasIntersection function', () => {
    it('should return false if either of the input arrays has no elements', () => {
      expect(hasIntersection([], ['element'])).toBeFalsy();
      expect(hasIntersection(['element'], [])).toBeFalsy();
    });

    it('should return true if there is at least one common element between the arrays', () => {
      expect(hasIntersection(['common', 'unique1'], ['common', 'unique2'])).toBeTruthy();
    });

    it('should return false if there is no common element between the arrays', () => {
      expect(hasIntersection(['unique1'], ['unique2'])).toBeFalsy();
    });

    it('should return false if there is no common element between the arrays', () => {
      expect(hasIntersection(['unique1'], ['unique2'])).toBeFalsy();
    });

    it('should return true if intersection with comparison function', () => {
      const array1: any[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      const array2: any[] = [{ id: 'a' }, { id: 'c' }, { id: 'x' }];

      const result = hasIntersection(array1, array2, (a: any, b: any) => a.id === b.id);
      expect(result).toEqual(true);
    });

    it('should return false if no intersection with comparison function', () => {
      const array1: any[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      const array2: any[] = [{ id: 'x' }];

      const result = hasIntersection(array1, array2, (a: any, b: any) => a.id === b.id);
      expect(result).toEqual(false);
    });
  });

  describe('chunkArray()', function () {
    it('chunk even array', async () => {
      const result = chunkArray([0, 1, 2, 3], 2);
      expect(result.length).toEqual(2);
      expect(result[0][0]).toEqual(0);
      expect(result[0][1]).toEqual(1);
      expect(result[1][0]).toEqual(2);
      expect(result[1][1]).toEqual(3);
    });

    it('chunk uneven even array', async () => {
      const result = chunkArray([0, 1, 2], 2);
      expect(result.length).toEqual(2);
      expect(result[0][0]).toEqual(0);
      expect(result[0][1]).toEqual(1);
      expect(result[1][0]).toEqual(2);
      expect(result[1].length).toEqual(1);
    });

    it('chunk empty array', async () => {
      const result = chunkArray([], 2);
      expect(result.length).toEqual(0);
    });

    it('chunk array with lower size than batch size', async () => {
      const result = chunkArray([0], 2);
      expect(result.length).toEqual(1);
      expect(result[0][0]).toEqual(0);
    });
  });
});
