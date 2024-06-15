import { Milestone } from '../schemas';
import { CalendarPlanDao } from '@lyvely/calendar-plan';
import { Dao } from '@lyvely/api';

@Dao(Milestone)
export class MilestonesDao extends CalendarPlanDao<Milestone> {
  /**
   * Defines the document query path of the interval field.
   */
  override intervalPath = 'config.interval';
}
