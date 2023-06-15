import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@lyvely/server-core';
import { PropertyType, Type, UrlRoute } from '@lyvely/common';
import { Translatable } from '@/i18n';
import { ProfileInfo, ProfileInfoSchema } from '@/profiles';
import { User, UserInfo, UserInfoSchema } from '@/users';

export enum RenderFormat {
  HTML = 'html',
  PLAINTEXT = 'plain',
}

export interface NotificationContext {
  format: RenderFormat;
  receiver: User;
}

export interface INotificationType {
  type: string;
  groupId?: string;
  profileInfo?: ProfileInfo;
  userInfo?: UserInfo;
  getUrl(): UrlRoute;
  getTitle(format: NotificationContext): Translatable;
  getBody(format: NotificationContext): Translatable;
}

export type TNotificationType = Type<NotificationType> & { typeName: string };

export abstract class NotificationType<T extends INotificationType = INotificationType>
  extends BaseEntity<T>
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

  mergeWith(notification: T) {
    // Nothing todo
  }

  getMinRedeliveryDuration() {
    return 180_000; // 3 min
  }

  abstract getUrl(): UrlRoute | null;
  abstract getTitle(context: NotificationContext): Translatable;
  abstract getBody(context: NotificationContext): Translatable;
  abstract getCategory(): string;
}

@Schema({ discriminatorKey: 'type' })
export class NotificationSchemaType extends NotificationType implements INotificationType {
  getBody(format: NotificationContext): Translatable {
    return undefined;
  }

  getTitle(format: NotificationContext): Translatable {
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
