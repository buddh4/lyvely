import { ContentType } from '@/content';
import { User } from '@/users';
import {
  BaseModel,
  CalendarInterval,
  getNumberEnumValues,
  ICalendarPlanEntry,
  IMilestoneConfig,
  PropertiesOf,
  MilestoneModel,
} from '@lyvely/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NestedSchema } from '@/core';

@NestedSchema()
export class MilestoneConfig extends BaseModel<MilestoneConfig> implements IMilestoneConfig {
  @Prop({ enum: getNumberEnumValues(CalendarInterval), required: true })
  interval: CalendarInterval;
}

const MilestoneConfigSchema = SchemaFactory.createForClass(MilestoneConfig);

@Schema()
export class Milestone
  extends ContentType<Milestone>
  implements PropertiesOf<MilestoneModel>, ICalendarPlanEntry
{
  @Prop({ type: MilestoneConfigSchema, required: true })
  config: MilestoneConfig;

  get interval(): CalendarInterval {
    return this.config.interval;
  }

  set interval(interval: CalendarInterval) {
    this.config.interval = interval;
  }

  toModel(user?: User): MilestoneModel {
    return new MilestoneModel(this);
  }
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
