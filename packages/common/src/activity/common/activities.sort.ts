import { IActivity } from '../interfaces';
import { isTask, ITask } from '../task';
import { sortBySortOrder } from '../../model';

export function sortActivities(activities: IActivity[]) {
  return activities.sort((a: IActivity, b: IActivity) => {
    if(isTask(a) && isTask(b)) {
      let aDone = (<ITask> a).done;
      let bDone =  (<ITask> b).done;

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