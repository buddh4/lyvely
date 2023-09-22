import { BaseEntity, NestedSchema } from '@lyvely/core';
import { PropertyType } from '@lyvely/models';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { addByInterval, CalendarTimeInterval } from '@lyvely/dates';
import { UserNotificationStateModel } from '@lyvely/users-interface';

export interface INotificationRateLimit {
  channel: string;
  max: number;
  interval: CalendarTimeInterval;
}

@NestedSchema()
export class NotificationRateLimit extends BaseEntity<NotificationRateLimit> {
  @Prop({ type: Date })
  firstDelivery?: Date;

  @Prop({ required: true })
  channel: string;

  @Prop({ required: true })
  count: number;

  constructor({ channel }: INotificationRateLimit) {
    super({ channel });
  }

  increment({ interval }: INotificationRateLimit) {
    if (!this.firstDelivery || addByInterval(this.firstDelivery, interval, 1) <= new Date()) {
      this.firstDelivery = new Date();
      this.count = 0;
    }

    this.count++;
    return this;
  }

  isRateLimited({ max }: INotificationRateLimit) {
    if (!this.count) return false;
    if (!this.firstDelivery) return false;

    return this.count > max;
  }
}

const NotificationRateLimitSchema = SchemaFactory.createForClass(NotificationRateLimit);

@NestedSchema()
export class UserNotificationState extends UserNotificationStateModel {
  @Prop({ type: [NotificationRateLimitSchema] })
  @PropertyType([NotificationRateLimit])
  counters: NotificationRateLimit[];

  @Prop({ type: Map, of: [String] })
  preferences: Map<string, string[]>;

  @Prop()
  @PropertyType(Boolean, { default: false })
  updatesAvailable: boolean;

  incrementRateLimitCounter(rateLimit: INotificationRateLimit) {
    return this.getOrCreateRateLimit(rateLimit).increment(rateLimit);
  }

  isRateLimited(rateLimit: INotificationRateLimit) {
    return this.getOrCreateRateLimit(rateLimit).isRateLimited(rateLimit);
  }

  getOrCreateRateLimit(rateLimit: INotificationRateLimit) {
    let result = this.counters.find((counter) => counter.channel === rateLimit.channel);
    if (!result) {
      result = new NotificationRateLimit(rateLimit);
      this.counters.push(result);
    }
    return result;
  }
}

export const UserNotificationStateSchema = SchemaFactory.createForClass(UserNotificationState);
