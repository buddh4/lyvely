import { Model } from '@lyvely/api';
import { Milestone } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { CalendarPlanDao } from '@lyvely/calendar-plan';

export class MilestonesDao extends CalendarPlanDao<Milestone> {
  @InjectModel(Milestone.name)
  protected model: Model<Milestone>;

  /**
   * Defines the document query path of the interval field.
   */
  override intervalPath = 'config.interval';

  getModelConstructor() {
    return Milestone;
  }

  getModuleId(): string {
    return 'milestones';
  }
}
