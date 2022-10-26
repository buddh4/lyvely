import { Exclude, Expose } from 'class-transformer';

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

export function sortBySortOrder(a: ISortable, b: ISortable) {
  if (a.getSortOrder() === b.getSortOrder()) {
    return 0;
  }

  if (typeof a.getSortOrder() === 'undefined') {
    return 1;
  }

  if (typeof b.getSortOrder() === 'undefined') {
    return -1;
  }

  return a.getSortOrder() - b.getSortOrder();
}
