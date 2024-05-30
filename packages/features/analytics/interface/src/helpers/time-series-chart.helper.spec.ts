import { getChartCategoryByKey } from './time-series-chart.helper';

describe('Time Series Chart Helper', () => {
  describe('getChartCategoryByKey', () => {
    it('should return the correct chart category for 7D interval key', () => {
      expect(getChartCategoryByKey({ year: 2024, month: 4, day: 25 }, '7D', 'de')).toEqual(
        '25. Apr.'
      );
    });
    it('should return the correct chart category for 1M interval key', () => {
      expect(getChartCategoryByKey({ year: 2024, month: 4, day: 25 }, '1M', 'de')).toEqual(
        '25. Apr.'
      );
    });
    it('should return the correct chart category for 6M interval key', () => {
      expect(getChartCategoryByKey({ year: 2024, month: 4 }, '6M', 'de')).toEqual('Apr. 2024');
    });
    it('should return the correct chart category for 1Y interval key', () => {
      expect(getChartCategoryByKey({ year: 2024, month: 4 }, '1Y', 'de')).toEqual('Apr. 2024');
    });
    it('should return the correct chart category for 3Y interval key', () => {
      expect(getChartCategoryByKey({ year: 2024, month: 4 }, '3Y', 'de')).toEqual('Apr. 2024');
    });
  });
});
