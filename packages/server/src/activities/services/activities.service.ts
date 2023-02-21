import { Injectable, Inject } from '@nestjs/common';
import { Activity } from '../schemas';
import { Profile } from '@/profiles';
import { ActivitiesDao } from '../daos/activities.dao';
import { EntityIdentity } from '@/core';
import { HabitDataPointService } from './habit-data-point.service';
import { TimeSeriesContentService } from '@/time-series/services/time-series-content.service';
import { NumberDataPoint } from '@/time-series';

@Injectable()
export class ActivitiesService extends TimeSeriesContentService<Activity, NumberDataPoint> {
  @Inject()
  protected contentDao: ActivitiesDao;

  @Inject()
  protected dataPointService: HabitDataPointService;

  /**
   * Finds an activity by given profile and activity identity.
   *
   * @deprecated Currently only used in tests
   * @param profile
   * @param id
   */
  async findByProfileAndId(profile: Profile, id: EntityIdentity<Activity>): Promise<Activity> {
    return this.contentDao.findByProfileAndId(profile, id);
  }
}
