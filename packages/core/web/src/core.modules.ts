import profileModule from './profiles/module';
import appConfigModule from './app-config/module';
import authModule from './auth/module';
import i18nModule from './i18n/module';
import streamModule from './content-stream/module';
import tagsModule from './tags/module';
import messagesModule from './messages/module';
import { registerModules } from '@/core';

export const registerCoreModules = () => {
  registerModules(
    i18nModule(),
    appConfigModule(),
    authModule(),
    profileModule(),
    streamModule(),
    tagsModule(),
    messagesModule(),
  );
};
