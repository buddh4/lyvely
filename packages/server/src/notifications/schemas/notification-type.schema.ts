import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, UrlRoute } from '@/core';
import mongoose from 'mongoose';
import { ProfileRoute } from '@/profiles/services/profile-url-generator.service';
import { Translatable } from '@/i18n';

export class ProfileInfo {
  @Prop({ type: [mongoose.Schema.Types.ObjectId], required: true })
  uid: TObjectId;

  @Prop({ required: true })
  guid: string;
}

const ProfileInfoSchema = SchemaFactory.createForClass(ProfileInfo);

export enum RenderFormat {
  HTML = 'html',
  PLAINTEXT = 'plain',
}

export interface INotificationType {
  type: string;
  groupId: string;
  profileInfo?: ProfileInfo;
  getUrl(): ProfileRoute | UrlRoute;
  getTitle(format: RenderFormat): Translatable;
  getBody(format: RenderFormat): Translatable;
}

export abstract class NotificationType<T extends INotificationType = INotificationType>
  extends BaseEntity<INotificationType>
  implements INotificationType
{
  @Prop()
  groupId: string;

  @Prop({ type: ProfileInfoSchema })
  profileInfo?: ProfileInfo;

  type: string;

  static collectionName() {
    return 'notifications';
  }

  mergeWith(notification: T) {
    // Nothing todo
  }

  abstract getUrl(): ProfileRoute | UrlRoute | null;
  abstract getTitle(format: RenderFormat): Translatable;
  abstract getBody(format: RenderFormat): Translatable;
}

@Schema({ discriminatorKey: 'type', collection: NotificationType.collectionName() })
class NotificationSchemaType extends NotificationType<INotificationType> implements INotificationType {
  getBody(format: RenderFormat): Translatable {
    return undefined;
  }

  getTitle(format: RenderFormat): Translatable {
    return undefined;
  }

  getUrl(): ProfileRoute | UrlRoute {
    return undefined;
  }
}

export const NotificationTypeSchema = SchemaFactory.createForClass(NotificationSchemaType);
