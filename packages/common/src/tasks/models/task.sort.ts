import { TaskModel } from './task.model';
import { ISortable, sortBySortOrder } from '@/models';
import { PropertiesOf } from '@/utils';

export function sortTasks<T extends PropertiesOf<TaskModel> & ISortable>(taks: T[]): T[] {
  return taks.sort((a: T, b: T) => {
    const aDone = a.done;
    const bDone = b.done;

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
