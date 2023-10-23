import { ContentType, User, NestedSchema, TObjectId } from '@lyvely/core';
import { CalendarInterval } from '@lyvely/dates';
import { ICalendarPlanEntry } from '@lyvely/calendar-plan';
import { IMilestoneConfig, MilestoneModel } from '@lyvely/milestones-interface';
import { BaseModel, getNumberEnumValues, PropertiesOf } from '@lyvely/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@NestedSchema()
export class MilestoneConfig extends BaseModel<MilestoneConfig> implements IMilestoneConfig {
  @Prop({ enum: getNumberEnumValues(CalendarInterval), required: true })
  interval: CalendarInterval;
}

const MilestoneConfigSchema = SchemaFactory.createForClass(MilestoneConfig);

@Schema()
export class Milestone
  extends ContentType<Milestone>
  implements PropertiesOf<MilestoneModel<TObjectId>>, ICalendarPlanEntry<TObjectId>
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
