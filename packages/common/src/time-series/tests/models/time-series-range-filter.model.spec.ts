import { TimeSeriesRangeFilter, getTimingIdsByRange } from '@/time-series';

describe('CalendarUtils', () => {
  describe('getTimingIdsByRange', function () {
    it('simple date range filter', async () => {
      const filter = new TimeSeriesRangeFilter({
        from: '2021-04-03',
        to: '2021-04-05',
      });

      const result = getTimingIdsByRange(filter);
      expect(result).toContain('U');
      expect(result).toContain('Y:2021');
      expect(result).toContain('Y:2021;Q:2');
      expect(result).toContain('Y:2021;Q:2;M:4');
      // Includes a week of year switch
      expect(result).toContain('Y:2021;Q:2;M:4;W:13');
      expect(result).toContain('Y:2021;Q:2;M:4;W:14');
      expect(result).toContain('Y:2021;Q:2;M:4;W:13;D:3');
      expect(result).toContain('Y:2021;Q:2;M:4;W:13;D:4');
      expect(result).toContain('Y:2021;Q:2;M:4;W:14;D:5');
    });

    it('simple include filter', async () => {
      const filter = new TimeSeriesRangeFilter({
        includes: ['Y:2021;Q:2;M:4;W:13;D:4', 'Y:2021;Q:2;M:4;W:14;D:5'],
      });

      const result = getTimingIdsByRange(filter);

      expect(result.length).toEqual(2);
      expect(result).toContain('Y:2021;Q:2;M:4;W:13;D:4');
      expect(result).toContain('Y:2021;Q:2;M:4;W:14;D:5');
    });

    it('include with date range', async () => {
      const filter = new TimeSeriesRangeFilter({
        includes: ['Y:2021;Q:2;M:4;W:13;D:4', 'Y:2021;Q:2;M:4;W:14;D:5'],
        from: '2021-04-03',
        to: '2021-04-05',
      });

      const result = getTimingIdsByRange(filter);

      expect(result.length).toEqual(2);
      expect(result).toContain('Y:2021;Q:2;M:4;W:13;D:4');
      expect(result).toContain('Y:2021;Q:2;M:4;W:14;D:5');
    });

    it('simple exclude filter', async () => {
      const filter = new TimeSeriesRangeFilter({
        excludes: ['Y:2021;Q:2;M:4;W:13;D:4', 'Y:2021;Q:2;M:4;W:14;D:5'],
      });

      const result = getTimingIdsByRange(filter);
      expect(result.length).toEqual(0);
    });

    it('exclude with date range filter', async () => {
      const filter = new TimeSeriesRangeFilter({
        excludes: ['Y:2021;Q:2;M:4;W:13;D:4', 'Y:2021;Q:2;M:4;W:14;D:5'],
        from: '2021-04-03',
        to: '2021-04-05',
      });

      const result = getTimingIdsByRange(filter);
      expect(result).toContain('U');
      expect(result).toContain('Y:2021');
      expect(result).toContain('Y:2021;Q:2');
      expect(result).toContain('Y:2021;Q:2;M:4');
      // Includes a week of year switch
      expect(result).toContain('Y:2021;Q:2;M:4;W:13');
      expect(result).toContain('Y:2021;Q:2;M:4;W:14');
      expect(result).toContain('Y:2021;Q:2;M:4;W:13;D:3');
      expect(result).not.toContain('Y:2021;Q:2;M:4;W:13;D:4');
      expect(result).not.toContain('Y:2021;Q:2;M:4;W:14;D:5');
    });
  });
});
