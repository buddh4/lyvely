import { TaskModel } from './task.model';
import { ISortable, sortBySortOrder } from '@lyvely/interface';
import { PropertiesOf } from '@lyvely/common';

export function sortTasks<T extends PropertiesOf<TaskModel> & ISortable>(taks: T[]): T[] {
  return taks.sort((a: T, b: T) => {
    const aDone = a.state.done;
    const bDone = b.state.done;

    if (aDone && !bDone) return 1;
    if (!aDone && bDone) return -1;
    if (aDone && bDone) {
      if (a.meta.updatedAt < b.meta.updatedAt) return 1;
      if (a.meta.updatedAt > b.meta.updatedAt) return -1;
      if (a.meta.updatedAt === b.meta.updatedAt) return 0;
    }

    return sortBySortOrder(a, b);
  });
}
