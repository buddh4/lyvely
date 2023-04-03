import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import { DataPointValueType, IDataPointConfig, ISelectionDataPointConfig } from '../interfaces';
import type { ISelectionDataPointValue } from '../interfaces';

@Expose()
export class SelectionDataPointModel extends DataPointModel<SelectionDataPointModel> {
  value: ISelectionDataPointValue;
  valueType = DataPointValueType.Selection;

  afterInit() {
    this.value ??= { selection: [] };
  }
}

export function isSelectionDataPointConfig(
  config: IDataPointConfig,
): config is ISelectionDataPointConfig {
  return config.valueType === DataPointValueType.Selection;
}
