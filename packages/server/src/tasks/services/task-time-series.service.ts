import { Injectable, Inject } from '@nestjs/common';
import { Task } from '../schemas';
import { Profile } from '@/profiles';
import { DataPointIntervalFilter, getTimingIds } from '@lyvely/common';
import { User } from '@/users';
import { TasksDao } from '../daos';
import { ITimeSeriesContentSearchResult } from '@/time-series';
import { SortableTimeSeriesService } from '@/time-series/services/sortable-time-series.service';

@Injectable()
export class TaskTimeSeriesService extends SortableTimeSeriesService<Task, undefined> {
  @Inject()
  protected contentDao: TasksDao;

  async findByFilter(
    profile: Profile,
    user: User,
    filter: DataPointIntervalFilter,
  ): Promise<ITimeSeriesContentSearchResult<Task, undefined>> {
    return {
      models: await this.contentDao.findByProfileAndTimingIds(
        profile,
        user,
        getTimingIds(filter.date, profile.locale, filter.level),
      ),
    };
  }
}
