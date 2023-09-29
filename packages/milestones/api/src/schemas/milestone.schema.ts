import { ContentType } from '@lyvely/content';
import { User } from '@lyvely/users';
import { CalendarInterval } from '@lyvely/dates';
import { ICalendarPlanEntry } from '@lyvely/calendar-plan';
import { IMilestoneConfig, MilestoneModel } from '@lyvely/milestones-interface';
import { BaseModel, getNumberEnumValues, PropertiesOf } from '@lyvely/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NestedSchema } from '@lyvely/core';
import { Types } from 'mongoose';

@NestedSchema()
export class MilestoneConfig extends BaseModel<MilestoneConfig> implements IMilestoneConfig {
  @Prop({ enum: getNumberEnumValues(CalendarInterval), required: true })
  interval: CalendarInterval;
}

const MilestoneConfigSchema = SchemaFactory.createForClass(MilestoneConfig);

@Schema()
export class Milestone
  extends ContentType<Milestone>
  implements PropertiesOf<MilestoneModel<Types.ObjectId>>, ICalendarPlanEntry<Types.ObjectId>
{
  @Prop({ type: MilestoneConfigSchema, required: true })
  config: MilestoneConfig;

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
