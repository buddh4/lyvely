import { subtractDays, subtractMonths, subtractYears } from '@lyvely/dates';
import type { TimeSeriesCategoryKey, TimeSeriesAggregationInterval } from '../interfaces';

/**
 * Retrieves a map of time series category values for the X-axis for all possible interval filter.
 *
 * Note: The used ranges need to be in sync with the IntervalAggregation pipeline in the backend.
 *
 * @param {string} locale - The locale to use for formatting the date.
 * @returns {Object.<TimeSeriesAggregationInterval, string[]>} An object containing the time series interval categories for the X-axis.
 */
export const getTimeSeriesIntervalXAxis = (
  locale: string,
): Record<TimeSeriesAggregationInterval, string[]> => ({
  '7D': getDailyChartAxisCategories(subtractDays(new Date(), 6), new Date(), locale),
  '1M': getDailyChartAxisCategories(subtractMonths(new Date(), 1), new Date(), locale),
  '6M': getMonthlyChartAxisCategories(subtractMonths(new Date(), 6), new Date(), locale),
  '1Y': getMonthlyChartAxisCategories(subtractYears(new Date(), 1), new Date(), locale),
  '3Y': getMonthlyChartAxisCategories(subtractYears(new Date(), 3), new Date(), locale),
});

export function getChartCategoryByKey(
  key: TimeSeriesCategoryKey,
  interval: TimeSeriesAggregationInterval,
  locale: string,
) {
  const date = new Date(key.year, (key.month || 1) - 1, key.day || 1);
  switch (interval) {
    case '7D':
    case '1M':
      return getDailyChartAxisCategory(date, locale);
    case '6M':
    case '1Y':
    case '3Y':
      return getMonthlyChartAxisCategory(date, locale);
  }
}

export function getDailyChartAxisCategories(start: Date, end: Date, locale: string): string[] {
  const chartAxisCategories: string[] = [];

  for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
    chartAxisCategories.push(day.toLocaleDateString(locale, { day: 'numeric', month: 'short' }));
  }

  return chartAxisCategories;
}

export function getDailyChartAxisCategory(date: Date, locale: string) {
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

export function getMonthlyChartAxisCategories(start: Date, end: Date, locale: string): string[] {
  const chartAxisCategories: string[] = [];

  for (let month = start; month <= end; month.setMonth(month.getMonth() + 1)) {
    chartAxisCategories.push(getMonthlyChartAxisCategory(month, locale));
  }

  return chartAxisCategories;
}

export function getMonthlyChartAxisCategory(date: Date, locale: string) {
  return date.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
}
