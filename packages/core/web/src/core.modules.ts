import profileModule from './profiles/module';
import appConfigModule from './app-config/module';
import authModule from './auth/module';
import i18nModule from './i18n/module';
import contentModule from './content/module';
import tagsModule from './tags/module';
import messagesModule from './messages/module';
import uiModule from './ui/module';
import helpModule from './help/module';
import userAccountModule from './user-accounts/module';
import userInvitationsModule from './user-invitations/module';
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
    helpModule(),
    userAccountModule(),
    userInvitationsModule(),
  );
};
