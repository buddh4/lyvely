import { CalendarIntervalEnum } from "../../calendar";
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
    if(obj) {
      this.id = obj.id;
      this.sortOrder = obj.sortOrder;
    }

  }
}

@Exclude()
export class MoveAction {
  @Expose()
  attachToId?: string;

  @Expose()
  interval: CalendarIntervalEnum


  constructor(obj?: Partial<MoveAction>) {
    if(obj) {
      this.attachToId = obj.attachToId;
      this.interval = obj.interval;
    }
  }
}

export function sortBySortOrder(a: Sortable, b: Sortable) {
    if(a.sortOrder === b.sortOrder) {
        return 0;
    }

    if(typeof a.sortOrder === 'undefined') {
        return 1;
    }

    if(typeof b.sortOrder === 'undefined') {
        return -1;
    }

    return a.sortOrder - b.sortOrder;
}
