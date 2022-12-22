import { BaseEntity } from '@/core';
import { ISortable, NestedPaths, PropertiesOf } from '@lyvely/common';

export type IStreamable<T> = BaseEntity<T> & ISortable;
//export type StreamSortField<TModel> = NestedPaths<PropertiesOf<TModel>>;
export type StreamSortField<TModel> = string;
