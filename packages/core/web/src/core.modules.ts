import profileModule from './profiles/module';
import appConfigModule from './app-config/module';
import authModule from './auth/module';
import i18nModule from './i18n/module';
import contentModule from './content/module';
import tagsModule from './tags/module';
import messagesModule from './messages/module';
import uiModule from './ui/module';
import chartsModule from './charts/module';
import helpModule from './help/module';
import otpModule from './otp/module';
import notificationsModule from './notifications/module';
import userAccountModule from './user-accounts/module';
import userRegistrationsModule from './user-registrations/module';
import userInvitationsModule from './user-invitations/module';
import systemMessagesModule from './system-messages/module';
import { registerModules } from '@/core';

export const registerCoreModules = () => {
  registerModules(
    appConfigModule(),
    i18nModule(),
    authModule(),
    uiModule(),
    profileModule(),
    contentModule(),
    tagsModule(),
    messagesModule(),
    systemMessagesModule(),
    helpModule(),
    otpModule(),
    userAccountModule(),
    notificationsModule(),
    userInvitationsModule(),
    userRegistrationsModule(),
    chartsModule(),
  );
};
