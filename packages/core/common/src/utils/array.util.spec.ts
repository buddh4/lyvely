import { chunkArray } from './array.util';

describe('array util', () => {
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
