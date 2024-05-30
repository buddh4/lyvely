import { ContentTypeDao, Model, Profile, IFetchQueryOptions } from '@lyvely/api';
import { Milestone } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { ICalendarPlanDao } from '@lyvely/calendar-plan';
import { CalendarInterval } from '@lyvely/dates';

export class MilestonesDao
  extends ContentTypeDao<Milestone>
  implements ICalendarPlanDao<Milestone>
{
  @InjectModel(Milestone.name)
  protected model: Model<Milestone>;

  getModelConstructor() {
    return Milestone;
  }

  getModuleId(): string {
    return 'milestones';
  }

  findByProfileAndInterval(
    profile: Profile,
    plan: CalendarInterval,
    options: IFetchQueryOptions<Milestone>
  ): Promise<Milestone[]> {
    return this.findAllByProfile(profile, { 'config.interval': plan }, options);
  }
}
