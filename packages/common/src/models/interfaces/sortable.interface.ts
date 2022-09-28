import { Exclude, Expose } from 'class-transformer';

export interface Sortable {
  sortOrder?: number;
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

export function sortBySortOrder(a: Sortable, b: Sortable) {
  if (a.sortOrder === b.sortOrder) {
    return 0;
  }

  if (typeof a.sortOrder === 'undefined') {
    return 1;
  }

  if (typeof b.sortOrder === 'undefined') {
    return -1;
  }

  return a.sortOrder - b.sortOrder;
}
