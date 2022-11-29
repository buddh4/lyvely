import { NotificationType, RenderFormat } from '@/notifications';
import { Translatable } from '@/i18n';
import { escapeHtmlIf, UrlRoute } from '@lyvely/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProfileInfo, ProfileInfoSchema } from '@/profiles';
import { UserInfo, UserInfoSchema } from '@/users';
import { NotificationTypeSchemaFactory } from '@/notifications/schemas/notification-type-schema.factory';

@Schema({ id: false })
export class TestNotification extends NotificationType<TestNotification> {
  @Prop({ type: ProfileInfoSchema, required: true })
  profileInfo: ProfileInfo;

  @Prop({ type: UserInfoSchema, required: true })
  userInfo: UserInfo;

  getBody(format: RenderFormat): Translatable {
    return {
      key: 'test.notification.body',
      params: {
        user: escapeHtmlIf(this.userInfo.name, format === RenderFormat.HTML),
      },
    };
  }

  getTitle(format: RenderFormat): Translatable {
    return { key: 'test.notification.title' };
  }

  getUrl(): UrlRoute {
    return undefined;
  }
}

export const TestNotificationSchema = NotificationTypeSchemaFactory.createForClass(TestNotification);
