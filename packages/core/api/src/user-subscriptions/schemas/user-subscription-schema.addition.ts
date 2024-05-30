import { Type } from '@nestjs/common';
import { SchemaFactory } from '@nestjs/mongoose';
import {
  MultiUserSubscription,
  SingleUserSubscription,
  ProfileSubscription,
  UserSubscription,
  Subscription,
} from './user-subscription.schema';
import { createBaseDocumentInstance, Schema, Subdocument } from '@/core';
import { PropertiesOf } from '@lyvely/common';

const SubscriptionTypes: Record<string, Type<UserSubscription>> = {
  [ProfileSubscription.typeName]: ProfileSubscription,
  [SingleUserSubscription.typeName]: SingleUserSubscription,
  [MultiUserSubscription.typeName]: MultiUserSubscription,
};

export class UserSubscriptionSchemaAddition {
  static addSubscriptionsSchemas<TClass = any>(
    Schema: Schema<TClass>,
    path: string,
    types?: Array<Type<UserSubscription> & { typeName: string }>
  ): Schema<TClass> {
    types ||= [ProfileSubscription, MultiUserSubscription, SingleUserSubscription];
    types.forEach((SubscriptionType) => {
      SubscriptionTypes[SubscriptionType.typeName] ||= SubscriptionType;
      const SubscriptionTypeSchema = SchemaFactory.createForClass(SubscriptionType);
      Schema.path<Subdocument>(path).discriminator(
        SubscriptionType.typeName,
        SubscriptionTypeSchema
      );
    });
    return Schema;
  }

  static assureInstance(subscription?: PropertiesOf<Subscription>) {
    if (subscription && !(subscription instanceof UserSubscription)) {
      const SubscriptionType = SubscriptionTypes[subscription.type];
      return createBaseDocumentInstance(SubscriptionType, subscription);
    }

    return subscription;
  }
}
