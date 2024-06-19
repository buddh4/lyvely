import { DataPointSchemaFactory } from '../schemas/data-points/data-point-schema.factory';
import { buildDataPointModelName, DataPoint } from '../schemas';
import { Dao } from '@lyvely/api';
import type { IDataPointDaoMeta } from './data-point-dao-meta.interface';

export const DataPointDao = (meta: Omit<IDataPointDaoMeta, 'type'>): ClassDecorator => {
  meta = { ...meta };
  meta.discriminator ??= (doc) => DataPointSchemaFactory.getModelType(doc.valueType) || DataPoint;
  meta.modelName ??= buildDataPointModelName(meta.content.name);

  const dao = Dao(DataPoint, meta);

  return (target: any) => {
    dao(target);
    return target;
  };
};
