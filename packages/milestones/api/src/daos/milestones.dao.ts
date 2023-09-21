import { ContentTypeDao } from '@lyvely/content';
import { Milestone } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CalendarPlanDao } from '@lyvely/calendar-plan';
import { Profile } from '@lyvely/profiles';
import { CalendarInterval } from '@lyvely/common';
import { IFetchQueryOptions } from '@lyvely/core';

export class MilestonesDao extends ContentTypeDao<Milestone> implements CalendarPlanDao<Milestone> {
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
