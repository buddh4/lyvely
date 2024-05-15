import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument, type StrictBaseDocumentData, type TObjectId } from '@/core';
import { PropertyType, Type } from '@lyvely/common';
import { UrlRoute } from '@lyvely/interface';
import { Translatable } from '@/i18n';
import { ProfileInfo, ProfileInfoSchema } from '@/profiles';
import { User, UserInfo, UserInfoSchema } from '@/users';
import { NotImplementedException } from '@nestjs/common';

export enum RenderFormat {
  HTML = 'html',
  PLAINTEXT = 'plain',
}

export interface INotificationContext {
  format: RenderFormat;
  receiver: User;
}

export interface INotificationType {
  type: string;
  groupId?: string;
  profileInfo?: ProfileInfo;
  userInfo?: UserInfo;
  getUrl(): UrlRoute | null;
  getTitle(format: INotificationContext): Translatable;
  getBody(format: INotificationContext): Translatable;
}

export type TNotificationType = Type<NotificationType> & { typeName: string };

export abstract class NotificationType implements INotificationType {
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

  _id: TObjectId;

  id: string;

  constructor(data: StrictBaseDocumentData<Omit<NotificationType, 'type'>>) {
    BaseDocument.init(this, data);
  }

  mergeWith() {
    // Nothing todo
  }

  getMinRedeliveryDuration() {
    return 180_000; // 3 min
  }

  abstract getUrl(): UrlRoute | null;
  abstract getTitle(context: INotificationContext): Translatable;
  abstract getBody(context: INotificationContext): Translatable;
  abstract getCategory(): string;
}

@Schema({ discriminatorKey: 'type' })
export class NotificationSchemaType extends NotificationType implements INotificationType {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBody(context: INotificationContext): Translatable {
    throw new NotImplementedException();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTitle(context: INotificationContext): Translatable {
    throw new NotImplementedException();
  }

  getUrl(): UrlRoute | null {
    return null;
  }

  getCategory(): string {
    return '';
  }
}

export const NotificationTypeSchema = SchemaFactory.createForClass(NotificationSchemaType);
