export function getDailyChartAxisCategories(
  start: Date,
  end: Date,
  locale: string = navigator.language,
): string[] {
  const chartAxisCategories: string[] = [];

  for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
    chartAxisCategories.push(day.toLocaleDateString(locale, { day: 'numeric', month: 'short' }));
  }

  return chartAxisCategories;
}

export function getMonthlyChartAxisCategories(
  start: Date,
  end: Date,
  locale: string = navigator.language,
): string[] {
  const chartAxisCategories: string[] = [];

  for (let month = start; month <= end; month.setMonth(month.getMonth() + 1)) {
    chartAxisCategories.push(month.toLocaleDateString(locale, { month: 'short', year: 'numeric' }));
  }

  return chartAxisCategories;
}

export function getYearlyChartAxisCategories(start: Date, end: Date): string[] {
  const chartAxisCategories: string[] = [];

  for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
    chartAxisCategories.push(year.toString());
  }

  return chartAxisCategories;
}
