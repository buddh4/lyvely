import { ContentType, User, NestedSchema, TObjectId } from '@lyvely/api';
import { CalendarInterval } from '@lyvely/dates';
import { ICalendarPlanEntry } from '@lyvely/calendar-plan';
import { IMilestoneConfig, MilestoneModel } from '@lyvely/milestones-interface';
import { getNumberEnumValues, PropertiesOf } from '@lyvely/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PropertyType } from '@lyvely/common/src';

@NestedSchema()
export class MilestoneConfig implements IMilestoneConfig {
  @Prop({ enum: getNumberEnumValues(CalendarInterval), required: true })
  interval: CalendarInterval;

  constructor(data: PropertiesOf<MilestoneConfig>) {
    this.interval = data.interval;
  }
}

const MilestoneConfigSchema = SchemaFactory.createForClass(MilestoneConfig);

@Schema()
export class Milestone
  extends ContentType<MilestoneConfig>
  implements PropertiesOf<MilestoneModel<TObjectId>>, ICalendarPlanEntry<TObjectId>
{
  @Prop({ type: MilestoneConfigSchema, required: true })
  @PropertyType(MilestoneConfig)
  override config: MilestoneConfig;

  get interval(): CalendarInterval {
    return this.config.interval;
  }

  set interval(interval: CalendarInterval) {
    this.config.interval = interval;
  }

  toModel(user?: User): MilestoneModel<any> {
    return new MilestoneModel(this);
  }
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
