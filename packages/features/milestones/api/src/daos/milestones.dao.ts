import { ContentTypeDao } from '@lyvely/core';
import { Milestone } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICalendarPlanDao } from '@lyvely/calendar-plan';
import { Profile } from '@lyvely/core';
import { CalendarInterval } from '@lyvely/dates';
import { IFetchQueryOptions } from '@lyvely/core';

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
    options: IFetchQueryOptions<Milestone>,
  ): Promise<Milestone[]> {
    return this.findAllByProfile(profile, { 'config.interval': plan }, options);
  }
}
