import { Exclude, Expose } from 'class-transformer';
import { IEditableModel } from '@lyvely/models';
import { CalendarInterval } from '@lyvely/dates';
import { UpdateMilestoneModel } from './update-milestone.model';
import { IMilestoneConfig } from '../interfaces';
import { ContentModel } from '@lyvely/content';
import { ICalendarPlanEntry } from '@lyvely/calendar-plan';
import { DataPointInputType, DataPointValueType } from '@/time-series';
import { UserAssignmentStrategy } from '@/collab';

@Exclude()
export class MilestoneModel
  extends ContentModel<MilestoneModel, IMilestoneConfig>
  implements IEditableModel<UpdateMilestoneModel>, ICalendarPlanEntry
{
  static contentType = 'Milestone';

  @Expose()
  type = MilestoneModel.contentType;

  get interval(): CalendarInterval {
    return this.config.interval;
  }

  set interval(interval: CalendarInterval) {
    this.config.interval = interval;
  }

  getDefaultConfig(): IMilestoneConfig {
    return {
      interval: CalendarInterval.Daily,
    };
  }

  toEditModel() {
    return new UpdateMilestoneModel({
      title: this.content.title,
      text: this.content.text,
      interval: this.config.interval,
    });
  }
}
