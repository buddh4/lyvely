export interface NumericDataPointInterface {
  get numericValue(): number;
}

export function implementsINumericDataPoint(
  dataPoint: any
): dataPoint is NumericDataPointInterface {
  return 'numericValue' in dataPoint;
}
