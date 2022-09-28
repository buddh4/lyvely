import { DataPointInputType, DataPointValueType } from '../interfaces';

// CheckboxValueStrategy extends NumberValueStrategy
// RangeValueStrategy extends NumberValueStrategy

export const SupporedLogValueInputTypes = {
  [DataPointValueType.Number]: [DataPointInputType.Checkbox, DataPointInputType.Range, DataPointInputType.Spinner],
  [DataPointValueType.Text]: [DataPointInputType.Textarea],
  [DataPointValueType.Boolean]: [DataPointInputType.Checkbox],
};
