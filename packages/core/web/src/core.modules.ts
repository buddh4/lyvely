import { profilesModule } from './profiles';
import { appConfigModule } from './app-config';
import { authModule } from './auth';
import { captchaModule } from './captcha';
import i18nModule from './i18n/module';
import contentModule from './content/module';
import tagsModule from './tags/module';
import messagesModule from './messages/module';
import { uiModule } from './ui/module';
import chartsModule from './charts/module';
import helpModule from './help/module';
import otpModule from './otp/module';
import notificationsModule from './notifications/module';
import userAccountModule from './user-account/module';
import userRegistrationModule from './user-registration/module';
import userInvitationsModule from './user-invitations/module';
import systemMessagesModule from './system-messages/module';
import { registerModules } from '@/core';

export const registerCoreModules = () => {
  registerModules(
    appConfigModule(),
    i18nModule(),
    authModule(),
    uiModule(),
    profilesModule(),
    contentModule(),
    tagsModule(),
    messagesModule(),
    systemMessagesModule(),
    helpModule(),
    otpModule(),
    userAccountModule(),
    notificationsModule(),
    userInvitationsModule(),
    userRegistrationModule(),
    chartsModule(),
    captchaModule(),
  );
};
