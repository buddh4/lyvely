import { Exclude, Expose } from 'class-transformer';
import { PropertyType, BaseModel } from '@lyvely/common';

export type SortValue = number | undefined;

export interface ISortable {
  getSortOrder?: () => number | undefined;
  sortOrder?: number;
}

@Exclude()
export class SortResult extends BaseModel<SortResult> {
  @Expose()
  id: string;

  @Expose()
  sortOrder: number;
}

@Expose()
export class SortResponse extends BaseModel<SortResponse> {
  @PropertyType([SortResult])
  sort: SortResult[];
}

export function getSortOrder(obj: any) {
  if ('sortOrder' in obj) return obj.sortOrder;
  if (typeof obj.getSortOrder === 'function') return obj.getSortOrder();
  return Number.MAX_VALUE;
}

export function sortBySortOrder(a: ISortable, b: ISortable) {
  const aSortOrder = getSortOrder(a);
  const bSortOrder = getSortOrder(b);
  if (aSortOrder === bSortOrder) return 0;
  if (typeof aSortOrder === 'undefined') return 1;
  if (typeof bSortOrder === 'undefined') return -1;
  return (aSortOrder || 0) - (bSortOrder || 0);
}