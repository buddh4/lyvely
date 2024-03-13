import { Exclude, Expose } from 'class-transformer';
import { IEditableModel, ContentModel } from '@lyvely/interface';
import { CalendarInterval } from '@lyvely/dates';
import { UpdateMilestoneModel } from './update-milestone.model';
import { IMilestoneConfig } from '../interfaces';
import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';

@Exclude()
export class MilestoneModel<TID = string>
  extends ContentModel<TID, IMilestoneConfig>
  implements IEditableModel<UpdateMilestoneModel>, ICalendarPlanEntry<TID>
{
  static contentType = 'Milestone';

  @Expose()
  override type = MilestoneModel.contentType;

  get interval(): CalendarInterval {
    return this.config.interval;
  }

  set interval(interval: CalendarInterval) {
    this.config.interval = interval;
  }

  override getDefaultConfig(): IMilestoneConfig {
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
