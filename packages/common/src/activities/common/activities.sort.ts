import { ActivityModel } from '../models';
import { isTask, TaskModel } from '../task';
import { sortBySortOrder } from '@/models';

export function sortActivities(activities: ActivityModel[]) {
  return activities.sort((a: ActivityModel, b: ActivityModel) => {
    if (isTask(a) && isTask(b)) {
      const aDone = (<TaskModel>a).done;
      const bDone = (<TaskModel>b).done;

      if (aDone && !bDone) {
        return 1;
      }

      if (!aDone && bDone) {
        return -1;
      }
    }

    return sortBySortOrder(a, b);
  });
}
