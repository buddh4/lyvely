import { DiscriminatorOptions } from '@nestjs/mongoose/dist/interfaces/model-definition.interface';
import { ModelDefinition } from '@nestjs/mongoose';
import { DataPointSchema } from './data-point.schema';
import { NumberDataPoint, NumberDataPointSchema } from './number-data-point.schema';
import { SelectionDataPoint, SelectionDataPointSchema } from './selection-data-point.schema';
import { TextDataPoint, TextDataPointSchema } from './text-data-point.schema';
import { TimerDataPoint, TimerDataPointSchema } from './timer-data-point.schema';
import { DataPointValueType } from '@lyvely/time-series-interface';

const DataPointDiscriminatorMap = new Map<string, DiscriminatorOptions>();
DataPointDiscriminatorMap.set(DataPointValueType.Number, {
  name: NumberDataPoint.name,
  schema: NumberDataPointSchema,
  value: DataPointValueType.Number,
})
  .set(DataPointValueType.Selection, {
    name: SelectionDataPoint.name,
    schema: SelectionDataPointSchema,
    value: DataPointValueType.Selection,
  })
  .set(DataPointValueType.Text, {
    name: TextDataPoint.name,
    schema: TextDataPointSchema,
    value: DataPointValueType.Text,
  })
  .set(DataPointValueType.Timer, {
    name: TimerDataPoint.name,
    schema: TimerDataPointSchema,
    value: DataPointValueType.Timer,
  });

export function buildDataPointModelName(contentName: string) {
  return contentName + 'DataPoint';
}

export function buildDiscriminatorName(contentName: string, def: string) {
  return buildDataPointModelName(contentName) + '.' + def;
}

export function getDataPointModelDefinition(
  contentName: string,
  definitions: Array<DiscriminatorOptions | string>,
  collection?: string,
): ModelDefinition {
  const name = buildDataPointModelName(contentName);
  collection ??= name.toLowerCase() + 's';

  const discriminators = definitions.map<DiscriminatorOptions>((def) => {
    def = typeof def !== 'object' ? Object.assign({}, DataPointDiscriminatorMap.get(def)) : def;
    def.name = buildDiscriminatorName(contentName, def.name);
    return def;
  });

  return {
    name,
    collection,
    schema: DataPointSchema,
    discriminators,
  };
}
