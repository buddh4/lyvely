import { Type } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import {
  MultiUserSubscription,
  SingleUserSubscription,
  ProfileSubscription,
  UserSubscription,
  Subscription,
} from './user-subscription.schema';
import { createBaseEntityInstance } from '@lyvely/server-core';
import { PropertiesOf } from '@lyvely/common';

const SubscriptionTypes = {
  [ProfileSubscription.typeName]: ProfileSubscription,
  [SingleUserSubscription.typeName]: SingleUserSubscription,
  [MultiUserSubscription.typeName]: MultiUserSubscription,
};

export class UserSubscriptionSchemaAddition {
  static addSubscriptionsSchemas<TClass = any>(
    Schema: mongoose.Schema<TClass>,
    path: string,
    types?: Array<Type<UserSubscription> & { typeName: string }>,
  ): mongoose.Schema<TClass> {
    types ||= [ProfileSubscription, MultiUserSubscription, SingleUserSubscription];
    types.forEach((SubscriptionType) => {
      SubscriptionTypes[SubscriptionType.typeName] ||= SubscriptionType;
      const SubscriptionTypeSchema = SchemaFactory.createForClass(SubscriptionType);
      Schema.path<mongoose.Schema.Types.Subdocument>(path).discriminator(
        SubscriptionType.typeName,
        SubscriptionTypeSchema,
      );
    });
    return Schema;
  }

  static assureInstance(subscription?: PropertiesOf<Subscription>) {
    if (subscription && !(subscription instanceof UserSubscription)) {
      const SubscriptionType = SubscriptionTypes[subscription.type];
      return createBaseEntityInstance(SubscriptionType, subscription);
    }

    return subscription;
  }
}
