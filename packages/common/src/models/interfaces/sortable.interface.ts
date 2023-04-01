import { Exclude, Expose, Type } from 'class-transformer';
import { PropertyType } from '../decorators';
import { BaseModel } from '../base.model';

export interface ISortable {
  getSortOrder(): number;
}

@Exclude()
export class SortResult {
  @Expose()
  id: string;

  @Expose()
  sortOrder: number;

  constructor(obj?: Partial<SortResult>) {
    if (obj) {
      this.id = obj.id;
      this.sortOrder = obj.sortOrder;
    }
  }
}

@Expose()
export class SortResponse extends BaseModel<SortResponse> {
  @Type(() => SortResult)
  @PropertyType([SortResult])
  sort: SortResult[];
}

export function sortBySortOrder(a: ISortable, b: ISortable) {
  if (a.getSortOrder() === b.getSortOrder()) return 0;
  if (typeof a.getSortOrder() === 'undefined') return 1;
  if (typeof b.getSortOrder() === 'undefined') return -1;
  return a.getSortOrder() - b.getSortOrder();
}
