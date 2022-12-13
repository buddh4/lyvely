import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@/core';
import { PropertyType, Type, UrlRoute } from '@lyvely/common';
import { Translatable } from '@/i18n';
import { ProfileInfo, ProfileInfoSchema } from '@/profiles';
import { UserInfo, UserInfoSchema } from '@/users';

export enum RenderFormat {
  HTML = 'html',
  PLAINTEXT = 'plain',
}

export interface INotificationType {
  type: string;
  groupId?: string;
  profileInfo?: ProfileInfo;
  userInfo?: UserInfo;
  getUrl(): UrlRoute;
  getTitle(format: RenderFormat): Translatable;
  getBody(format: RenderFormat): Translatable;
}

export type TNotificationType = Type<NotificationType> & { typeName: string };

export abstract class NotificationType<T extends INotificationType = INotificationType>
  extends BaseEntity<Omit<T, 'type'>>
  implements INotificationType
{
  static typeName: string;

  @Prop()
  groupId?: string;

  @Prop({ type: ProfileInfoSchema })
  @PropertyType(ProfileInfo, { optional: true })
  profileInfo?: ProfileInfo;

  @Prop({ type: UserInfoSchema })
  @PropertyType(UserInfo, { optional: true })
  userInfo?: UserInfo;

  type: string;

  static collectionName() {
    return 'notifications';
  }

  mergeWith(notification: T) {
    // Nothing todo
  }

  getMinRedeliveryDuration() {
    return 180_000; // 3 min
  }

  abstract getUrl(): UrlRoute | null;
  abstract getTitle(format: RenderFormat): Translatable;
  abstract getBody(format: RenderFormat): Translatable;
  abstract getCategory(): string;
}

@Schema({
  discriminatorKey: 'type',
  collection: NotificationType.collectionName(),
})
export class NotificationSchemaType
  extends NotificationType<INotificationType>
  implements INotificationType
{
  getBody(format: RenderFormat): Translatable {
    return undefined;
  }

  getTitle(format: RenderFormat): Translatable {
    return undefined;
  }

  getUrl(): UrlRoute {
    return undefined;
  }

  getCategory(): string {
    return '';
  }
}

export const NotificationTypeSchema = SchemaFactory.createForClass(NotificationSchemaType);
