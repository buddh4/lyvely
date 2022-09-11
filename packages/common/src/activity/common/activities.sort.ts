import { ActivityModel } from '../models';
import { isTask, TaskModel } from '../task';
import { sortBySortOrder } from '../../model';

export function sortActivities(activities: ActivityModel[]) {
  return activities.sort((a: ActivityModel, b: ActivityModel) => {
    if(isTask(a) && isTask(b)) {
      let aDone = (<TaskModel> a).done;
      let bDone =  (<TaskModel> b).done;

      if(aDone && !bDone) {
        return 1;
      }

      if(!aDone && bDone) {
        return -1;
      }
    }

    return sortBySortOrder(a, b);
  });
}
