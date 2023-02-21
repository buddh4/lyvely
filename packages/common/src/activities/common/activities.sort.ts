import { ActivityModel } from '../models';
import { isTask, TaskModel } from '../tasks';
import { sortBySortOrder } from '@/models';
import { PropertiesOf } from '@/utils';

export function sortActivities(activities: ActivityModel[]): ActivityModel[] {
  return activities.sort((a: ActivityModel, b: ActivityModel) => {
    if (isTask(a) && isTask(b)) {
      const aDone = (<TaskModel>a).done;
      const bDone = (<TaskModel>b).done;

      if (aDone && !bDone) return 1;
      if (!aDone && bDone) return -1;
      if (aDone && bDone) {
        if (a.meta.updatedAt < b.meta.updatedAt) return 1;
        if (a.meta.updatedAt > b.meta.updatedAt) return -1;
        if (a.meta.updatedAt === b.meta.updatedAt) return 0;
      }
    }

    return sortBySortOrder(a, b);
  });
}
