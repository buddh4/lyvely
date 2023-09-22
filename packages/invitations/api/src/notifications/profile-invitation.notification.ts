import {
  Notification,
  NotificationContext,
  NotificationType,
  RenderFormat,
} from '@lyvely/notifications';
import { Translatable } from '@lyvely/i18n';
import { escapeHtmlIf, PropertyType, UrlRoute } from '@lyvely/models';
import { Prop } from '@nestjs/mongoose';
import { User, UserInfo, UserInfoSchema } from '@lyvely/users';
import { ProfileInfo, ProfileInfoSchema, Profile } from '@lyvely/profiles';
import { InvitationsNotificationCategory } from './invitations.notification-category';
import { assureStringId } from '@lyvely/core';

@Notification()
export class ProfileInvitationNotification extends NotificationType<ProfileInvitationNotification> {
  @Prop({ type: ProfileInfoSchema })
  @PropertyType(ProfileInfo)
  profileInfo: ProfileInfo;

  @Prop({ type: UserInfoSchema })
  @PropertyType(UserInfo)
  userInfo: UserInfo;

  constructor(profile: Profile, host: User) {
    super({
      userInfo: new UserInfo(host),
      profileInfo: new ProfileInfo(profile),
    });
  }

  getTitle(context: NotificationContext): Translatable {
    return {
      key: 'invitations.notifications.title',
      params: {
        hostName: escapeHtmlIf(this.userInfo?.name, context.format === RenderFormat.HTML),
        profileName: escapeHtmlIf(this.profileInfo?.name, context.format === RenderFormat.HTML),
      },
    };
  }

  getBody(ctx: NotificationContext): Translatable {
    return {
      key: 'invitations.notifications.body',
      params: {
        hostName: escapeHtmlIf(this.userInfo?.name, ctx.format === RenderFormat.HTML),
        profileName: escapeHtmlIf(this.profileInfo?.name, ctx.format === RenderFormat.HTML),
      },
    };
  }

  getCategory(): string {
    return InvitationsNotificationCategory.ID;
  }

  getUrl(): UrlRoute | null {
    return { path: '/accept-invitation', query: { pid: assureStringId(this.profileInfo.pid) } };
  }
}
