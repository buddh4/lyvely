export interface INumericDataPoint {
  get numericValue(): number;
}

export function implementsINumericDataPoint(dataPoint: any): dataPoint is INumericDataPoint {
  return 'numericValue' in dataPoint;
}
