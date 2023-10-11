import { getScaledProgress } from './profiles.util';

describe('ProfileUtil', () => {
  describe('getProgress', () => {
    it('get progress with score 0', () => {
      expect(getScaledProgress(0)).toEqual(0);
    });

    it('get progress for score within first scale', () => {
      expect(getScaledProgress(5, [[0, 10]])).toEqual(0.5);
    });

    it('get progress for score within first scale', () => {
      expect(
        getScaledProgress(20, [
          [0, 10],
          [10, 20],
        ]),
      ).toEqual(0.5);
    });

    it('get progress for score greater than last scale', () => {
      expect(
        getScaledProgress(105, [
          [0, 10],
          [10, 20],
        ]),
      ).toEqual(0.75);
    });

    it('full progress should fallback to 0', () => {
      expect(
        getScaledProgress(30, [
          [0, 10],
          [10, 20],
        ]),
      ).toEqual(0);
    });
  });
});
