import { ContentTypeDao } from '@/content';
import { Milestone } from '@/milestones/schemas/milestone.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CalendarPlanDao } from '@/calendar-plan';
import { Profile } from '@/profiles';
import { CalendarInterval } from '@lyvely/common';
import { IFetchQueryOptions } from '@/core';

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
