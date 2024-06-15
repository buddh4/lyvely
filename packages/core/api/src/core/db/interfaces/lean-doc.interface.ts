import { BaseDocument } from './base.document';
import { FlattenMaps, Require_id } from 'mongoose';
import { PropertiesOf } from '@lyvely/common';

export type LeanDoc<T extends BaseDocument<T['_id']>> = (
  | Require_id<FlattenMaps<PropertiesOf<T>>>
  | Require_id<FlattenMaps<T>>
  | Require_id<T>
  | Require_id<PropertiesOf<T>>
) &
  object;
