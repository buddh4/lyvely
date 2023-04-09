import { Expose } from 'class-transformer';
import { IEditableModel } from '@/models';
import { CalendarInterval } from '@/calendar';
import { UpdateMilestoneModel } from './update-milestone.model';
import { IMilestoneConfig } from '../interfaces';
import { ContentModel } from '@/content';
import { ICalendarPlanEntry } from '@/calendar-plan';

@Expose()
export class MilestoneModel
  extends ContentModel<MilestoneModel, IMilestoneConfig>
  implements IEditableModel<UpdateMilestoneModel>, ICalendarPlanEntry
{
  static contentType = 'Milestone';
  type = MilestoneModel.contentType;

  get interval(): CalendarInterval {
    return this.config.interval;
  }

  set interval(interval: CalendarInterval) {
    this.config.interval = interval;
  }

  toEditModel() {
    return new UpdateMilestoneModel({
      title: this.content.title,
      text: this.content.text,
      interval: this.config.interval,
    });
  }
}
